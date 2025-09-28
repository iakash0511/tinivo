// hooks/useCheckoutCTA.ts
import { useMemo } from 'react';
import { useCartTotal } from './useCartTotal';

export function useCheckoutCTA() {
  const {  total } = useCartTotal()

  const selectedCTA = useMemo(() => {
    const ctaOptions = [
    'Wrap My Joy 🎁',
    'Make It Mine 💖',
    'I Want This Happiness ✨',
    'Get My Goodies ➡️',
    'Seal the Joy 💌',
    'Ready to Gift 🎀',
    'Checkout with Smiles 😊',
    'Let’s Wrap This Up',
    'Bring It Home 🏡',
    'Claim My Cute Stuff',
  ];
    const index = Math.floor(Math.random() * ctaOptions.length);
    if (total > 1000) return 'Seal the Joy 💌'
    return ctaOptions[index];
  }, [total]);

  return selectedCTA;
}
