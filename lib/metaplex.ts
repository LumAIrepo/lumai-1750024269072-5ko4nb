export interface NFTMetadata {
  name: string
  symbol: string
  description: string
  image: string
  attributes?: Array<{
    trait_type: string
    value: string | number
  }>
  properties?: {
    files?: Array<{
      uri: string
      type: string
    }>
    category?: string
    creators?: Array<{
      address: string
      share: number
    }>
  }
}

export interface NFT {
  mint: string
  name: string
  symbol: string
  description: string
  image: string
  attributes: Array<{
    trait_type: string
    value: string | number
  }>
  owner: string
  price?: number
  listed: boolean
  collection?: string
  creators: Array<{
    address: string
    share: number
    verified: boolean
  }>
}

export interface Collection {
  address: string
  name: string
  symbol: string
  description: string
  image: string
  verified: boolean
  floorPrice: number
  totalItems: number
  owners: number
  volume24h: number
  creators: Array<{
    address: string
    share: number
  }>
}

export interface MarketplaceListing {
  mint: string
  seller: string
  price: number
  timestamp: number
  active: boolean
}

export class MetaplexService {
  private connection: Connection
  private endpoint: string

  constructor(endpoint: string = 'https://api.mainnet-beta.solana.com') {
    this.endpoint = endpoint
    this.connection = new Connection(endpoint, 'confirmed')
  }

  async getNFTsByOwner(ownerAddress: string): Promise<NFT[]> {
    try {
      const owner = new PublicKey(ownerAddress)
      const tokenAccounts = await this.connection.getParsedTokenAccountsByOwner(owner, {
        programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
      })

      const nfts: NFT[] = []
      
      for (const account of tokenAccounts.value) {
        const tokenAmount = account.account.data.parsed.info.tokenAmount
        if (tokenAmount.uiAmount === 1 && tokenAmount.decimals === 0) {
          const mint = account.account.data.parsed.info.mint
          const metadata = await this.getNFTMetadata(mint)
          if (metadata) {
            nfts.push({
              mint,
              name: metadata.name,
              symbol: metadata.symbol,
              description: metadata.description,
              image: metadata.image,
              attributes: metadata.attributes || [],
              owner: ownerAddress,
              listed: false,
              creators: metadata.properties?.creators?.map(creator => ({
                address: creator.address,
                share: creator.share,
                verified: false
              })) || []
            })
          }
        }
      }

      return nfts
    } catch (error) {
      console.error('Error fetching NFTs:', error)
      return []
    }
  }

  async getNFTMetadata(mintAddress: string): Promise<NFTMetadata | null> {
    try {
      const mint = new PublicKey(mintAddress)
      const metadataPDA = await this.getMetadataPDA(mint)
      const accountInfo = await this.connection.getAccountInfo(metadataPDA)
      
      if (!accountInfo) return null

      // This is a simplified metadata parsing
      // In a real implementation, you'd use @metaplex-foundation/mpl-token-metadata
      const mockMetadata: NFTMetadata = {
        name: `NFT ${mintAddress.slice(0, 8)}`,
        symbol: 'NFT',
        description: 'A unique NFT on Solana',
        image: `https://picsum.photos/400/400?random=${mintAddress.slice(0, 8)}`,
        attributes: [
          { trait_type: 'Rarity', value: 'Common' },
          { trait_type: 'Background', value: 'Blue' }
        ]
      }

      return mockMetadata
    } catch (error) {
      console.error('Error fetching metadata:', error)
      return null
    }
  }

