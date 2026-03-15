"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import debounce from "lodash.debounce";
import { useCart } from "@/store/cart/cart-store";
import type { CartItem } from '@/store/cart/cart-store'
import {
  useCheckoutStore,
  ShippingOption,
} from "@/store/checkout/checkout-store";

type UseShippingResult = {
  options: ShippingOption[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
  selected: ShippingOption | null;
};

// Types corresponding to Shiprocket's Courier object
interface ShiprocketCourier {
  courier_name: string;
  courier_type: string | number;
  courier_company_id: string | number;
  etd_hours?: string | number;
  estimated_delivery_days?: string | number;
  rate?: string | number;
  freight_charge?: string | number;
}

interface ShiprocketServiceabilityResponse {
  data?: {
    available_courier_companies?: ShiprocketCourier[];
  };
}

const normalize = (json: { options?: ShiprocketServiceabilityResponse }): ShippingOption[] => {
  const arr = json?.options?.data?.available_courier_companies;
  if (!arr || !Array.isArray(arr)) return [];

  return arr.map((opt) => {
    const courier_name = String(opt.courier_name || "Courier");
    const courier_type = String(opt.courier_type || "");
    
    // Some couriers return etd_hours, some return estimated_delivery_days
    const etd = opt.estimated_delivery_days ?? opt.etd_hours;
    const estimated_days = typeof etd === "number" || typeof etd === "string" ? String(etd) : undefined;
    
    const rateRaw = opt.rate ?? opt.freight_charge ?? 0;
    const rate = Number(rateRaw);

    return {
      courier_name,
      service_type: courier_type === "0" ? "Air" : "Surface",
      estimated_days,
      rate,
      raw: opt, // keep raw for internal routing if needed
    } as ShippingOption;
  });
};

export function useShipping(
  pincode?: string,
  opts?: { forceRefreshKey?: unknown }
): UseShippingResult {
  const [options, setOptions] = useState<ShippingOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const items = useCart((s) => s.items);
  const buyNowItem = useCart((s) => s.buyNowItem);
  const cartItems = (buyNowItem ? [buyNowItem] : items) as CartItem[];
  
  const subtotal = cartItems.reduce((acc, it) => acc + it.price * it.quantity, 0);
  
  const paymentMethod = useCheckoutStore((s) => s.paymentMethod);
  const setShippingOption = useCheckoutStore((s) => s.setShippingOption);
  const setShippingOptions = useCheckoutStore((s) => s.setShippingOptions);
  const selected = useCheckoutStore((s) => s.shippingOption);

  // compute approximate weight from items (fallback to 0.5kg)
  type ItemWithWeight = CartItem & { weight?: number };
  const weight = useMemo(() => {
    const w = (cartItems as ItemWithWeight[] | undefined)?.reduce(
      (acc: number, it: ItemWithWeight) => acc + (it.weight ?? 0.1) * (it.quantity ?? 1),
      0
    );
    return w && w > 0 ? Number(w.toFixed(2)) : 0.5;
  }, [cartItems]);
  
  const dimensions = useMemo(() => {
    if (!cartItems.length) {
      return { length: 10, breadth: 10, height: 5 }
    }

    return {
      length: Math.max(...cartItems.map(i => i.length || 10)),
      breadth: Math.max(...cartItems.map(i => i.breadth || 10)),
      height: Math.max(...cartItems.map(i => i.height || 5)),
    }
  }, [cartItems])

  // keep latest params in a ref so the stable debounced fn can read them
  const latestParamsRef = useRef({
    weight,
    paymentMethod,
    subtotal,
    dimensions
  })

  useEffect(() => {
    latestParamsRef.current = {
      weight,
      paymentMethod,
      subtotal,
      dimensions
    }
  }, [weight, paymentMethod, subtotal, dimensions])


  // stable fetch function that reads current params from the ref
  const fetchOptions = async (pc: string) => {
    if (!pc || !/^[1-9][0-9]{5}$/.test(pc)) {
      setOptions([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { paymentMethod: pm, subtotal: declared_value, weight: w, dimensions } = latestParamsRef.current;
      const cod = pm === "cod" ? "1" : "0";
      const declared = Math.round(declared_value || 0);

      const res = await fetch("/api/shippingrates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          delivery_postcode: pc,
          weight: w,
          length: dimensions.length,
          breadth: dimensions.breadth,
          height: dimensions.height,
          cod,
          declared,
        }),
      });

      if (!res.ok) {
        const txt = await res.json().catch(() => ({}));
        throw new Error(txt.error || txt.message || `API returned ${res.status}`);
      }

      const json = await res.json();
      const normalized = normalize(json);
      setOptions(normalized);

      if (normalized.length > 0) {
        // Standard is ALWAYS the absolute cheapest option
        const standard = [...normalized].sort((a, b) => (a.rate ?? 0) - (b.rate ?? 0))[0];

        // Express candidates: options that are strictly FASTER than the standard option
        const standardDays = Number(standard.estimated_days || 10);
        
        let expressCandidates = normalized.filter((opt) => {
           const days = Number(opt.estimated_days || 10);
           return days < standardDays;
        });

        // Out of available faster options, pick the cheapest one for the best customer experience
        let express = expressCandidates.sort((a, b) => (a.rate ?? 0) - (b.rate ?? 0))[0];

        // Rename them to Standard and Express for the UI
        if (standard) standard.courier_name = "Standard";
        if (express) express.courier_name = "Express";

        setShippingOptions({
          standard,
          express
        });
        
        // Auto-select standard if nothing is selected yet
        if (!selected) {
           setShippingOption({ ...standard, express: false, standard: true });
        }
      } else {
        setShippingOptions({});
        setShippingOption(null);
        setError("No serviceable couriers found for this pincode.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to fetch shipping options";
      setError(message);
      setOptions([]);
      setShippingOptions({});
      setShippingOption(null);
    } finally {
      setIsLoading(false);
    }
  };

  // create a *stable* debounced function
  const fetchOptionsCb = useRef<((pc: string) => Promise<void>) | undefined>(undefined);
  fetchOptionsCb.current = fetchOptions;

  const forceRefreshKey = opts?.forceRefreshKey;

  type DebouncedFn = ((pc: string) => void) & { cancel: () => void };
  const noopDebounced: DebouncedFn = Object.assign((pc: string) => {}, { cancel: () => {} });
  const debouncedRef = useRef<DebouncedFn>(noopDebounced);

  useEffect(() => {
    const d = debounce((pc: string) => fetchOptionsCb.current?.(pc), 600) as DebouncedFn;
    debouncedRef.current = d;
    return () => d.cancel();
  }, [forceRefreshKey]);

  useEffect(() => {
    if (!pincode || !/^[1-9][0-9]{5}$/.test(pincode)) {
      setOptions([]);
      setError(null);
      return;
    }

    debouncedRef.current(pincode);

    return () => debouncedRef.current.cancel();
  }, [pincode, paymentMethod, subtotal, weight, forceRefreshKey]);

  const refresh = () => {
    if (pincode && /^[1-9][0-9]{5}$/.test(pincode)) {
      fetchOptions(pincode);
    }
  };

  return { options, isLoading, error, refresh, selected };
}
