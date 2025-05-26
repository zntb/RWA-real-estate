import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  return (
    <div className='mx-auto container py-8 space-y-8'>
      {/* Hero Section */}
      <div className="relative h-[400px] flex flex-col items-center justify-center text-white rounded-lg mb-6 p-4 text-center bg-[linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.7))] bg-[url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center">
        <h1 className='text-4xl font-bold mb-2'>
          Real Estate on the Blockchain
        </h1>
        <p className='text-xl mb-8 max-w-3xl'>
          Discover tokenized properties with transparent ownership and seamless
          transactions
        </p>
        <div className='flex gap-2'>
          <Button asChild variant='secondary' size='lg'>
            <Link href='/properties'>Explore Properties</Link>
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className='mb-6'>
        <h2 className='text-3xl mb-4 text-center'>
          Why Choose Tokenized Real Estate
        </h2>
        <div className='flex flex-wrap gap-4'>
          <Card className='flex-1 min-w-[300px] text-center p-2'>
            <CardHeader>
              <div className='text-5xl mb-1 text-primary'>🔒</div>
              <CardTitle>Security & Transparency</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-muted-foreground'>
                Immutable blockchain records ensure transparent ownership and
                transaction history.
              </p>
            </CardContent>
          </Card>
          <Card className='flex-1 min-w-[300px] text-center p-2'>
            <CardHeader>
              <div className='text-5xl mb-1 text-primary'>💰</div>
              <CardTitle>Fractional Ownership</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-muted-foreground'>
                Own a piece of premium real estate with lower capital
                requirements.
              </p>
            </CardContent>
          </Card>
          <Card className='flex-1 min-w-[300px] text-center p-2'>
            <CardHeader>
              <div className='text-5xl mb-1 text-primary'>🚀</div>
              <CardTitle>Global Liquidity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-muted-foreground'>
                Buy, sell, and trade real estate assets from anywhere in the
                world.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className='bg-primary/10 p-6 rounded-lg text-center mb-6'>
        <h3 className='text-3xl mb-4'>
          Ready to Start Your Property Tokenization Journey?
        </h3>
        <p className='max-w-3xl mx-auto mb-6'>
          Join our platform today and discover how blockchain technology is
          revolutionizing the real estate market.
        </p>
        <div className='flex justify-center gap-2'>
          <Button asChild variant='secondary' size='lg'>
            <Link href='/properties'>Get Started</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
