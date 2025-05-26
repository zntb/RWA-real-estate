'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Home, GalleryHorizontal } from 'lucide-react';
import clsx from 'clsx';

const mockNFTs = [
  {
    id: '1',
    name: 'Property #1',
    price: '0.0000 ETH',
    usdValue: '$0.00',
    area: '224 m²',
    propertyId: 'ID-1',
  },
  {
    id: '2',
    name: 'Property #2',
    price: '0.0000 ETH',
    usdValue: '$0.00',
    area: '224 m²',
    propertyId: 'ID-2',
  },
];

export function NFTGalleryComponent() {
  const [selectedNft, setSelectedNft] = useState<string | null>(null);

  const handleCardClick = (tokenId: string) => {
    setSelectedNft(tokenId === selectedNft ? null : tokenId);
  };

  return (
    <div className='border rounded-lg p-6 mt-6 bg-white shadow-sm'>
      <div className='flex items-center mb-4 space-x-3'>
        <GalleryHorizontal className='text-primary h-6 w-6' />
        <h2 className='text-xl font-semibold'>NFT Marketplace</h2>
      </div>

      <Separator className='mb-4' />

      <h3 className='text-lg font-medium mb-2'>
        Showing {mockNFTs.length > 0 ? `1 - ${mockNFTs.length}` : '0'} of{' '}
        {mockNFTs.length} properties
      </h3>

      <div className='flex flex-wrap gap-4 mt-2'>
        {mockNFTs.map(nft => (
          <div
            key={nft.id}
            className='w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(50%-0.5rem)]'
          >
            <Card
              onClick={() => handleCardClick(nft.id)}
              className={clsx(
                'cursor-pointer transition-all duration-200 border',
                selectedNft === nft.id
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'hover:border-primary/50',
              )}
            >
              <div className='relative h-36 flex items-center justify-center bg-muted'>
                <Home className='w-16 h-16 text-muted-foreground' />
                <Badge className='absolute top-2 right-2 bg-green-600 text-white'>
                  For Sale
                </Badge>
              </div>

              <CardContent className='p-4 space-y-2'>
                <h4 className='text-lg font-semibold'>{nft.name}</h4>

                <div className='flex justify-between text-sm text-muted-foreground'>
                  <span>ID:</span>
                  <span>#{nft.id}</span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-muted-foreground'>Price:</span>
                  <span>{nft.price}</span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-muted-foreground'>USD Value:</span>
                  <span>{nft.usdValue}</span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-muted-foreground'>Area:</span>
                  <span>{nft.area}</span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-muted-foreground'>Property ID:</span>
                  <span>{nft.propertyId}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {selectedNft && (
        <div className='mt-6 text-center'>
          <div className='border border-muted rounded-md px-4 py-3 inline-block bg-muted/40 shadow'>
            <p className='text-base font-medium mb-1'>
              {mockNFTs.find(nft => nft.id === selectedNft)?.name}
            </p>
            <Button variant='outline' size='sm'>
              BUY NOW
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
