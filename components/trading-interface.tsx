export default function TradingInterface() {
  const [offerPrice, setOfferPrice] = useState('')
  const { wallet, publicKey, sendTransaction } = useWallet()
  const { connection } = useConnection()

  const handleBuyNow = async () => {
    if (!publicKey || !wallet) {
      alert('Please connect your wallet first.')
      return
    }
    console.log('Initiating purchase for', mockNft.name, 'at', mockNft.price, 'SOL')
    // In a real app, you would create and send a transaction here
    // const transaction = new Transaction().add(...)
    // const signature = await sendTransaction(transaction, connection)
    // await connection.confirmTransaction(signature, 'processed')
    alert(`Transaction simulation: Bought ${mockNft.name} for ${mockNft.price} SOL.`)
  }

  const handleMakeOffer = async () => {
    if (!publicKey || !wallet) {
      alert('Please connect your wallet first.')
      return
    }
    const price = parseFloat(offerPrice)
    if (isNaN(price) || price <= 0) {
      alert('Please enter a valid offer price.')
      return
    }
    console.log('Making offer for', price, 'SOL on', mockNft.name)
    // In a real app, you would create and send a transaction for the offer
    alert(`Transaction simulation: Placed an offer of ${price} SOL for ${mockNft.name}.`)
    setOfferPrice('')
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden sticky top-24">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">{mockNft.collection}</CardTitle>
              <CardDescription className="text-2xl font-bold text-foreground">{mockNft.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <img src={mockNft.imageUrl} alt={mockNft.name} className="w-full h-auto object-cover rounded-md aspect-square" />
            </CardContent>
            <CardFooter>
                 <p className="text-sm text-muted-foreground">{mockNft.description}</p>
            </CardFooter>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Trade</CardTitle>
              <CardDescription>Buy, sell, or make an offer on this NFT.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Current Price</p>
                <p className="text-4xl font-bold">{mockNft.price} SOL</p>
                <p className="text-sm text-muted-foreground">Floor Price: {mockNft.floorPrice} SOL</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {publicKey ? (
                  <>
                    <Button size="lg" className="flex-1" onClick={handleBuyNow}>
                      <Wallet className="mr-2 h-4 w-4" /> Buy Now
                    </Button>
                    <Button size="lg" variant="outline" className="flex-1">
                      Add to Cart
                    </Button>
                  </>
                ) : (
                  <WalletMultiButton style={{ flex: 1, height: '48px' }} />
                )}
              </div>

              <Separator />

              <Tabs defaultValue="offers" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="offers"><Tag className="mr-2 h-4 w-4" /> Offers</TabsTrigger>
                  <TabsTrigger value="history"><LineChart className="mr-2 h-4 w-4" /> Price History</TabsTrigger>
                  <TabsTrigger value="details"><Info className="mr-2 h-4 w-4" /> Details</TabsTrigger>
                </TabsList>
                
                <TabsContent value="offers" className="mt-4 space-y-4">
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Enter offer in SOL"
                      value={offerPrice}
                      onChange={(e) => setOfferPrice(e.target.value)}
                      disabled={!publicKey}
                    />
                    <Button onClick={handleMakeOffer} disabled={!publicKey || !offerPrice}>Make Offer</Button>
                  </div>
                  <div className="space-y-2">
                    {mockOffers.map((offer, index) => (
                      <div key={index} className="flex justify-between items-center p-2 rounded-md border">
                        <div>
                          <p className="font-semibold">{offer.price} SOL</p>
                          <p className="text-xs text-muted-foreground">From: {offer.from}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">Expires {offer.expires}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="history" className="mt-4">
                  <div className="text-center py-10 border rounded-md">
                    <p className="text-muted-foreground">Price history chart coming soon.</p>
                  </div>
                </TabsContent>

                <TabsContent value="details" className="mt-4 text-sm space-y-4">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Collection</span>
                        <span className="font-medium text-primary">{mockNft.collection}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Creator</span>
                         <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span className="font-mono text-xs cursor-pointer">{`${mockNft.creatorAddress.slice(0, 4)}...${mockNft.creatorAddress.slice(-4)}`}</span>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{mockNft.creatorAddress}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-muted-foreground">Token Standard</span>
                        <span className="font-medium">Metaplex</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-muted-foreground">Royalty</span>
                        <span className="font-medium">5%</span>
                    </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}