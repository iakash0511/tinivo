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


const normalize = (raw: unknown): ShippingOption[] => {
  const r = raw as Record<string, unknown> | null;
  const available = r?.['options'] as unknown;
  if (!available) return [];

  // drill into expected shape safely
  const optionsObj = r && 'options' in r ? (r['options'] as unknown) : undefined;
  const data = optionsObj && typeof optionsObj === 'object' && optionsObj !== null
    ? ((optionsObj as Record<string, unknown>)['data'] as Record<string, unknown> | undefined)
    : undefined;
  const arr = data && 'available_courier_companies' in data && Array.isArray(data['available_courier_companies'])
    ? (data['available_courier_companies'] as unknown[])
    : undefined;
  if (!arr || !Array.isArray(arr)) return [];

  return arr.map((o) => {
    const opt = o as Record<string, unknown>;
    const courier_name = typeof opt.courier_name === 'string' ? opt.courier_name : String(opt.courier_name ?? '');
    const courier_type = String(opt.courier_type ?? '');
    const ed = opt.estimated_delivery_days ?? opt.etd_hours;
    const estimated_days = typeof ed === 'number' || typeof ed === 'string' ? (ed as string | number) : undefined;
    const rate = Number((opt.rate ?? opt.freight_charge) ?? 0);

    return {
      courier_name,
      service_type: courier_type === "0" ? "Air" : "Surface",
      estimated_days,
      rate,
      raw: opt,
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
  const cartItems = useCart((s) => s.items) as CartItem[];
  const subtotal = useCart((s) =>
    s.items.reduce((acc, it) => acc + it.price * it.quantity, 0)
  );
  const paymentMethod = useCheckoutStore((s) => s.paymentMethod);
  const setShippingOption = useCheckoutStore((s) => s.setShippingOption);
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
        const txt = await res.json().catch(() => null) as unknown;
        let errorMessage: string | null = null;
        if (txt && typeof txt === 'object') {
          const t = txt as Record<string, unknown>;
          if (typeof t.error === 'string') errorMessage = t.error;
          else if (typeof t.message === 'string') errorMessage = t.message;
        }
        throw new Error(errorMessage ?? `Shiprocket returned ${res.status}`);
      }

      const json = await res.json();
      const normalized = normalize(json);
      setOptions(normalized);

      if (normalized.length > 0) {
        const mapped = normalized.map((o) => {
          const raw = o.raw as Record<string, unknown> | undefined;
          const v = raw && 'etd_hours' in raw ? raw['etd_hours'] : undefined;
          const etd = typeof v === 'number' ? v : (typeof v === 'string' && !Number.isNaN(Number(v)) ? Number(v) : undefined);
          return { option: o, etd };
        });

        const fastestEntry = mapped
          .filter((m) => typeof m.etd === 'number')
          .sort((a, b) => (a.etd as number) - (b.etd as number))[0];

        const fastest = fastestEntry ? fastestEntry.option : undefined;

        if (fastest && (!selected || fastest.rate !== selected.rate)) {
          setShippingOption(fastest);
        }
      } else {
        setShippingOption(null);
      }
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'message' in err && typeof (err as { message?: unknown }).message === 'string'
        ? (err as { message?: string }).message
        : null;
      setError(message ?? "Failed to fetch shipping options");
      setOptions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // create a *stable* debounced function — only recreate when forceRefreshKey changes
  // this prevents recreation on every weight/subtotal/paymentMethod change
  const fetchOptionsCb = useRef<((pc: string) => Promise<void>) | undefined>(undefined);

  // wrap fetchOptions in a stable ref so debounced can call latest impl
  fetchOptionsCb.current = fetchOptions;

  const forceRefreshKey = opts?.forceRefreshKey;

  type DebouncedFn = ((pc: string) => void) & { cancel: () => void };
  const noopDebounced: DebouncedFn = Object.assign(() => {}, { cancel: () => {} });
  const debouncedRef = useRef<DebouncedFn>(noopDebounced);

  // Recreate debounced function when `forceRefreshKey` changes.
  useEffect(() => {
    const d = debounce((pc: string) => fetchOptionsCb.current && fetchOptionsCb.current(pc), 600) as DebouncedFn;
    debouncedRef.current = d;
    return () => {
      d.cancel();
    };
  }, [forceRefreshKey]);

  useEffect(() => {
    if (!pincode || !/^[1-9][0-9]{5}$/.test(pincode)) {
      setOptions([]);
      setError(null);
      return;
    }

    // call the stable debounced function
    debouncedRef.current(pincode);

    return () => {
      debouncedRef.current.cancel();
    };
  }, [pincode]);

  // public refresh to run immediate fetch using latest params
  const refresh = () => {
    if (pincode && /^[1-9][0-9]{5}$/.test(pincode)) {
      fetchOptions(pincode);
    }
  };

  return { options, isLoading, error, refresh, selected };
}
