'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Properties', href: '/properties' },
  { label: 'Admin', href: '/admin' },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <div className='hidden md:flex items-center justify-center flex-1'>
      <div className='flex items-center space-x-6'>
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'text-sm font-medium transition-colors hover:text-primary',
              pathname === item.href ? 'text-foreground' : 'text-foreground/60',
            )}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
