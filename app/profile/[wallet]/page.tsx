export default function ProfilePage() {
  const params = useParams()
  const walletAddress = params.wallet as string

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [nfts, setNfts] = useState<NFT[]>([])
  const [loading, setLoading] = useState(true)
  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    if (walletAddress) {
      setLoading(true)
      // Simulate API call to fetch profile and NFT data
      setTimeout(() => {
        setProfile({
          walletAddress: walletAddress,
          username: `User_${shortenAddress(walletAddress)}`,
          avatarUrl: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${walletAddress}`,
          stats: {
            volume: 125.5,
            listed: 24,
            items: 152,
          },
        })
        setNfts(mockNfts)
        setLoading(false)
      }, 1500)
    }
  }, [walletAddress])

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  if (loading) {
    return <ProfileSkeleton />
  }

  if (!profile) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Profile not found.</p>
      </div>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <section className="flex flex-col items-center space-y-4">
        <Avatar className="h-24 w-24 border-2">
          <AvatarImage src={profile.avatarUrl} alt={profile.username} />
          <AvatarFallback>{profile.username?.charAt(0) ?? 'U'}</AvatarFallback>
        </Avatar>
        <h1 className="text-3xl font-bold">{profile.username}</h1>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="text-muted-foreground"
              >
                <Wallet className="mr-2 h-4 w-4" />
                <span>{shortenAddress(profile.walletAddress)}</span>
                {isCopied ? (
                  <Check className="ml-2 h-4 w-4 text-green-500" />
                ) : (
                  <ClipboardCopy className="ml-2 h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copy address</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </section>

      <section className="mt-8 flex justify-center">
        <div className="grid w-full max-w-lg grid-cols-3 gap-4 rounded-lg border bg-card p-4 text-card-foreground">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Volume</p>
            <p className="text-lg font-semibold">
              {profile.stats.volume.toFixed(1)} SOL
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Listed</p>
            <p className="text-lg font-semibold">{profile.stats.listed}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Items</p>
            <p className="text-lg font-semibold">{profile.stats.items}</p>
          </div>
        </div>
      </section>

      <Tabs defaultValue="collected" className="mt-12">
        <TabsList className="mx-auto grid w-full max-w-lg grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="collected">
            <Package className="mr-2 h-4 w-4" /> Collected
          </TabsTrigger>
          <TabsTrigger value="listed">
            <Coins className="mr-2 h-4 w-4" /> Listed
          </TabsTrigger>
          <TabsTrigger value="offers" disabled>
            Offers
          </TabsTrigger>
          <TabsTrigger value="activity" disabled>
            Activity
          </TabsTrigger>
        </TabsList>
        <TabsContent value="collected" className="mt-8">
          <div>
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">{nfts.length} items</p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <ArrowUpDown className="mr-2 h-4 w-4" /> Sort
                </Button>
                <Button variant="outline" size="icon">
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {nfts.map(nft => (
                <Card key={nft.id} className="overflow-hidden">
                  <CardHeader className="p-0">
                    <div className="aspect-square w-full overflow-hidden">
                      <Image
                        src={nft.imageUrl}
                        alt={nft.name}
                        width={300}
                        height={300}
                        className="h-full w-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <p className="truncate text-xs text-muted-foreground">
                      {nft.collection}
                    </p>
                    <h3 className="truncate font-semibold">{nft.name}</h3>
                  </CardContent>
                  <CardFooter className="bg-muted/40 p-4">
                    <div className="flex w-full items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Price</p>
                        <p className="font-semibold">
                          {nft.priceSol?.toFixed(2)} SOL
                        </p>
                      </div>
                      <Button size="sm">Buy</Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="listed" className="mt-8">
          <div className="flex h-64 items-center justify-center rounded-lg border border-dashed">
            <p className="text-muted-foreground">No listed items yet.</p>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  )
}

function ProfileSkeleton() {
  return (
    <main className="container mx-auto px-4 py-8">
      <section className="flex flex-col items-center space-y-4">
        <Skeleton className="h-24 w-24 rounded-full" />
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-6 w-64" />
      </section>

      <section className="mt-8 flex justify-center">
        <div className="grid w-full max-w-lg grid-cols-3 gap-4 rounded-lg border bg-card p-4">
          <div className="text-center">
            <Skeleton className="mx-auto mb-2 h-4 w-16" />
            <Skeleton className="mx-auto h-6 w-20" />
          </div>
          <div className="text-center">
            <Skeleton className="mx-auto mb-2 h-4 w-16" />
            <Skeleton className="mx-auto h-6 w-12" />
          </div>
          <div className="text-center">
            <Skeleton className="mx-auto mb-2 h-4 w-16" />
            <Skeleton className="mx-auto h-6 w-12" />
          </div>
        </div>
      </section>

      <div className="mt-12">
        <Skeleton className="mx-auto h-10 w-full max-w-lg" />
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-20" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-9" />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="p-0">
                  <Skeleton className="aspect-square w-full" />
                </CardHeader>
                <CardContent className="space-y-2 p-4">
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
                <CardFooter className="p-4">
                  <Skeleton className="h-9 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}