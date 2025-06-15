export interface NFTMetadata {
  name: string;
  symbol: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
  properties: {
    files: Array<{
      uri: string;
      type: string;
    }>;
    category: string;
    creators: Array<{
      address: string;
      share: number;
    }>;
  };
}

export interface NFTListing {
  id: string;
  mint: string;
  owner: string;
  price: number;
  currency: 'SOL' | 'USDC';
  metadata: NFTMetadata;
  collection?: string;
  rarity?: {
    rank: number;
    score: number;
  };
  lastSale?: {
    price: number;
    date: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Collection {
  id: string;
  name: string;
  symbol: string;
  description: string;
  image: string;
  bannerImage?: string;
  creator: string;
  verified: boolean;
  floorPrice: number;
  volume24h: number;
  totalVolume: number;
  itemCount: number;
  ownerCount: number;
  royalty: number;
  createdAt: string;
}

export interface MarketplaceStats {
  totalVolume: number;
  volume24h: number;
  totalListings: number;
  totalCollections: number;
  averagePrice: number;
  topCollections: Collection[];
}

export interface ActivityItem {
  id: string;
  type: 'sale' | 'listing' | 'delisting' | 'offer' | 'transfer';
  nft: {
    mint: string;
    name: string;
    image: string;
  };
  price?: number;
  from: string;
  to: string;
  signature: string;
  timestamp: string;
}

class MarketplaceAPI {
  private connection: Connection;
  private baseUrl: string;

  constructor(rpcUrl: string, apiBaseUrl: string = '/api') {
    this.connection = new Connection(rpcUrl, 'confirmed');
    this.baseUrl = apiBaseUrl;
  }

  async getNFTListings(params: {
    collection?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: 'price' | 'rarity' | 'recent';
    sortOrder?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
  } = {}): Promise<{ listings: NFTListing[]; total: number }> {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    const response = await fetch(`${this.baseUrl}/listings?${queryParams}`);
    if (!response.ok) {
      throw new Error('Failed to fetch NFT listings');
    }
    
    return response.json();
  }

  async getNFTById(mint: string): Promise<NFTListing | null> {
    const response = await fetch(`${this.baseUrl}/nft/${mint}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Failed to fetch NFT');
    }
    
    return response.json();
  }

  async getCollections(params: {
    sortBy?: 'volume' | 'floor' | 'items' | 'recent';
    sortOrder?: 'asc' | 'desc';
    limit?: number;
    offset?: number;
  } = {}): Promise<{ collections: Collection[]; total: number }> {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    const response = await fetch(`${this.baseUrl}/collections?${queryParams}`);
    if (!response.ok) {
      throw new Error('Failed to fetch collections');
    }
    
    return response.json();
  }

  async getCollectionById(id: string): Promise<Collection | null> {
    const response = await fetch(`${this.baseUrl}/collections/${id}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Failed to fetch collection');
    }
    
    return response.json();
  }

  async getCollectionNFTs(
    collectionId: string,
    params: {
      minPrice?: number;
      maxPrice?: number;
      sortBy?: 'price' | 'rarity' | 'recent';
      sortOrder?: 'asc' | 'desc';
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<{ listings: NFTListing[]; total: number }> {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    const response = await fetch(`${this.baseUrl}/collections/${collectionId}/nfts?${queryParams}`);
    if (!response.ok) {
      throw new Error('Failed to fetch collection NFTs');
    }
    
    return response.json();
  }

  async getUserNFTs(walletAddress: string): Promise<NFTListing[]> {
    const response = await fetch(`${this.baseUrl}/users/${walletAddress}/nfts`);
    if (!response.ok) {
      throw new Error('Failed to fetch user NFTs');
    }
    
    return response.json();
  }

  async getUserListings(walletAddress: string): Promise<NFTListing[]> {
    const response = await fetch(`${this.baseUrl}/users/${walletAddress}/listings`);
    if (!response.ok) {
      throw new Error('Failed to fetch user listings');
    }
    
    return response.json();
  }

  async getMarketplaceStats(): Promise<MarketplaceStats> {
    const response = await fetch(`${this.baseUrl}/stats`);
    if (!response.ok) {
      throw new Error('Failed to fetch marketplace stats');
    }
    
    return response.json();
  }

  async getActivity(params: {
    collection?: string;
    type?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<{ activities: ActivityItem[]; total: number }> {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    const response = await fetch(`${this.baseUrl}/activity?${queryParams}`);
    if (!response.ok) {
      throw new Error('Failed to fetch activity');
    }
    
    return response.json();
  }

  async createListing(
    mint: string,
    price: number,
    walletAddress: string
  ): Promise<{ signature: string }> {
    const response = await fetch(`${this.baseUrl}/listings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mint,
        price,
        seller: walletAddress,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create listing');
    }

    return response.json();
  }

  async cancelListing(
    mint: string,
    walletAddress: string
  ): Promise<{ signature: string }> {
    const response = await fetch(`${this.baseUrl}/listings/${mint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        seller: walletAddress,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to cancel listing');
    }

    return response.json();
  }

  async buyNFT(
    mint: string,
    price: number,
    buyerAddress: string
  ): Promise<{ signature: string }> {
    const response = await fetch(`${this.baseUrl}/buy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mint,
        price,
        buyer: buyerAddress,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to buy NFT');
    }

    return response.json();
  }

  async makeOffer(
    mint: string,
    price: number,
    buyerAddress: string,
    expiry?: number
  ): Promise<{ signature: string }> {
    const response = await fetch(`${this.baseUrl}/offers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mint,
        price,
        buyer: buyerAddress,
        expiry,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to make offer');
    }

    return response.json();
  }

  async searchNFTs(query: string, limit: number = 20): Promise<NFTListing[]> {
    const response = await fetch(`${this.baseUrl}/search?q=${encodeURIComponent(query)}&limit=${limit}`);
    if (!response.ok) {
      throw new Error('Failed to search NFTs');
    }
    
    return response.json();
  }

  async getTokenMetadata(mint: string): Promise<NFTMetadata | null> {
    try {
      const mintPubkey = new PublicKey(mint);
      const accountInfo = await this.connection.getAccountInfo(mintPubkey);
      
      if (!accountInfo) {
        return null;
      }

      const response = await fetch(`${this.baseUrl}/metadata/${mint}`);
      if (!response.ok) {
        return null;
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching token metadata:', error);
      return null;
    }
  }

  async validateTransaction(signature: string): Promise<boolean> {
    try {
      const transaction = await this.connection.getTransaction(signature, {
        commitment: 'confirmed',
      });
      
      return transaction !== null;
    } catch (error) {
      console.error('Error validating transaction:', error);
      return false;
    }
  }

  async getWalletBalance(walletAddress: string): Promise<number> {
    try {
      const publicKey = new PublicKey(walletAddress);
      const balance = await this.connection.getBalance(publicKey);
      return balance / LAMPORTS_PER_SOL;
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      return 0;
    }
  }
}

export const marketplaceAPI = new MarketplaceAPI(
  process.env.NEXT_PUBLIC_RPC_URL || 'https://api.mainnet-beta.solana.com',
  process.env.NEXT_PUBLIC_API_BASE_URL || '/api'
);

export default MarketplaceAPI;