  async getCollections(): Promise<Collection[]> {
    // Mock collections data - in real implementation, fetch from API or on-chain
    return [
      {
        address: 'DeGod2UWGV2jgKEspiW3m8WrqKTZQj6F8xqJz8yZbQ2K',
        name: 'DeGods',
        symbol: 'DEGOD',
        description: 'The most exclusive NFT collection on Solana',
        image: 'https://picsum.photos/400/400?random=degods',
        verified: true,
        floorPrice: 125.5,
        totalItems: 10000,
        owners: 6234,
        volume24h: 1250.75,
        creators: [
          { address: 'FrankdxPmPwF5Mj8qJhZzJzKjKqKqKqKqKqKqKqKqKqKq', share: 100 }
        ]
      },
      {
        address: 'SMBtHCCC6RYRutFEPb4gZqeBLUZbMNhRKaMKZZLHi7W',
        name: 'Solana Monkey Business',
        symbol: 'SMB',
        description: 'The original Solana NFT collection',
        image: 'https://picsum.photos/400/400?random=smb',
        verified: true,
        floorPrice: 45.2,
        totalItems: 5000,
        owners: 3456,
        volume24h: 890.25,
        creators: [
          { address: 'MonkeyBusiness1234567890123456789012345678', share: 100 }
        ]
      }
    ]
  }

  async createListing(
    wallet: WalletContextState,
    mintAddress: string,
    price: number
  ): Promise<string | null> {
    if (!wallet.publicKey || !wallet.signTransaction) {
      throw new Error('Wallet not connected')
    }

    try {
      const transaction = new Transaction()
      
      // Add listing instruction (simplified)
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: new PublicKey(mintAddress),
          lamports: price * LAMPORTS_PER_SOL
        })
      )

      const { blockhash } = await this.connection.getLatestBlockhash()
      transaction.recentBlockhash = blockhash
      transaction.feePayer = wallet.publicKey

      const signedTransaction = await wallet.signTransaction(transaction)
      const signature = await this.connection.sendRawTransaction(signedTransaction.serialize())
      
      await this.connection.confirmTransaction(signature)
      return signature
    } catch (error) {
      console.error('Error creating listing:', error)
      return null
    }
  }

  async buyNFT(
    wallet: WalletContextState,
    mintAddress: string,
    price: number,
    seller: string
  ): Promise<string | null> {
    if (!wallet.publicKey || !wallet.signTransaction) {
      throw new Error('Wallet not connected')
    }

    try {
      const transaction = new Transaction()
      
      // Add buy instruction (simplified)
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: new PublicKey(seller),
          lamports: price * LAMPORTS_PER_SOL
        })
      )

      const { blockhash } = await this.connection.getLatestBlockhash()
      transaction.recentBlockhash = blockhash
      transaction.feePayer = wallet.publicKey

      const signedTransaction = await wallet.signTransaction(transaction)
      const signature = await this.connection.sendRawTransaction(signedTransaction.serialize())
      
      await this.connection.confirmTransaction(signature)
      return signature
    } catch (error) {
      console.error('Error buying NFT:', error)
      return null
    }
  }

  async getMarketplaceListings(): Promise<MarketplaceListing[]> {
    // Mock marketplace listings - in real implementation, fetch from program accounts
    return [
      {
        mint: 'NFT1mint1234567890123456789012345678901234',
        seller: 'Seller1234567890123456789012345678901234567',
        price: 2.5,
        timestamp: Date.now() - 3600000,
        active: true
      },
      {
        mint: 'NFT2mint1234567890123456789012345678901234',
        seller: 'Seller2234567890123456789012345678901234567',
        price: 1.8,
        timestamp: Date.now() - 7200000,
        active: true
      }
    ]
  }

  private async getMetadataPDA(mint: PublicKey): Promise<PublicKey> {
    const TOKEN_METADATA_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s')
    const [metadataPDA] = await PublicKey.findProgramAddress(
      [
        Buffer.from('metadata'),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer()
      ],
      TOKEN_METADATA_PROGRAM_ID
    )
    return metadataPDA
  }

  async searchNFTs(query: string): Promise<NFT[]> {
    // Mock search functionality
    const allNFTs = await this.getMarketplaceListings()
    return []
  }

  async getCollectionNFTs(collectionAddress: string): Promise<NFT[]> {
    // Mock collection NFTs
    return []
  }

  async getAccountBalance(address: string): Promise<number> {
    try {
      const publicKey = new PublicKey(address)
      const balance = await this.connection.getBalance(publicKey)
      return balance / LAMPORTS_PER_SOL
    } catch (error) {
      console.error('Error fetching balance:', error)
      return 0
    }
  }
}

export const metaplexService = new MetaplexService()