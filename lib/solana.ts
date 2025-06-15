export const SOLANA_NETWORK = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet';
export const RPC_ENDPOINT = process.env.NEXT_PUBLIC_RPC_ENDPOINT || 'https://api.devnet.solana.com';

export const connection = new Connection(RPC_ENDPOINT, 'confirmed');

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
      verified: boolean;
      share: number;
    }>;
  };
}

export interface NFTListing {
  mint: string;
  seller: string;
  price: number;
  currency: 'SOL' | 'USDC';
  metadata: NFTMetadata;
  listedAt: Date;
  isActive: boolean;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  image: string;
  creator: string;
  verified: boolean;
  floorPrice: number;
  totalVolume: number;
  itemCount: number;
  createdAt: Date;
}

export class SolanaService {
  private connection: Connection;

  constructor() {
    this.connection = connection;
  }

  async getBalance(publicKey: PublicKey): Promise<number> {
    try {
      const balance = await this.connection.getBalance(publicKey);
      return balance / LAMPORTS_PER_SOL;
    } catch (error) {
      console.error('Error getting balance:', error);
      throw error;
    }
  }

  async transferSOL(
    fromKeypair: Keypair,
    toPublicKey: PublicKey,
    amount: number
  ): Promise<string> {
    try {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: fromKeypair.publicKey,
          toPubkey: toPublicKey,
          lamports: amount * LAMPORTS_PER_SOL,
        })
      );

      const signature = await sendAndConfirmTransaction(
        this.connection,
        transaction,
        [fromKeypair]
      );

      return signature;
    } catch (error) {
      console.error('Error transferring SOL:', error);
      throw error;
    }
  }

  async getTokenAccounts(owner: PublicKey) {
    try {
      const tokenAccounts = await this.connection.getParsedTokenAccountsByOwner(
        owner,
        {
          programId: TOKEN_PROGRAM_ID,
        }
      );

      return tokenAccounts.value.map((account) => ({
        pubkey: account.pubkey,
        mint: account.account.data.parsed.info.mint,
        amount: account.account.data.parsed.info.tokenAmount.uiAmount,
        decimals: account.account.data.parsed.info.tokenAmount.decimals,
      }));
    } catch (error) {
      console.error('Error getting token accounts:', error);
      throw error;
    }
  }

  async getNFTsByOwner(owner: PublicKey): Promise<any[]> {
    try {
      const tokenAccounts = await this.getTokenAccounts(owner);
      const nftAccounts = tokenAccounts.filter(
        (account) => account.amount === 1 && account.decimals === 0
      );

      const nfts = await Promise.all(
        nftAccounts.map(async (account) => {
          try {
            const mintInfo = await this.connection.getParsedAccountInfo(
              new PublicKey(account.mint)
            );
            return {
              mint: account.mint,
              account: account.pubkey,
              mintInfo,
            };
          } catch (error) {
            console.error(`Error fetching NFT info for ${account.mint}:`, error);
            return null;
          }
        })
      );

      return nfts.filter(Boolean);
    } catch (error) {
      console.error('Error getting NFTs by owner:', error);
      throw error;
    }
  }

  async createListing(
    mint: string,
    seller: string,
    price: number,
    currency: 'SOL' | 'USDC' = 'SOL'
  ): Promise<NFTListing> {
    // This would integrate with a marketplace program
    // For now, return a mock listing
    const listing: NFTListing = {
      mint,
      seller,
      price,
      currency,
      metadata: {
        name: 'Mock NFT',
        symbol: 'MOCK',
        description: 'A mock NFT for testing',
        image: '',
        attributes: [],
        properties: {
          files: [],
          category: 'image',
          creators: [
            {
              address: seller,
              verified: false,
              share: 100,
            },
          ],
        },
      },
      listedAt: new Date(),
      isActive: true,
    };

    return listing;
  }

  async cancelListing(mint: string, seller: string): Promise<boolean> {
    // This would integrate with a marketplace program
    // For now, return success
    console.log(`Cancelling listing for ${mint} by ${seller}`);
    return true;
  }

  async buyNFT(
    mint: string,
    buyer: PublicKey,
    seller: PublicKey,
    price: number
  ): Promise<string> {
    try {
      // This is a simplified version - in reality, you'd use a marketplace program
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: buyer,
          toPubkey: seller,
          lamports: price * LAMPORTS_PER_SOL,
        })
      );

      // Add NFT transfer instruction here
      // This would require the actual marketplace program integration

      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = buyer;

      return transaction.serialize({ requireAllSignatures: false }).toString('base64');
    } catch (error) {
      console.error('Error creating buy transaction:', error);
      throw error;
    }
  }

  async getCollectionStats(collectionId: string): Promise<{
    floorPrice: number;
    totalVolume: number;
    itemCount: number;
    owners: number;
  }> {
    // This would integrate with indexing services or on-chain data
    // For now, return mock data
    return {
      floorPrice: 0.5,
      totalVolume: 1250.75,
      itemCount: 10000,
      owners: 3456,
    };
  }

  async searchNFTs(query: string, filters?: {
    collection?: string;
    minPrice?: number;
    maxPrice?: number;
    attributes?: Record<string, string>;
  }): Promise<NFTListing[]> {
    // This would integrate with indexing services
    // For now, return mock data
    return [];
  }

  async getMarketplaceStats(): Promise<{
    totalVolume: number;
    totalSales: number;
    activeListings: number;
    uniqueOwners: number;
  }> {
    return {
      totalVolume: 125000.5,
      totalSales: 45678,
      activeListings: 12345,
      uniqueOwners: 8901,
    };
  }

  async validateTransaction(signature: string): Promise<boolean> {
    try {
      const status = await this.connection.getSignatureStatus(signature);
      return status.value?.confirmationStatus === 'confirmed' || 
             status.value?.confirmationStatus === 'finalized';
    } catch (error) {
      console.error('Error validating transaction:', error);
      return false;
    }
  }

  async getRecentTransactions(limit: number = 10): Promise<any[]> {
    try {
      const signatures = await this.connection.getSignaturesForAddress(
        new PublicKey('11111111111111111111111111111112'), // System program
        { limit }
      );

      return signatures.map(sig => ({
        signature: sig.signature,
        slot: sig.slot,
        blockTime: sig.blockTime,
        confirmationStatus: sig.confirmationStatus,
      }));
    } catch (error) {
      console.error('Error getting recent transactions:', error);
      return [];
    }
  }
}

export const solanaService = new SolanaService();

export const formatSOL = (amount: number): string => {
  return `${amount.toFixed(4)} SOL`;
};

export const formatPrice = (price: number, currency: 'SOL' | 'USDC' = 'SOL'): string => {
  if (currency === 'SOL') {
    return formatSOL(price);
  }
  return `$${price.toFixed(2)}`;
};

export const shortenAddress = (address: string, chars: number = 4): string => {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};

export const isValidSolanaAddress = (address: string): boolean => {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
};