'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';

import { Image, RefreshCw } from 'lucide-react';
import { PropertyCard } from './PropertyCard';
import type { Property } from '../engine/GetPropertiesUtils';
import { getAllProperties } from '../engine/GetPropertiesUtils';

export function PropertyGrid() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null,
  );

  const fetchProperties = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const propertiesData = await getAllProperties();
      console.log('Fetched properties:', propertiesData);
      setProperties(propertiesData);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError('Failed to fetch properties. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(
      selectedProperty?.propertyAddress === property.propertyAddress
        ? null
        : property,
    );
  };

  const getIpfsUrl = (ipfsUrl: string): string => {
    if (ipfsUrl.startsWith('http')) return ipfsUrl;
    const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || 'default';
    if (ipfsUrl.startsWith('ipfs://')) {
      const ipfsHash = ipfsUrl.replace('ipfs://', '');
      return `https://${clientId}.ipfscdn.io/ipfs/${ipfsHash}`;
    }
    return ipfsUrl;
  };

  return (
    <Card className='p-6 mt-6'>
      <div className='flex items-center justify-between mb-6'>
        <div className='flex items-center gap-2'>
          <Image className='w-7 h-7 text-primary' />
          <h2 className='text-2xl font-semibold'>Real Estate Properties</h2>
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={fetchProperties}
              disabled={isLoading}
            >
              {isLoading ? (
                <RefreshCw className='w-5 h-5 animate-spin' />
              ) : (
                <RefreshCw className='w-5 h-5' />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Refresh properties</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <Separator className='mb-6' />

      {isLoading ? (
        <div className='flex justify-center my-6'>
          <Skeleton className='w-12 h-12 rounded-full' />
        </div>
      ) : error ? (
        <Alert variant='destructive' className='mb-4'>
          <AlertTitle>{error}</AlertTitle>
        </Alert>
      ) : properties.length === 0 ? (
        <Alert variant='default' className='mb-4 text-center'>
          <AlertTitle>No properties found.</AlertTitle>
          <AlertDescription className='mt-2 mx-auto'>
            It seems there are no properties registered yet. Please check back
            later or contact support if you believe this is an error.
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <h3 className='text-lg font-medium mb-2'>
            Showing {properties.length}{' '}
            {properties.length === 1 ? 'property' : 'properties'}
          </h3>

          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2'>
            {properties.map((property, index) => (
              <PropertyCard
                key={`${property.propertyAddress}-${index}`}
                property={property}
                onCardClick={handlePropertyClick}
                isSelected={
                  selectedProperty?.propertyAddress === property.propertyAddress
                }
              />
            ))}
          </div>
        </>
      )}

      {selectedProperty && (
        <div className='mt-6'>
          <Separator className='mb-4' />
          <h3 className='text-lg font-semibold mb-3'>Selected Property</h3>
          <div className='p-4 border rounded-md bg-muted'>
            <p className='mb-2'>
              <strong>Address:</strong> {selectedProperty.propertyAddress}
            </p>
            <p className='mb-2'>
              <strong>Price:</strong> {Number(selectedProperty.price) / 1e18}{' '}
              ETH
            </p>
            <p className='mb-2'>
              <strong>Area:</strong> {selectedProperty.squareMeters.toString()}{' '}
              m²
            </p>
            <p className='mb-2'>
              <strong>Legal Identifier:</strong>{' '}
              {selectedProperty.legalIdentifier}
            </p>
            <p className='mb-2'>
              <strong>Document Hash:</strong>{' '}
              {selectedProperty.documentHash.startsWith('ipfs://') ? (
                <a
                  href={getIpfsUrl(selectedProperty.documentHash)}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='underline text-primary'
                >
                  View Documents
                </a>
              ) : (
                selectedProperty.documentHash
              )}
            </p>
            <p>
              <strong>Verification Status:</strong>{' '}
              {selectedProperty.verifier &&
              selectedProperty.verifier !==
                '0x0000000000000000000000000000000000000000'
                ? `Verified by ${selectedProperty.verifier.substring(
                    0,
                    6,
                  )}...${selectedProperty.verifier.substring(38)}`
                : 'Not Verified'}
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}
