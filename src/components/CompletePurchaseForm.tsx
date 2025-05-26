'use client';

import { useState, useEffect } from 'react';
import { completePurchase } from '../engine/CompletePurchase';
import { getPendingPurchase } from '../engine/GetPendingPurchase';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Info, Loader2, CheckCheck } from 'lucide-react';

export function CompletePurchaseForm() {
  const [tokenId, setTokenId] = useState('');
  const [success, setSuccess] = useState<boolean>(true);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');
  const [pendingPurchase, setPendingPurchase] = useState<{
    exists: boolean;
    buyer: string;
    amount: bigint;
  } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (tokenId) {
        fetchPendingPurchase(tokenId);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [tokenId]);

  const fetchPendingPurchase = async (id: string) => {
    try {
      setIsLoading(true);
      setPendingPurchase(null);
      setError('');
      const tokenIdNumber = parseInt(id);
      if (isNaN(tokenIdNumber))
        throw new Error('Token ID must be a valid number');
      const purchase = await getPendingPurchase(tokenIdNumber);
      setPendingPurchase(purchase);
      if (!purchase.exists)
        setError('No pending purchase found for this property');
    } catch (err) {
      console.error('Error fetching pending purchase:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to fetch pending purchase',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setTxHash('');

    try {
      const tokenIdNumber = parseInt(tokenId);
      if (isNaN(tokenIdNumber))
        throw new Error('Token ID must be a valid number');
      if (!pendingPurchase?.exists)
        throw new Error('No pending purchase exists for this property');

      const hash = await completePurchase(tokenIdNumber, success, reason);
      setTxHash(typeof hash === 'string' ? hash : hash.transactionHash);
    } catch (err) {
      console.error('Error completing purchase:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to complete purchase',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className='mt-6 p-6'>
      <CardHeader className='flex flex-row items-center gap-3'>
        <CheckCheck className='text-primary w-6 h-6' />
        <h2 className='text-xl font-semibold'>Complete Property Purchase</h2>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <Label htmlFor='tokenId'>Token ID</Label>
            <div className='relative'>
              <Input
                id='tokenId'
                type='number'
                placeholder='1'
                value={tokenId}
                onChange={e => setTokenId(e.target.value)}
                required
              />
              <Info
                className='absolute right-2 top-2 h-4 w-4 text-muted-foreground'
                title='Enter the token ID of the property'
              />
            </div>
            <p className='text-sm text-muted-foreground mt-1'>
              Enter the token ID of the property to complete purchase.
            </p>
          </div>

          {isLoading && (
            <div className='flex justify-center'>
              <Loader2 className='h-5 w-5 animate-spin text-primary' />
            </div>
          )}

          {pendingPurchase && pendingPurchase.exists && (
            <Card className='bg-muted/30 border'>
              <CardContent className='space-y-1 py-3'>
                <p className='text-sm font-medium'>Pending Purchase Details:</p>
                <p className='text-sm'>
                  <strong>Buyer:</strong> {pendingPurchase.buyer}
                </p>
                <p className='text-sm'>
                  <strong>Amount:</strong> {pendingPurchase.amount.toString()}{' '}
                  wei
                </p>
              </CardContent>
            </Card>
          )}

          <div>
            <Label>Purchase Decision</Label>
            <RadioGroup
              defaultValue={success ? 'approve' : 'reject'}
              onValueChange={val => setSuccess(val === 'approve')}
              className='space-y-2 mt-2'
            >
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='approve' id='approve' />
                <Label htmlFor='approve'>Approve and complete purchase</Label>
              </div>
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='reject' id='reject' />
                <Label htmlFor='reject'>Reject purchase</Label>
              </div>
            </RadioGroup>
          </div>

          {!success && (
            <div>
              <Label htmlFor='reason'>Rejection Reason</Label>
              <Textarea
                id='reason'
                placeholder='Reason for rejecting the purchase'
                rows={2}
                value={reason}
                onChange={e => setReason(e.target.value)}
              />
              <p className='text-sm text-muted-foreground mt-1'>
                Enter the reason for rejecting this purchase (optional).
              </p>
            </div>
          )}

          <Button
            type='submit'
            disabled={isSubmitting || isLoading || !pendingPurchase?.exists}
            className='w-full py-2'
            variant={success ? 'default' : 'destructive'}
          >
            {isSubmitting ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Processing...
              </>
            ) : !pendingPurchase?.exists ? (
              'No Pending Purchase'
            ) : success ? (
              'Complete Purchase'
            ) : (
              'Reject Purchase'
            )}
          </Button>

          {error && (
            <Alert variant='destructive'>
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {txHash && (
            <Alert variant={success ? 'success' : 'default'}>
              <AlertTitle>
                {success ? 'Purchase Completed!' : 'Purchase Rejected'}
              </AlertTitle>
              <AlertDescription>
                <div className='mt-2 text-sm font-semibold'>
                  Transaction hash:
                </div>
                <div className='font-mono break-all bg-muted p-2 rounded mt-1'>
                  {txHash}
                </div>
                <p className='mt-2 text-sm'>
                  {success
                    ? 'Purchase has been completed. The property ownership has been transferred and the payment has been sent to the seller.'
                    : "Purchase has been rejected. The buyer's funds have been refunded."}
                </p>
              </AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
