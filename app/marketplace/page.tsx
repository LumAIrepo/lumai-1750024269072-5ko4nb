export default function MarketplacePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("volume_desc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredAndSortedCollections = useMemo(() => {
    return mockCollections
      .filter((collection) =>
        collection.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        switch (sortOption) {
          case "volume_desc":
            return b.totalVolume - a.totalVolume;
          case "volume_asc":
            return a.totalVolume - b.totalVolume;
          case "floor_desc":
            return b.floorPrice - a.floorPrice;
          case "floor_asc":
            return a.floorPrice - b.floorPrice;
          case "name_asc":
            return a.name.localeCompare(b.name);
          case "name_desc":
            return b.name.localeCompare(a.name);
          default:
            return 0;
        }
      });
  }, [searchTerm, sortOption]);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Explore Collections</h1>
        <p className="text-muted-foreground">Discover, trade, and showcase extraordinary NFTs from top creators.</p>
      </header>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search collections..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-full md:w-[180px]">
              <ArrowUpDown className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="volume_desc">Volume: High to Low</SelectItem>
              <SelectItem value="volume_asc">Volume: Low to High</SelectItem>
              <SelectItem value="floor_desc">Floor Price: High to Low</SelectItem>
              <SelectItem value="floor_asc">Floor Price: Low to High</SelectItem>
              <SelectItem value="name_asc">Alphabetical: A-Z</SelectItem>
              <SelectItem value="name_desc">Alphabetical: Z-A</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex rounded-md border bg-background">
             <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('grid')}>
                <LayoutGrid className="h-5 w-5" />
                <span className="sr-only">Grid View</span>
            </Button>
            <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('list')}>
                <List className="h-5 w-5" />
                <span className="sr-only">List View</span>
            </Button>
          </div>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredAndSortedCollections.map((collection) => (
            <Link key={collection.id} href={`/collection/${collection.id}`} passHref>
              <Card className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer h-full flex flex-col">
                <div className="relative">
                  <Image
                    src={collection.bannerUrl}
                    alt={`${collection.name} banner`}
                    width={300}
                    height={120}
                    className="w-full h-28 object-cover"
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mOMY2D4DwADSwH8zBCp7AAAAABJRU5ErkJggg=="
                  />
                  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                    <Image
                      src={collection.imageUrl}
                      alt={`${collection.name} logo`}
                      width={80}
                      height={80}
                      className="rounded-full border-4 border-background bg-background object-cover"
                      placeholder="blur"
                      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mOMY2D4DwADSwH8zBCp7AAAAABJRU5ErkJggg=="
                    />
                  </div>
                </div>
                <CardContent className="pt-14 text-center flex-grow flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-center gap-1.5">
                            <p className="font-bold text-lg">{collection.name}</p>
                            {collection.isVerified && <BadgeCheck className="h-5 w-5 text-primary" />}
                        </div>
                    </div>
                  <div className="flex justify-around pt-4 w-full">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Floor</p>
                      <p className="font-semibold">{collection.floorPrice} SOL</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Volume</p>
                      <p className="font-semibold">{formatVolume(collection.totalVolume)} SOL</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card>
            <div className="hidden md:grid md:grid-cols-12 gap-4 font-semibold text-muted-foreground p-4 border-b">
                <div className="col-span-5">Collection</div>
                <div className="col-span-2 text-right">Floor Price</div>
                <div className="col-span-2 text-right">24h Volume</div>
                <div className="col-span-3 text-right">Total Volume</div>
            </div>
            {filteredAndSortedCollections.map((collection, index) => (
                <Link key={collection.id} href={`/collection/${collection.id}`} passHref>
                    <div className="grid grid-cols-3 md:grid-cols-12 items-center gap-4 p-4 hover:bg-muted/50 transition-colors cursor-pointer border-b last:border-b-0">
                        <div className="col-span-3 md:col-span-5 flex items-center gap-4">
                            <div className="text-muted-foreground hidden md:block w-6 text-center">{index + 1}</div>
                            <Image src={collection.imageUrl} alt={collection.name} width={48} height={48} className="rounded-md object-cover" />
                            <div className="flex items-center gap-1.5">
                                <span className="font-semibold">{collection.name}</span>
                                {collection.isVerified && <BadgeCheck className="h-4 w-4 text-primary" />}
                            </div>
                        </div>
                        <div className="md:col-span-2 text-right font-medium">
                            <span className="md:hidden text-xs text-muted-foreground">Floor: </span>
                            {collection.floorPrice.toFixed(2)} SOL
                        </div>
                        <div className="md:col-span-2 text-right font-medium text-green-500">
                             <span className="md:hidden text-xs text-muted-foreground">24h Vol: </span>
                            {(collection.totalVolume * 0.05).toFixed(2)} SOL
                        </div>
                        <div className="col-span-2 md:col-span-3 text-right font-medium">
                            <span className="md:hidden text-xs text-muted-foreground">Total Vol: </span>
                            {formatVolume(collection.totalVolume)} SOL
                        </div>
                    </div>
                </Link>
            ))}
        </Card>
      )}

      {filteredAndSortedCollections.length === 0 && (
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold mb-2">No collections found</h2>
          <p className="text-muted-foreground">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}