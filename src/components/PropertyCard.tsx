import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Property } from '../engine/GetPropertiesUtils';
import { CheckCircle2, Home } from 'lucide-react';

const propertyStates = {
  0: { label: 'Initial Offering', color: 'bg-sky-500' },
  1: { label: 'For Sale', color: 'bg-green-500' },
  2: { label: 'Pending Sale', color: 'bg-yellow-500' },
  3: { label: 'Sold', color: 'bg-red-500' },
  4: { label: 'Not For Sale', color: 'bg-muted' },
};

interface PropertyCardProps {
  property: Property;
  onCardClick?: (property: Property) => void;
  isSelected?: boolean;
}

const convertIPFSToCDN = (ipfsUrl: string): string => {
  const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;
  return ipfsUrl.replace('ipfs://', `https://${clientId}.ipfscdn.io/ipfs/`);
};

const fetchMetadataFromIPFS = async (ipfsUri: string): Promise<any> => {
  try {
    const url = convertIPFSToCDN(ipfsUri);
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return null;
  }
};

export const PropertyCard = ({
  property,
  onCardClick,
  isSelected = false,
}: PropertyCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);

  useEffect(() => {
    if (!property.imageURI) {
      setImageUrl('');
      return;
    }
    const loadImage = async () => {
      setIsLoadingMetadata(true);
      try {
        if (property.imageURI.startsWith('ipfs://')) {
          try {
            const metadata = await fetchMetadataFromIPFS(property.imageURI);
            if (metadata?.data?.image) {
              setImageUrl(convertIPFSToCDN(metadata.data.image));
            } else if (metadata?.image) {
              setImageUrl(convertIPFSToCDN(metadata.image));
            } else {
              setImageUrl(convertIPFSToCDN(property.imageURI));
            }
          } catch {
            setImageUrl(convertIPFSToCDN(property.imageURI));
          }
        } else {
          setImageUrl(property.imageURI);
        }
      } catch (error) {
        console.error('Error processing imageURI:', error);
      } finally {
        setIsLoadingMetadata(false);
      }
    };
    loadImage();
    setImageError(false);
  }, [property.imageURI]);

  const formatEthPrice = (price: bigint): string =>
    `${Number(price) / 1e18} ETH`;
  const stateInfo = propertyStates[
    property.state as keyof typeof propertyStates
  ] || {
    label: 'Unknown',
    color: 'bg-muted',
  };

  return (
    <Card
      className={cn(
        'relative overflow-visible transition-transform duration-200',
        isSelected ? 'border-primary border-2' : 'border border-muted',
        onCardClick && 'cursor-pointer hover:scale-105',
      )}
      onClick={() => onCardClick?.(property)}
    >
      {property.verifier &&
        property.verifier !== '0x0000000000000000000000000000000000000000' && (
          <div className='absolute -top-2 -right-2 bg-emerald-600 rounded-full shadow p-1'>
            <CheckCircle2 className='text-primary w-5 h-5' />
          </div>
        )}

      {!imageError && imageUrl ? (
        <img
          src={imageUrl}
          alt={property.propertyAddress}
          className='h-[140px] w-full object-cover'
          onError={() => setImageError(true)}
        />
      ) : (
        <div className='h-[140px] flex items-center justify-center bg-muted'>
          {isLoadingMetadata ? (
            <span className='text-muted-foreground text-sm'>Loading...</span>
          ) : (
            <Home className='w-12 h-12 text-muted-foreground' />
          )}
        </div>
      )}

      <Badge
        className={cn(
          'absolute top-2 right-2 text-white font-bold text-xs',
          stateInfo.color,
        )}
      >
        {stateInfo.label}
      </Badge>

      <CardContent className='space-y-2'>
        <h3
          className='text-lg font-semibold truncate'
          title={property.propertyName}
        >
          {property.propertyName}
        </h3>
        <h4
          className='text-base font-semibold truncate'
          title={property.propertyAddress}
        >
          {property.propertyAddress}
        </h4>

        <Separator />

        <div className='flex justify-between text-sm text-muted-foreground'>
          <span>Price:</span>
          <span className='font-medium text-foreground'>
            {formatEthPrice(property.price)}
          </span>
        </div>
        <div className='flex justify-between text-sm text-muted-foreground'>
          <span>Area:</span>
          <span>{property.squareMeters.toString()} m²</span>
        </div>
        <div className='flex justify-between text-sm text-muted-foreground'>
          <span>Legal ID:</span>
          <span
            className='truncate max-w-[150px]'
            title={property.legalIdentifier}
          >
            {property.legalIdentifier}
          </span>
        </div>

        {property.documentHash && (
          <div className='flex justify-between text-sm text-muted-foreground'>
            <span>Document:</span>
            <span
              className={cn(
                'truncate max-w-[150px]',
                property.documentHash.startsWith('ipfs://') &&
                  'text-primary underline cursor-pointer',
              )}
              title={property.documentHash}
              onClick={() => {
                if (property.documentHash.startsWith('ipfs://')) {
                  const url = convertIPFSToCDN(property.documentHash);
                  window.open(url, '_blank');
                }
              }}
            >
              View Document
            </span>
          </div>
        )}

        <div className='flex justify-between text-sm text-muted-foreground'>
          <span>Verified:</span>
          <span>
            {property.verifier &&
            property.verifier !== '0x0000000000000000000000000000000000000000'
              ? 'Yes'
              : 'No'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
