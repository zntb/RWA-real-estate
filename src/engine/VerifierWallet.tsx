import { client } from '../client';
import { Engine } from 'thirdweb';

// Check if the environment variable is defined
const verifierAddress = process.env.NEXT_PUBLIC_VERIFIER_WALLET_ADDRESS;
if (!verifierAddress) {
  console.error(
    'NEXT_PUBLIC_VERIFIER_WALLET_ADDRESS environment variable is not set!',
  );
}

// Create the verifier wallet
export const verifierWallet = Engine.serverWallet({
  client,
  address: verifierAddress || '', // Use empty string as fallback to prevent undefined errors
  vaultAccessToken: process.env.NEXT_PUBLIC_VAULT_ACCESS_TOKEN!,
});

// Log the wallet info for debugging
console.log(
  'Verifier wallet initialized with address:',
  verifierWallet.address || 'undefined',
);
