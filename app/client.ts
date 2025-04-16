// d877020b8b0fc8b22cc94da95dfb1ef7

import { createThirdwebClient } from "thirdweb";

// Initialize the Thirdweb client
export const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "",
});
