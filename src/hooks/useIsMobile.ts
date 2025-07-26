// hooks/useIsMobile.ts
'use client';

import { useEffect, useState } from 'react';

export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function updateSize() {
      setIsMobile(window.innerWidth < breakpoint);
    }

    updateSize(); // initial check
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [breakpoint]);

  return isMobile;
}
