'use client';

import { useState, useRef } from 'react';
import { createNewProperty } from '../engine/MintNewAsset';
import { client } from '../client';
import { upload } from 'thirdweb/storage';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Home,
  ImageIcon,
  FileIcon,
  Landmark,
  ScrollText,
  Ruler,
  Info,
  Loader2,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

// Local implementation for IPFS functionality
async function uploadToIPFS(file: File): Promise<string> {
  try {
    const uris = await upload({
      client,
      files: [file],
    });
    console.log('Uploaded to IPFS:', uris);
    return uris;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw new Error('Failed to upload file to IPFS');
  }
}

// Local implementation for creating and uploading metadata
async function createAndUploadMetadata(
  name: string,
  description: string,
  imageUri: string,
  attributes: Array<{ trait_type: string; value: string | number }>,
): Promise<string> {
  try {
    const metadata = {
      name,
      description,
      image: imageUri,
      attributes,
    };

    const uris = await upload({
      client,
      files: [{ name: 'metadata.json', data: metadata }],
    });

    console.log('Metadata uploaded to IPFS:', uris);
    return uris;
  } catch (error) {
    console.error('Error creating/uploading metadata:', error);
    throw new Error('Failed to create or upload metadata');
  }
}

export function CreatePropertyForm() {
  const [formData, setFormData] = useState({
    propertyAddress: '',
    price: '',
    squareMeters: '',
    legalIdentifier: '',
    propertyName: '',
    propertyDescription: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');

  // Image handling
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  // Document handling
  const [selectedDocument, setSelectedDocument] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState<string>('');
  const documentInputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedImage(file);

      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedDocument(file);
      setDocumentName(file.name);
    }
  };

  const triggerImageInput = () => {
    if (imageInputRef.current) {
      imageInputRef.current.click();
    }
  };

  const triggerDocumentInput = () => {
    if (documentInputRef.current) {
      documentInputRef.current.click();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setTxHash('');

    try {
      if (!selectedImage) {
        throw new Error('Property image is required');
      }

      if (!selectedDocument) {
        throw new Error('Property document is required');
      }

      console.log('Uploading image to IPFS...');
      const imageUri = await uploadToIPFS(selectedImage);

      console.log('Uploading document to IPFS...');
      const documentUri = await uploadToIPFS(selectedDocument);

      console.log('Creating and uploading metadata...');
      const attributes = [
        { trait_type: 'Square Meters', value: formData.squareMeters },
        { trait_type: 'Legal Identifier', value: formData.legalIdentifier },
        { trait_type: 'Property Address', value: formData.propertyAddress },
      ];

      const tokenUri = await createAndUploadMetadata(
        formData.propertyName || 'Property NFT',
        formData.propertyDescription ||
          `Property located at ${formData.propertyAddress}`,
        imageUri,
        attributes,
      );

      if (!formData.price || isNaN(Number(formData.price))) {
        throw new Error('Price must be a valid number in wei');
      }
      const priceInWei = BigInt(formData.price);

      if (!formData.squareMeters || isNaN(Number(formData.squareMeters))) {
        throw new Error('Square meters must be a valid number');
      }
      // Ensure it's a whole number by rounding
      const squareMeters = Math.round(Number(formData.squareMeters));

      console.log('Minting new property with tokenURI:', tokenUri);
      const hash = await createNewProperty(
        formData.propertyName,
        formData.propertyAddress,
        priceInWei,
        squareMeters,
        formData.legalIdentifier,
        documentUri,
        tokenUri,
      );

      setTxHash(typeof hash === 'string' ? hash : hash.transactionHash);
    } catch (err) {
      console.error('Error creating property:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to create property',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className='mt-6 justify-center max-w-3xl mx-auto'>
      <CardHeader>
        <div className='flex items-center gap-2'>
          <Home className='h-6 w-6 text-primary' />
          <CardTitle>Create New Property</CardTitle>
        </div>
      </CardHeader>

      <Separator className='mb-4' />

      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Property Image Upload */}
          <div className='space-y-2'>
            <Label>Property Image</Label>
            <div
              className='flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-lg p-6 cursor-pointer bg-muted/50 hover:bg-muted transition-colors'
              onClick={triggerImageInput}
            >
              <input
                type='file'
                accept='image/*'
                className='hidden'
                onChange={handleImageSelect}
                ref={imageInputRef}
              />
              {imagePreview ? (
                <div className='flex flex-col items-center w-full'>
                  <img
                    src={imagePreview}
                    alt='Property Preview'
                    className='max-w-full max-h-48 object-contain rounded-md'
                  />
                  <p className='text-sm text-muted-foreground mt-2'>
                    Click to change image
                  </p>
                </div>
              ) : (
                <>
                  <ImageIcon className='h-12 w-12 text-muted-foreground' />
                  <p className='text-center'>Upload Property Image</p>
                  <p className='text-sm text-muted-foreground text-center'>
                    Click to select an image file (JPG, PNG)
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Document Upload */}
          <div className='space-y-2'>
            <Label>Property Document</Label>
            <div
              className='flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-lg p-6 cursor-pointer bg-muted/50 hover:bg-muted transition-colors'
              onClick={triggerDocumentInput}
            >
              <input
                type='file'
                accept='.pdf,.doc,.docx,.txt'
                className='hidden'
                onChange={handleDocumentSelect}
                ref={documentInputRef}
              />
              {selectedDocument ? (
                <div className='flex flex-col items-center w-full'>
                  <FileIcon className='h-10 w-10 text-primary mb-2' />
                  <p className='text-center'>{documentName}</p>
                  <p className='text-sm text-muted-foreground mt-2'>
                    Click to change document
                  </p>
                </div>
              ) : (
                <>
                  <FileIcon className='h-12 w-12 text-muted-foreground' />
                  <p className='text-center'>Upload Property Document</p>
                  <p className='text-sm text-muted-foreground text-center'>
                    Click to select a document file (PDF, DOC, DOCX, TXT)
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Property Name */}
          <div className='space-y-2'>
            <Label htmlFor='propertyName'>Property Name</Label>
            <div className='relative'>
              <ScrollText className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
              <Input
                id='propertyName'
                name='propertyName'
                value={formData.propertyName}
                onChange={handleChange}
                placeholder='Luxury Beachfront Condo'
                className='pl-10'
              />
            </div>
          </div>

          {/* Property Description */}
          <div className='space-y-2'>
            <Label htmlFor='propertyDescription'>Property Description</Label>
            <Textarea
              id='propertyDescription'
              name='propertyDescription'
              value={formData.propertyDescription}
              onChange={handleChange}
              placeholder='Beautiful property with ocean views...'
              rows={3}
            />
          </div>

          {/* Property Address */}
          <div className='space-y-2'>
            <Label htmlFor='propertyAddress'>Property Address</Label>
            <div className='relative'>
              <Landmark className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
              <Input
                id='propertyAddress'
                name='propertyAddress'
                value={formData.propertyAddress}
                onChange={handleChange}
                placeholder='123 Main St, City, Country'
                required
                className='pl-10'
              />
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* Price */}
            <div className='space-y-2'>
              <Label htmlFor='price'>Price (in wei)</Label>
              <div className='relative'>
                <span className='absolute left-3 top-1/2 transform -translate-y-1/2'>
                  💰
                </span>
                <Input
                  id='price'
                  name='price'
                  value={formData.price}
                  onChange={handleChange}
                  placeholder='1000000000000000000'
                  required
                  className='pl-10'
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className='absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>1 ETH = 1000000000000000000 wei</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className='text-sm text-muted-foreground'>
                1 ETH = 1000000000000000000 wei
              </p>
            </div>

            {/* Square Meters */}
            <div className='space-y-2'>
              <Label htmlFor='squareMeters'>Square Meters</Label>
              <div className='relative'>
                <Ruler className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                <Input
                  id='squareMeters'
                  name='squareMeters'
                  type='number'
                  value={formData.squareMeters}
                  onChange={handleChange}
                  placeholder='100'
                  required
                  className='pl-10'
                />
              </div>
            </div>
          </div>

          {/* Legal Identifier */}
          <div className='space-y-2'>
            <Label htmlFor='legalIdentifier'>Legal Identifier</Label>
            <div className='relative'>
              <ScrollText className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
              <Input
                id='legalIdentifier'
                name='legalIdentifier'
                value={formData.legalIdentifier}
                onChange={handleChange}
                placeholder='DEED-123456'
                required
                className='pl-10'
              />
            </div>
          </div>

          <Button type='submit' className='w-full' disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Processing...
              </>
            ) : (
              'Create Property'
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className='flex flex-col gap-4'>
        {error && (
          <Alert variant='destructive'>
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {txHash && (
          <Alert>
            <AlertTitle>Transaction Successful!</AlertTitle>
            <AlertDescription>
              <div className='mt-2'>
                <p className='font-medium'>Transaction hash:</p>
                <code className='relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm break-all'>
                  {txHash}
                </code>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardFooter>
    </Card>
  );
}
