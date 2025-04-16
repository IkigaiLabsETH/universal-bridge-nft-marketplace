import { ChainIdentifier } from './types';

const OPENSEA_API_KEY = process.env.OPENSEA_API_KEY;
const OPENSEA_API_URL = 'https://api.opensea.io/api/v2';

export interface CollectionStats {
  floorPrice: number;
  ownersCount: number;
  tradingVolume: number;
}

const defaultStats: CollectionStats = {
  floorPrice: 0,
  ownersCount: 0,
  tradingVolume: 0
};

export async function getCollectionStats(
  contractAddress: string,
  chain: ChainIdentifier = 'ethereum'
): Promise<CollectionStats> {
  try {
    // First get collection slug
    const collectionResponse = await fetch(
      `${OPENSEA_API_URL}/chain/${chain}/contract/${contractAddress}`,
      {
        headers: {
          'X-API-KEY': OPENSEA_API_KEY || ''
        }
      }
    );

    if (!collectionResponse.ok) {
      console.error('Failed to fetch collection data:', await collectionResponse.text());
      return defaultStats;
    }

    const collection = await collectionResponse.json();
    const { collection: { slug } } = collection;

    // Then get collection stats
    const statsResponse = await fetch(
      `${OPENSEA_API_URL}/collections/${slug}/stats`,
      {
        headers: {
          'X-API-KEY': OPENSEA_API_KEY || ''
        }
      }
    );

    if (!statsResponse.ok) {
      console.error('Failed to fetch collection stats:', await statsResponse.text());
      return defaultStats;
    }

    const stats = await statsResponse.json();

    return {
      floorPrice: stats.floor_price || 0,
      ownersCount: stats.total_owners || 0,
      tradingVolume: stats.total_volume || 0
    };
  } catch (error) {
    console.error('Error fetching collection stats:', error);
    return defaultStats;
  }
} 