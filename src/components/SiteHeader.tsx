'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { MainNav } from '@/components/MainNav';
import { MobileNav } from '@/components/MobileNav';

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const pathname = usePathname();

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container flex h-14 items-center'>
        <div className='mr-4 hidden md:flex'>
          <Link href='/home' className='mr-6 flex items-center space-x-2'>
            <span className='hidden font-bold sm:inline-block'>
              Real Estate RWA
            </span>
          </Link>
        </div>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant='ghost'
              className='mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden'
            >
              <Menu className='h-5 w-5' />
              <span className='sr-only'>Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side='left' className='pr-0'>
            <MobileNav onNavItemClick={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>

        <MainNav />

        <div className='flex flex-1 items-center justify-between space-x-2 md:justify-end'>
          <nav className='flex items-center space-x-6 text-sm font-medium'>
            {/* You can add additional nav items here */}
          </nav>
        </div>
      </div>
    </header>
  );
}
