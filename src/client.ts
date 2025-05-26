import { createThirdwebClient } from 'thirdweb';

const clientId =
  process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || 'default-client-id';
const secretKey = process.env.NEXT_PUBLIC_THIRDWEB_SECRET_KEY || '';

console.log('Thirdweb Client ID:', clientId);
console.log('Thirdweb Secret Key:', secretKey);

export const client = createThirdwebClient({
  clientId: clientId,
  secretKey: secretKey,
});
