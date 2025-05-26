// import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

export function SiteFooter() {
  return (
    <footer className='py-6 border-t'>
      <div className='container'>
        <div className='flex flex-wrap gap-8'>
          <div className='flex-1 min-w-[300px]'>
            <h6 className='text-lg font-semibold mb-2'>About Us</h6>
            <p className='text-sm text-muted-foreground'>
              Real Estate RWA is a pioneering blockchain-based platform for
              tokenizing real estate assets, enabling fractional ownership and
              transparent property transactions.
            </p>
          </div>
          <div className='flex-1 min-w-[300px]'>
            <h6 className='text-lg font-semibold mb-2'>Contact Us</h6>
            <p className='text-sm text-muted-foreground'>
              123 Blockchain Avenue
            </p>
            <p className='text-sm text-muted-foreground'>
              Email: info@realestate-rwa.com
            </p>
            <p className='text-sm text-muted-foreground'>
              Phone: +1 234 567 8900
            </p>
          </div>
          <div className='flex-1 min-w-[300px]'>
            <h6 className='text-lg font-semibold mb-2'>Legal</h6>
            <p className='text-sm text-muted-foreground'>Terms of Service</p>
            <p className='text-sm text-muted-foreground'>Privacy Policy</p>
          </div>
        </div>
        <Separator className='my-4' />
        <p className='text-sm text-muted-foreground text-center'>
          © {new Date().getFullYear()} Real Estate RWA. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
