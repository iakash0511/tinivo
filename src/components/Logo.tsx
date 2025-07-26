import Image from "next/image";

export const Logo = ({ size = 120 , className}: { size?: number, className?: string }) => (
  <Image
    src="/assets/logo.png"
    alt="Tinivo Logo"
    width={size}
    height={size}
    priority
    className={className}
  />
);
