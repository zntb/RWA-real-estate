'use client';

import { useState } from 'react';
import { removeVerifier } from '../engine/RemoveVerifier';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import {
  Info,
  MinusIcon as PersonMinus,
  Loader2,
  AlertCircle,
  ShieldOff,
} from 'lucide-react';

export function RemoveVerifierForm() {
  const [verifierAddress, setVerifierAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setTxHash('');

    try {
      if (!verifierAddress.startsWith('0x') || verifierAddress.length !== 42) {
        throw new Error('Please enter a valid Ethereum address');
      }

      const hash = await removeVerifier(verifierAddress);
      setTxHash(typeof hash === 'string' ? hash : hash.transactionHash);
    } catch (err) {
      console.error('Error removing verifier:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to remove verifier',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className='p-6 mt-6 justify-center max-w-3xl mx-auto'>
      <div className='flex items-center mb-4 space-x-2'>
        <PersonMinus className='text-red-600 w-6 h-6' />
        <h2 className='text-xl font-semibold'>Remove Verifier</h2>
      </div>

      <div className='border-b mb-6' />

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='verifier-address'>Verifier Address</Label>
          <div className='relative'>
            <span className='absolute left-3 top-1.5'>👤</span>
            <Input
              id='verifier-address'
              value={verifierAddress}
              onChange={e => setVerifierAddress(e.target.value)}
              placeholder='0x...'
              className='px-10'
              required
            />
            {/* <Info
              className='absolute right-3 top-2.5 w-4 h-4 text-muted-foreground'
              // title='Ethereum address of the verifier to remove'
            /> */}
          </div>
          <p className='text-sm text-muted-foreground'>
            Enter the wallet address to revoke verification privileges
          </p>
        </div>

        <Button
          type='submit'
          variant='destructive'
          className='w-full py-5 text-base'
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className='w-4 h-4 mr-2 animate-spin' />
              Processing...
            </>
          ) : (
            'Remove Verifier'
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
            <ShieldOff className='h-4 w-4 text-green-500' />
            <AlertTitle>Verifier Removed Successfully!</AlertTitle>
            <div className='mt-2'>
              <div className='text-sm font-semibold'>Transaction hash:</div>
              <div className='bg-muted px-3 py-2 rounded text-xs font-mono break-all'>
                {txHash}
              </div>
            </div>
          </Alert>
        )}
      </div>
    </Card>
  );
}
