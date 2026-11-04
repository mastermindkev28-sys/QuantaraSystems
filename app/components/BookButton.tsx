import Link from 'next/link';
import { Arrow } from './Icons';

// Every call to action leads to the consultation page, which collects a short
// intake before offering a time.
export default function BookButton({
  children,
  variant = 'primary',
  size,
  arrow = true,
  className = '',
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'ghost';
  size?: 'sm';
  arrow?: boolean;
  className?: string;
}) {
  return (
    <Link href="/consultation" className={`btn btn--${variant}${size ? ` btn--${size}` : ''} ${className}`}>
      {children}
      {arrow && <Arrow />}
    </Link>
  );
}
