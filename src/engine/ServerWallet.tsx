import { client } from '../client';
import { Engine } from 'thirdweb';

// Create the server wallet
export const serverWallet = Engine.serverWallet({
  client,
  address: process.env.NEXT_PUBLIC_SERVER_WALLET_ADDRESS!,
  vaultAccessToken: process.env.NEXT_PUBLIC_VAULT_ACCESS_TOKEN!,
});
