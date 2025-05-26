'use client';

import { useState, useEffect } from 'react';
import {
  verifyProperty,
  isVerifierWalletApproved,
} from '../engine/VerifyProperty';
import { verifierWallet } from '../engine/VerifierWallet';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  BadgeCheck,
  Info,
  Loader2,
  Wallet,
  AlertCircle,
  XCircle,
  ShieldX,
  ShieldCheck,
} from 'lucide-react';

export function VerifyPropertyForm() {
  const [tokenId, setTokenId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [error, setError] = useState('');
  const [isVerifierApproved, setIsVerifierApproved] = useState<boolean | null>(
    null,
  );
  const [isCheckingVerifier, setIsCheckingVerifier] = useState(true);

  useEffect(() => {
    const checkVerifier = async () => {
      setIsCheckingVerifier(true);
      try {
        const approved = await isVerifierWalletApproved();
        setIsVerifierApproved(approved);
      } catch (err) {
        console.error('Error checking verifier status:', err);
        setIsVerifierApproved(false);
      } finally {
        setIsCheckingVerifier(false);
      }
    };

    checkVerifier();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setTxHash('');
    setTransactionId('');

    try {
      const tokenIdNumber = parseInt(tokenId);

      if (isNaN(tokenIdNumber)) {
        throw new Error('Token ID must be a valid number');
      }

      const result = await verifyProperty(tokenIdNumber);

      if (!result.success) {
        throw new Error(result.error || 'Verification failed');
      }

      setTxHash(result.transactionHash || '');
      setTransactionId(result.transactionId || '');
    } catch (err) {
      console.error('Error verifying property:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to verify property',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className='p-6 mt-6 justify-center max-w-3xl mx-auto'>
      <div className='flex items-center mb-4 space-x-2'>
        <BadgeCheck className='text-primary w-6 h-6' />
        <h2 className='text-xl font-semibold'>Verify Property</h2>
      </div>

      <div className='border-b mb-6' />

      <div className='mb-4'>
        <div className='flex items-center space-x-2 mb-1'>
          <Wallet className='w-5 h-5 text-muted-foreground' />
          <span className='text-sm font-medium'>Verifier Wallet</span>
        </div>

        {verifierWallet.address ? (
          <div className='font-mono text-sm mb-2 break-all'>
            {verifierWallet.address}
          </div>
        ) : (
          <Alert variant='destructive' className='mb-2'>
            <AlertCircle className='h-4 w-4' />
            <AlertTitle>Missing Verifier Address</AlertTitle>
            <div className='text-sm'>
              The <code>NEXT_PUBLIC_VERIFIER_WALLET_ADDRESS</code> environment
              variable is not set. Please check your <code>.env</code> file and
              restart the application.
            </div>
          </Alert>
        )}

        {verifierWallet.address && (
          <>
            {isCheckingVerifier ? (
              <Loader2 className='h-4 w-4 animate-spin text-muted-foreground' />
            ) : (
              <div
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  isVerifierApproved
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {isVerifierApproved ? (
                  <ShieldCheck className='w-4 h-4 mr-1' />
                ) : (
                  <ShieldX className='w-4 h-4 mr-1' />
                )}
                {isVerifierApproved ? 'Approved Verifier' : 'Not Approved'}
              </div>
            )}

            {!isVerifierApproved && !isCheckingVerifier && (
              <Alert variant='warning' className='mt-2'>
                <XCircle className='h-4 w-4' />
                <AlertTitle>Warning</AlertTitle>
                This wallet is not approved as a verifier. Verification
                transactions may fail. Please add this address as an approved
                verifier using the AddVerifierForm.
              </Alert>
            )}
          </>
        )}
      </div>

      <div className='border-b mb-6' />

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='token-id'>Token ID</Label>
          <div className='relative'>
            <span className='absolute left-3 top-1.5'>🏠</span>
            <Input
              id='token-id'
              type='number'
              value={tokenId}
              onChange={e => setTokenId(e.target.value)}
              placeholder='1'
              className='px-10'
              required
            />
            {/* <Info
              className='absolute right-3 top-2.5 w-4 h-4 text-muted-foreground'
              title='Enter the token ID of the property you want to verify'
            /> */}
          </div>
          <p className='text-sm text-muted-foreground'>
            Enter the token ID of the property to verify
          </p>
        </div>

        <Button
          type='submit'
          disabled={isSubmitting || isVerifierApproved === false}
          className='w-full py-5 text-base'
        >
          {isSubmitting ? (
            <>
              <Loader2 className='w-4 h-4 mr-2 animate-spin' /> Processing...
            </>
          ) : (
            'Verify Property'
          )}
        </Button>
      </form>

      <div className='mt-6 space-y-4'>
        {error && (
          <Alert variant='destructive'>
            <AlertCircle className='h-4 w-4' />
            <AlertTitle>Error</AlertTitle>
            <div className='text-sm'>{error}</div>
          </Alert>
        )}

        {txHash && (
          <Alert variant='success'>
            <ShieldCheck className='h-4 w-4 text-green-500' />
            <AlertTitle>Property Verified Successfully!</AlertTitle>
            <div className='mt-2 space-y-2'>
              <div>
                <div className='text-sm font-semibold'>Transaction ID:</div>
                <div className='bg-muted px-3 py-2 rounded text-xs font-mono break-all'>
                  {transactionId}
                </div>
              </div>
              <div>
                <div className='text-sm font-semibold'>Transaction Hash:</div>
                <div className='bg-muted px-3 py-2 rounded text-xs font-mono break-all'>
                  {txHash}
                </div>
              </div>
            </div>
          </Alert>
        )}
      </div>
    </Card>
  );
}
