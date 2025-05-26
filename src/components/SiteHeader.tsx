'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { MainNav } from '@/components/MainNav';
import { MobileNav } from '@/components/MobileNav';
import { ModeToggle } from '@/components/ModeToggle';

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='flex h-14 items-center'>
        <div className='container mx-auto flex items-center px-4'>
          {/* Logo */}
          <div className='hidden md:flex mr-4'>
            <Link href='/' className='flex items-center'>
              <span className='hidden font-bold sm:inline-block'>
                Real Estate RWA
              </span>
            </Link>
          </div>

          {/* Mobile menu button */}
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

          {/* Theme toggle */}
          <div className='ml-auto'>
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
