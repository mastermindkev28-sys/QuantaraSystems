import Image from 'next/image';
import mark from '../../public/brand/quantara-mark-silver.png';

// The Quantara mark (silver). A gold version is in public/brand/ for print and
// other uses where gold suits the material better.
export default function Logo({ size = 34, priority }: { size?: number; priority?: boolean }) {
  return <Image src={mark} alt="" width={size} height={size} priority={priority} className="logo" />;
}
