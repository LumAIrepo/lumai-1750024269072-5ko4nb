export default function Page() {
  return (
    <main className="flex-1">
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Discover, collect, and sell extraordinary NFTs
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  The world's first and largest digital marketplace for crypto
                  collectibles and non-fungible tokens (NFTs).
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/explore">
                  <Button size="lg">Explore</Button>
                </Link>
                <Link href="/create">
                  <Button size="lg" variant="secondary">
                    Create
                  </Button>
                </Link>
              </div>
            </div>
            <Image
              src="/placeholder.svg"
              width="550"
              height="550"
              alt="Hero NFT"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
            />
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-start space-y-4">
            <div className="flex items-center space-x-2">
              <Flame className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Trending Collections
              </h2>
            </div>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Top collections over the last 24 hours, ranked by volume.
            </p>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {trendingCollections.map((collection) => (
              <Link key={collection.id} href={`/collection/${collection.id}`}>
                <Card className="overflow-hidden transition-transform hover:scale-105">
                  <CardHeader className="p-0">
                    <Image
                      src={collection.imageUrl}
                      width="400"
                      height="225"
                      alt={collection.name}
                      className="aspect-video w-full object-cover"
                    />
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={collection.creatorAvatarUrl} />
                        <AvatarFallback>
                          {collection.creator.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">
                          {collection.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          by {collection.creator}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Floor</p>
                        <p className="font-semibold">
                          {collection.floorPrice} SOL
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-muted-foreground">24h Volume</p>
                        <p className="font-semibold">
                          {collection.volume24h.toLocaleString()} SOL
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-start space-y-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Featured NFTs
              </h2>
            </div>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Check out some of the hottest new drops and featured items.
            </p>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {featuredNfts.map((nft) => (
              <Card key={nft.id} className="group overflow-hidden">
                <CardHeader className="relative p-0">
                  <Link href={`/item/${nft.id}`}>
                    <Image
                      src={nft.imageUrl}
                      width="400"
                      height="400"
                      alt={nft.name}
                      className="aspect-square w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-black/30 text-white backdrop-blur-sm hover:bg-black/50"
                  >
                    <Heart className="h-5 w-5" />
                  </Button>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{nft.collectionName}</span>
                    <span>Price</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{nft.name}</h3>
                    <p className="font-semibold">{nft.price} SOL</p>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button className="w-full">Buy Now</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="mt-12 flex justify-center">
            <Link href="/explore">
              <Button variant="outline">
                Explore More <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}