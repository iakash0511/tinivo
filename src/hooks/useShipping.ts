"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import debounce from "lodash.debounce";
import { useCart } from "@/store/cart/cart-store";
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

function toNumber(v: any) {
  if (v == null) return 0;
  if (typeof v === "number") return v;
  const cleaned = String(v).replace(/[^\d.]/g, "");
  return cleaned ? Number(cleaned) : 0;
}

const normalize = (raw: any): ShippingOption[] => {
  if (!raw?.options?.data?.available_courier_companies) return [];

  const arr = raw.options.data.available_courier_companies;

  return arr.map((o: any) => {
    return {
      courier_name: o.courier_name,
      service_type: o.courier_type === "0" ? "Air" : "Surface",
      estimated_days: o.estimated_delivery_days || o.etd_hours || null,
      rate: Number(o.rate || o.freight_charge || 0),
      raw: o,
    } as ShippingOption;
  });
};

export function useShipping(
  pincode?: string,
  opts?: { forceRefreshKey?: any }
): UseShippingResult {
  const [options, setOptions] = useState<ShippingOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cartItems = useCart((s) => s.items);
  const subtotal = useCart((s) =>
    s.items.reduce((acc, it) => acc + it.price * it.quantity, 0)
  );
  const paymentMethod = useCheckoutStore((s) => s.paymentMethod);
  const setShippingOption = useCheckoutStore((s) => s.setShippingOption);
  const selected = useCheckoutStore((s) => s.shippingOption);

  // compute approximate weight from items (fallback to 0.5kg)
  const weight = useMemo(() => {
    const w = cartItems?.reduce(
      (acc: number, it: any) => acc + (it.weight ?? 0.1) * (it.quantity ?? 1),
      0
    );
    return w && w > 0 ? Number(w.toFixed(2)) : 0.5;
  }, [cartItems]);

  // keep latest params in a ref so the stable debounced fn can read them
  const latestParamsRef = useRef({
    weight,
    paymentMethod,
    subtotal,
  });

  // update the ref whenever those values change
  useEffect(() => {
    latestParamsRef.current = { weight, paymentMethod, subtotal };
  }, [weight, paymentMethod, subtotal]);

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
      const { paymentMethod: pm, subtotal: declared_value, weight: w } =
        latestParamsRef.current;
      const cod = pm === "cod" ? "1" : "0";
      const declared = Math.round(declared_value || 0);

      const res = await fetch(
        `/api/shippingrates?delivery_postcode=${encodeURIComponent(
          pc
        )}&weight=${encodeURIComponent(String(w))}&cod=${cod}&declared_value=${declared}`,
        { method: "GET", headers: { "Content-Type": "application/json" } }
      );

      if (!res.ok) {
        const txt = await res.json().catch(() => null);
        throw new Error(
          txt?.error || txt?.message || `Shiprocket returned ${res.status}`
        );
      }

      const json = await res.json();
      const normalized = normalize(json);
      setOptions(normalized);

      if (normalized.length > 0) {
        const fastest = normalized
          .filter((o) => typeof o.raw?.etd_hours === "number")
          .sort((a, b) => a.raw.etd_hours - b.raw.etd_hours)[0];

        if (fastest && (!selected || fastest.rate !== selected.rate)) {
          setShippingOption(fastest);
        }
      } else {
        setShippingOption(null);
      }
    } catch (err: any) {
      setError(err?.message ?? "Failed to fetch shipping options");
      setOptions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // create a *stable* debounced function — only recreate when forceRefreshKey changes
  // this prevents recreation on every weight/subtotal/paymentMethod change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounced = useMemo(
    () => debounce((pc: string) => fetchOptions(pc), 600),
    [opts?.forceRefreshKey]
  );

  useEffect(() => {
    if (!pincode || !/^[1-9][0-9]{5}$/.test(pincode)) {
      setOptions([]);
      setError(null);
      return;
    }

    // call the stable debounced function
    debounced(pincode);

    return () => {
      debounced.cancel();
    };
  }, [pincode, debounced]);

  // public refresh to run immediate fetch using latest params
  const refresh = () => {
    if (pincode && /^[1-9][0-9]{5}$/.test(pincode)) {
      fetchOptions(pincode);
    }
  };

  return { options, isLoading, error, refresh, selected };
}
