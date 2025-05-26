import { rwaContract } from './RWAcontract';
import { readContract } from 'thirdweb';

export const getPropertiesOfOwner = async (ownerAddress: string) => {
  console.log('Fetching properties owned by:', ownerAddress);

  try {
    // For read operations in thirdweb v5, we use the readContract function
    const propertyIds = await readContract({
      contract: rwaContract,
      method: 'function getPropertiesOfOwner(address) returns (uint256[])',
      params: [ownerAddress],
    });

    return propertyIds;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error fetching owner properties:', error);
    throw error;
  }
};
