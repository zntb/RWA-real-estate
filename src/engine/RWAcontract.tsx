import { getContract } from 'thirdweb';
import { client } from '../client';
import { sepolia } from 'thirdweb/chains';

// Log contract address to check if it's being loaded correctly
console.log(
  'RWA Contract Address:',
  process.env.NEXT_PUBLIC_RWA_DEPLOYED_CONTRACT_ADDRESS
    ? 'Defined'
    : 'Undefined',
);

export const rwaContract = getContract({
  client,
  chain: sepolia,
  address: process.env.NEXT_PUBLIC_RWA_DEPLOYED_CONTRACT_ADDRESS!,
});
