import { createThirdwebClient, getContract, readContract } from "thirdweb";
import { sepolia, polygon, arbitrum, optimism, base, bsc, avalanche } from "thirdweb/chains";
import { ChainIdentifier } from './types';
import { getNFTs, getOwnedNFTs } from "thirdweb/extensions/erc721";

const THIRDWEB_SECRET_KEY = process.env.THIRDWEB_SECRET_KEY;

if (!THIRDWEB_SECRET_KEY) {
  throw new Error("THIRDWEB_SECRET_KEY is required");
}

const chainToChain: Record<ChainIdentifier, any> = {
  ethereum: sepolia,
  polygon: polygon,
  arbitrum: arbitrum,
  optimism: optimism,
  base: base,
  bsc: bsc,
  avalanche: avalanche
};

export interface NFTMetadata {
  id: string;
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

export interface CollectionMetadata {
  name: string;
  description: string;
  image: string;
  totalSupply: number;
  symbol: string;
  owner?: string;
  royaltyInfo?: {
    recipient: string;
    bps: number;
  };
  roles?: {
    admin: string[];
    minter: string[];
    transfer: string[];
  };
  contractURI?: string;
  baseURI?: string;
  isApprovedForAll?: boolean;
  supportsInterface?: {
    ERC721: boolean;
    ERC721Metadata: boolean;
    ERC721Enumerable: boolean;
  };
}

const client = createThirdwebClient({
  secretKey: THIRDWEB_SECRET_KEY
});

export async function getCollectionNFTs(
  contractAddress: string,
  chain: ChainIdentifier = 'ethereum',
  startIndex: number = 0,
  count: number = 100
): Promise<NFTMetadata[]> {
  try {
    const contract = getContract({
      client,
      chain: chainToChain[chain],
      address: contractAddress
    });

    const nfts = await getNFTs({
      contract,
      start: startIndex,
      count: count
    });

    return nfts.map((nft: any) => ({
      id: nft.metadata.id,
      name: nft.metadata.name || '',
      description: nft.metadata.description || '',
      image: nft.metadata.image || '',
      attributes: nft.metadata.attributes || []
    }));
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    return [];
  }
}

export async function getCollectionMetadata(
  contractAddress: string,
  chain: ChainIdentifier = 'ethereum'
): Promise<CollectionMetadata | null> {
  try {
    const contract = getContract({
      client,
      chain: chainToChain[chain],
      address: contractAddress
    });

    const [
      name,
      totalSupply,
      symbol,
      contractURI,
      baseURI,
      owner,
      [royaltyRecipient, royaltyBps],
      adminRoleCount,
      minterRoleCount,
      transferRoleCount
    ] = await Promise.all([
      readContract({
        contract,
        method: "function name() view returns (string)"
      }),
      readContract({
        contract,
        method: "function totalSupply() view returns (uint256)"
      }),
      readContract({
        contract,
        method: "function symbol() view returns (string)"
      }),
      readContract({
        contract,
        method: "function contractURI() view returns (string)"
      }),
      readContract({
        contract,
        method: "function _baseURI() view returns (string)"
      }),
      readContract({
        contract,
        method: "function owner() view returns (address)"
      }),
      readContract({
        contract,
        method: "function royaltyInfo(uint256,uint256) view returns (address,uint256)",
        params: [BigInt(0), BigInt(10000)]
      }),
      readContract({
        contract,
        method: "function getRoleMemberCount(bytes32) view returns (uint256)",
        params: ["0x0000000000000000000000000000000000000000000000000000000000000000"]
      }),
      readContract({
        contract,
        method: "function getRoleMemberCount(bytes32) view returns (uint256)",
        params: ["0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6"]
      }),
      readContract({
        contract,
        method: "function getRoleMemberCount(bytes32) view returns (uint256)",
        params: ["0x850223d6b35d132257c359d111b4a5f3c21e9af10001e4a5a83ed31f2d1a2a8b"]
      })
    ]);

    // Parse contractURI if it exists
    let description = '';
    let image = '';
    
    if (contractURI) {
      try {
        const response = await fetch(contractURI as string);
        if (response.ok) {
          const metadata = await response.json();
          description = metadata.description || '';
          image = metadata.image || '';
        }
      } catch (error) {
        console.error('Error fetching contractURI metadata:', error);
      }
    }

    // Get role members
    const roles = {
      admin: await Promise.all(
        Array.from({ length: Number(adminRoleCount) }, (_, i) =>
          readContract({
            contract,
            method: "function getRoleMember(bytes32,uint256) view returns (address)",
            params: ["0x0000000000000000000000000000000000000000000000000000000000000000", BigInt(i)]
          })
        )
      ),
      minter: await Promise.all(
        Array.from({ length: Number(minterRoleCount) }, (_, i) =>
          readContract({
            contract,
            method: "function getRoleMember(bytes32,uint256) view returns (address)",
            params: ["0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6", BigInt(i)]
          })
        )
      ),
      transfer: await Promise.all(
        Array.from({ length: Number(transferRoleCount) }, (_, i) =>
          readContract({
            contract,
            method: "function getRoleMember(bytes32,uint256) view returns (address)",
            params: ["0x850223d6b35d132257c359d111b4a5f3c21e9af10001e4a5a83ed31f2d1a2a8b", BigInt(i)]
          })
        )
      )
    };

    // Check interface support
    const interfaceSupport = {
      ERC721: await readContract({
        contract,
        method: "function supportsInterface(bytes4) view returns (bool)",
        params: ["0x80ac58cd"]
      }),
      ERC721Metadata: await readContract({
        contract,
        method: "function supportsInterface(bytes4) view returns (bool)",
        params: ["0x5b5e139f"]
      }),
      ERC721Enumerable: await readContract({
        contract,
        method: "function supportsInterface(bytes4) view returns (bool)",
        params: ["0x780e9d63"]
      })
    };

    return {
      name: name as string || '',
      description,
      image,
      totalSupply: Number(totalSupply),
      symbol: symbol as string || '',
      owner: owner as string,
      royaltyInfo: royaltyRecipient ? {
        recipient: royaltyRecipient as string,
        bps: Number(royaltyBps)
      } : undefined,
      roles,
      contractURI: contractURI as string,
      baseURI: baseURI as string,
      supportsInterface: interfaceSupport
    };
  } catch (error) {
    console.error('Error fetching collection metadata:', error);
    return null;
  }
} 