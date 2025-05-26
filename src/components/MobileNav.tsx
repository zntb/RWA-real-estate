'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Properties', href: '/properties' },
  { label: 'Admin', href: '/admin' },
];

interface MobileNavProps {
  onNavItemClick?: () => void;
}

export function MobileNav({ onNavItemClick }: MobileNavProps) {
  const pathname = usePathname();

  return (
    <div className='pr-6'>
      <h4 className='font-bold mb-4 px-4'>Real Estate RWA</h4>
      <div className='flex flex-col space-y-2'>
        {navItems.map(item => (
          <Button
            key={item.href}
            asChild
            variant='ghost'
            className={cn(
              'w-full justify-start',
              pathname === item.href && 'bg-accent',
            )}
            onClick={onNavItemClick}
          >
            <Link href={item.href}>{item.label}</Link>
          </Button>
        ))}
      </div>
    </div>
  );
}
