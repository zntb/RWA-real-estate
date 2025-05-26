'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ModeToggle } from './ModeToggle';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Properties', href: '/properties' },
  { label: 'Admin', href: '/admin' },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <div className='hidden md:flex items-center w-full'>
      {/* Centered nav container */}
      <div className='mx-auto'>
        <div className='flex items-center space-x-6'>
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                pathname === item.href
                  ? 'text-foreground'
                  : 'text-foreground/60',
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Mode toggle absolutely positioned on right */}
      <div className='ml-auto'>
        <ModeToggle />
      </div>
    </div>
  );
}
