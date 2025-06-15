export default function NftDetailPage({ params }: { params: { mint: string } }) {
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()
  const [nft, setNft] = useState<NftData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const mintAddress = params.mint

  useEffect(() => {
    if (mintAddress && connection) {
      const loadNftData = async () => {
        setLoading(true)
        setError(null)
        try {
          const data = await fetchNftDetails(mintAddress, connection)
          setNft(data)
        } catch (e: any) {
          setError(e.message || 'Failed to fetch NFT details.')
        } finally {
          setLoading(false)
        }
      }
      loadNftData()
    }
  }, [mintAddress, connection])

  const handleBuyNow = async () => {
    if (!publicKey || !nft?.price) {
      alert('Please connect your wallet and ensure the NFT has a price.')
      return
    }
    // This is a placeholder for a real transaction
    // You would use a marketplace's SDK or build the transaction manually
    alert(`Initiating purchase for ${nft.name} for ${nft.price} SOL. This is a simulation.`)
    // Example:
    // const transaction = await createMarketplaceBuyTransaction(...)
    // const signature = await sendTransaction(transaction, connection)
    // await connection.confirmTransaction(signature, 'processed')
  }
  
  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2">
            <Skeleton className="w-full aspect-square rounded-xl" />
          </div>
          <div className="md:col-span-3 space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-12 w-1/2" />
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-1/4" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-10 w-1/3" />
                <div className="flex gap-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-1/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    )
  }

  if (error || !nft) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-500">Error</h1>
        <p>{error || 'Could not load NFT data.'}</p>
        <Button asChild variant="link" className="mt-4">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column: NFT Image */}
        <div className="space-y-4">
          <Card className="overflow-hidden">
             <Image
                src={nft.imageUrl}
                alt={nft.name}
                width={700}
                height={700}
                className="w-full h-auto object-cover aspect-square"
                priority
              />
          </Card>
        </div>

        {/* Right Column: NFT Details & Actions */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Link href={`/collection/${nft.collection.family}`} className="text-lg text-primary hover:underline">
              {nft.collection.name}
            </Link>
            <h1 className="text-4xl font-bold">{nft.name}</h1>
            <p className="text-muted-foreground">
              Owned by <span className="text-primary font-mono">{nft.owner}</span>
            </p>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">Price</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <RefreshCw className="h-4 w-4 cursor-pointer hover:text-primary" />
                <Share className="h-4 w-4 cursor-pointer hover:text-primary" />
                <Heart className="h-4 w-4 cursor-pointer hover:text-red-500" />
                <MoreVertical className="h-4 w-4 cursor-pointer hover:text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              {nft.price ? (
                <>
                  <p className="text-4xl font-bold mb-4">{nft.price} SOL</p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button size="lg" className="flex-1" onClick={handleBuyNow} disabled={!publicKey}>
                      <Wallet className="mr-2 h-5 w-5" />
                      Buy now
                    </Button>
                    <Button size="lg" variant="outline" className="flex-1">
                      Make offer
                    </Button>
                  </div>
                </>
              ) : (
                <p className="text-xl text-muted-foreground">Not listed for sale</p>
              )}
            </CardContent>
          </Card>
          
          <Tabs defaultValue="attributes">
            <TabsList className="w-full">
              <TabsTrigger value="attributes" className="flex-1">Attributes</TabsTrigger>
              <TabsTrigger value="description" className="flex-1">Description</TabsTrigger>
              <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
            </TabsList>
            <TabsContent value="attributes">
               <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Trait</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead className="text-right">Floor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {nft.attributes.map((attr) => (
                        <TableRow key={attr.trait_type}>
                          <TableCell className="font-medium">{attr.trait_type}</TableCell>
                          <TableCell>{attr.value}</TableCell>
                          <TableCell className="text-right">{attr.floor_price ? `${attr.floor_price} SOL` : '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="description">
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{nft.description}</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="details">
               <Card>
                <CardHeader>
                  <CardTitle>Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                   <div className="flex justify-between">
                     <span className="text-muted-foreground">Mint Address</span>
                     <a href={`https://solscan.io/token/${nft.mint}`} target="_blank" rel="noopener noreferrer" className="text-primary font-mono flex items-center hover:underline">
                      {nft.mint.slice(0, 8)}...{nft.mint.slice(-8)}
                      <ExternalLink className="ml-2 h-4 w-4" />
                     </a>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-muted-foreground">Token Standard</span>
                     <span className="font-mono">{nft.tokenStandard}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="text-muted-foreground">Creator Royalties</span>
                     <span className="font-mono">{nft.creatorRoyalties}%</span>
                   </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

        </div>
      </div>
    </main>
  )
}