// Collection Types
export interface NFTAttribute {
  trait_type: string;
  value: string | number;
}

export interface NFTMetadata {
  id: string;
  name: string;
  description: string;
  image: string;
  attributes: NFTAttribute[];
  price: number;
  likes: number;
  supply: number;
  category: string;
  tokenId?: string;
}

export interface ChainInfo {
  id: number;
  name: string;
  symbol: string;
  blockExplorer: string;
}

export interface NFTCollection {
  id: string;
  name: string;
  description: string;
  symbol: string;
  categories: string[];
  items: NFTMetadata[];
  creator: string;
  totalSupply: number;
  floorPrice: number;
  volumeTraded: number;
  contractAddress: string;
  chain: ChainInfo;
  startTokenId?: string;
  endTokenId?: string;
  createdAt: string;
  lastUpdated: string;
}

// Chain configurations
export const chains: { [key: string]: ChainInfo } = {
  ethereum: {
    id: 1,
    name: "Ethereum",
    symbol: "ETH",
    blockExplorer: "https://etherscan.io"
  }
};

// Sample Collections with contract addresses
export const collections: NFTCollection[] = [
  {
    id: "artblocks-ikigai",
    name: "Art Blocks x Ikigai",
    description: "A curated collection of generative art pieces from Art Blocks",
    symbol: "IKIG",
    categories: ["art", "generative"],
    creator: "0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270",
    totalSupply: 1000,
    floorPrice: 0.5,
    volumeTraded: 1250.75,
    contractAddress: "0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270",
    chain: chains.ethereum,
    startTokenId: "78000000",
    endTokenId: "78999999",
    createdAt: "2024-01-01T00:00:00Z",
    lastUpdated: "2024-03-19T12:00:00Z",
    items: [
      {
        id: "ikigai-001",
        name: "Ikigai #78000001",
        description: "A unique generative art piece from the Ikigai collection",
        image: "/nfts/art/ikigai-001.png",
        category: "art",
        price: 1.5,
        likes: 245,
        supply: 1,
        tokenId: "78000001",
        attributes: [
          { trait_type: "Style", value: "Generative" },
          { trait_type: "Algorithm", value: "Chromatic Flow" },
          { trait_type: "Rarity", value: "Legendary" }
        ]
      }
    ]
  },
  {
    id: "legendary-weapons",
    name: "Legendary Weapons",
    description: "A collection of the most powerful weapons in the Pixel Realm",
    symbol: "LGND",
    categories: ["swords", "staffs"],
    creator: "0x1234...5678",
    totalSupply: 100,
    floorPrice: 0.25,
    volumeTraded: 125.5,
    contractAddress: "0x1234567890abcdef1234567890abcdef12345678",
    chain: chains.ethereum,
    createdAt: "2024-02-01T00:00:00Z",
    lastUpdated: "2024-03-19T12:00:00Z",
    items: [
      {
        id: "excalibur-01",
        name: "Excalibur",
        description: "The legendary sword of King Arthur",
        image: "/nfts/weapons/excalibur.png",
        category: "swords",
        price: 2.5,
        likes: 156,
        supply: 1,
        tokenId: "1",
        attributes: [
          { trait_type: "Power", value: 95 },
          { trait_type: "Ability", value: "Holy Strike" },
          { trait_type: "Level", value: 50 },
          { trait_type: "Rarity", value: "Mythical" }
        ]
      },
      {
        id: "staff-of-wizardry-01",
        name: "Staff of Wizardry",
        description: "An ancient staff wielded by the greatest mages",
        image: "/nfts/weapons/wizard-staff.png",
        category: "staffs",
        price: 1.8,
        likes: 123,
        supply: 3,
        attributes: [
          { trait_type: "Power", value: 88 },
          { trait_type: "Ability", value: "Arcane Burst" },
          { trait_type: "Level", value: 45 },
          { trait_type: "Rarity", value: "Legendary" }
        ]
      }
    ]
  },
  {
    id: "mystic-potions",
    name: "Mystic Potions",
    description: "Rare and powerful potions with magical effects",
    symbol: "POTN",
    categories: ["potions"],
    creator: "0x9876...4321",
    totalSupply: 250,
    floorPrice: 0.15,
    volumeTraded: 75.8,
    contractAddress: "0x9876543210abcdef9876543210abcdef98765432",
    chain: chains.ethereum,
    createdAt: "2024-03-01T00:00:00Z",
    lastUpdated: "2024-03-19T12:00:00Z",
    items: [
      {
        id: "elixir-of-life-01",
        name: "Elixir of Life",
        description: "A legendary potion that grants immortality",
        image: "/nfts/potions/life-elixir.png",
        category: "potions",
        price: 1.2,
        likes: 89,
        supply: 5,
        attributes: [
          { trait_type: "Power", value: 100 },
          { trait_type: "Effect", value: "Immortality" },
          { trait_type: "Duration", value: "Permanent" },
          { trait_type: "Rarity", value: "Mythical" }
        ]
      },
      {
        id: "mana-potion-01",
        name: "Greater Mana Potion",
        description: "Restores a large amount of magical energy",
        image: "/nfts/potions/mana-potion.png",
        category: "potions",
        price: 0.3,
        likes: 45,
        supply: 50,
        attributes: [
          { trait_type: "Power", value: 75 },
          { trait_type: "Effect", value: "Mana Restore" },
          { trait_type: "Duration", value: "Instant" },
          { trait_type: "Rarity", value: "Rare" }
        ]
      }
    ]
  }
]; 