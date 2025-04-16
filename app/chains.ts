import { Chain } from "thirdweb";

export const ethereum: Chain = {
  id: 1,
  name: "Ethereum",
  rpc: "https://ethereum.rpc.thirdweb.com",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18
  }
};

export const arbitrumSepolia: Chain = {
  id: 421614,
  name: "Arbitrum Sepolia", 
  rpc: "https://sepolia-rollup.arbitrum.io/rpc",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18
  }
}; 