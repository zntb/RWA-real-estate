/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { verifyProperty, isApprovedVerifier } from '../engine/VerifyProperty';
import { useActiveAccount } from '../hooks/useActiveAccount';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface VerifyPropertyButtonProps {
  tokenId: number;
  isVerified: boolean;
  onVerificationComplete?: () => void;
}

export const VerifyPropertyButton: React.FC<VerifyPropertyButtonProps> = ({
  tokenId,
  isVerified,
  onVerificationComplete,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVerifier, setIsVerifier] = useState<boolean | null>(null);
  const { address } = useActiveAccount();

  useEffect(() => {
    const checkVerifierStatus = async () => {
      if (address) {
        const verifierStatus = await isApprovedVerifier(address);
        setIsVerifier(verifierStatus);
      } else {
        setIsVerifier(false);
      }
    };

    checkVerifierStatus();
  }, [address]);

  const handleVerify = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await verifyProperty(tokenId);
      if (result.success) {
        onVerificationComplete?.();
      } else {
        setError(result.error || 'Verification failed');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while verifying the property');
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerified) {
    return <Badge className='text-sm'>Verified</Badge>;
  }

  if (isVerifier === false) {
    return null;
  }

  return (
    <div>
      <Button
        onClick={handleVerify}
        disabled={isLoading || !address || isVerifier !== true}
        variant='default'
      >
        {isLoading ? 'Verifying...' : 'Verify Property'}
      </Button>

      {error && <p className='text-sm text-red-500 mt-2'>{error}</p>}
    </div>
  );
};
