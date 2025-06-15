export default function CollectionPage({
  params,
}: {
  params: { address: string }
}) {
  const { collection, nfts: initialNfts } = useMemo(
    () => generateMockData(params.address),
    [params.address]
  )

  const [searchQuery, setSearchQuery] = useState('')
  const [priceRange, setPriceRange] = useState([0, 200])
  const [selectedTraits, setSelectedTraits] = useState<Record<string, string[]>>(
    {}
  )
  const [sortBy, setSortBy] = useState('price_asc')

  const availableTraits = useMemo(() => {
    const traits: Record<string, Set<string>> = {}
    initialNfts.forEach(nft => {
      nft.traits.forEach(trait => {
        if (!traits[trait.type]) {
          traits[trait.type] = new Set()
        }
        traits[trait.type].add(trait.value)
      })
    })
    return Object.fromEntries(
      Object.entries(traits).map(([key, value]) => [key, Array.from(value)])
    )
  }, [initialNfts])

  const handleTraitChange = (traitType: string, traitValue: string) => {
    setSelectedTraits(prev => {
      const newSelection = { ...prev }
      if (!newSelection[traitType]) {
        newSelection[traitType] = []
      }
      const isSelected = newSelection[traitType].includes(traitValue)
      if (isSelected) {
        newSelection[traitType] = newSelection[traitType].filter(
          v => v !== traitValue
        )
        if (newSelection[traitType].length === 0) {
          delete newSelection[traitType]
        }
      } else {
        newSelection[traitType].push(traitValue)
      }
      return newSelection
    })
  }

  const filteredAndSortedNfts = useMemo(() => {
    let filtered = initialNfts
      .filter(nft =>
        nft.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .filter(
        nft => nft.price >= priceRange[0] && nft.price <= priceRange[1]
      )
      .filter(nft => {
        return Object.entries(selectedTraits).every(([type, values]) => {
          if (values.length === 0) return true
          return nft.traits.some(
            trait => trait.type === type && values.includes(trait.value)
          )
        })
      })

    switch (sortBy) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'id_asc':
        filtered.sort((a, b) => parseInt(a.id) - parseInt(b.id))
        break
    }
    return filtered
  }, [searchQuery, priceRange, selectedTraits, sortBy, initialNfts])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="relative h-48 md:h-64">
        <Image
          src={collection.bannerImageUrl}
          alt={`${collection.name} banner`}
          layout="fill"
          objectFit="cover"
          className="z-0"
        />
        <div className="absolute inset-0 bg-black/50" />
      </header>

      <main className="-mt-16 md:-mt-24 px-4 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-7xl">
          <div className="flex flex-col items-center md:flex-row md:items-end md:space-x-6">
            <Avatar className="h-32 w-32 md:h-48 md:w-48 border-4 border-background">
              <AvatarImage src={collection.profileImageUrl} alt={collection.name} />
              <AvatarFallback>{collection.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="mt-4 md:mt-0 text-center md:text-left">
              <h1 className="text-3xl md:text-5xl font-bold">{collection.name}</h1>
              <p className="text-muted-foreground mt-1">
                by <span className="text-primary">{collection.creator}</span>
              </p>
            </div>
          </div>

          <p className="mt-6 max-w-3xl mx-auto md:mx-0 text-muted-foreground text-center md:text-left">
            {collection.description}
          </p>

          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              icon={<Wallet className="h-4 w-4" />}
              label="Floor Price"
              value={`${collection.stats.floorPrice} SOL`}
            />
            <StatCard
              icon={<Landmark className="h-4 w-4" />}
              label="Total Volume"
              value={`${(collection.stats.totalVolume / 1000).toFixed(1)}K SOL`}
            />
            <StatCard
              icon={<LayoutGrid className="h-4 w-4" />}
              label="Items"
              value={collection.stats.items.toLocaleString()}
            />
            <StatCard
              icon={<Users className="h-4 w-4" />}
              label="Owners"
              value={collection.stats.owners.toLocaleString()}
            />
          </div>

          <Separator className="my-8" />

          <div className="lg:grid lg:grid-cols-4 lg:gap-8">
            {/* --- FILTERS SIDEBAR --- */}
            <aside className="hidden lg:block lg:col-span-1">
              <h2 className="text-xl font-semibold mb-4">Filters</h2>
              <Accordion type="multiple" defaultValue={['price', 'traits']}>
                <AccordionItem value="price">
                  <AccordionTrigger>Price Range</AccordionTrigger>
                  <AccordionContent className="pt-4">
                    <Slider
                      min={0}
                      max={200}
                      step={1}
                      value={priceRange}
                      onValueChange={setPriceRange}
                    />
                    <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                      <span>{priceRange[0]} SOL</span>
                      <span>{priceRange[1]} SOL</span>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="traits">
                  <AccordionTrigger>Traits</AccordionTrigger>
                  <AccordionContent>
                    <Accordion type="multiple" className="w-full">
                      {Object.entries(availableTraits).map(
                        ([type, values]) => (
                          <AccordionItem value={type} key={type}>
                            <AccordionTrigger>{type}</AccordionTrigger>
                            <AccordionContent className="space-y-2 max-h-60 overflow-y-auto pr-2">
                              {values.map(value => (
                                <div
                                  key={value}
                                  className="flex items-center space-x-2"
                                >
                                  <Checkbox
                                    id={`${type}-${value}`}
                                    onCheckedChange={() =>
                                      handleTraitChange(type, value)
                                    }
                                    checked={selectedTraits[type]?.includes(
                                      value
                                    )}
                                  />
                                  <label
                                    htmlFor={`${type}-${value}`}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                  >
                                    {value}
                                  </label>
                                </div>
                              ))}
                            </AccordionContent>
                          </AccordionItem>
                        )
                      )}
                    </Accordion>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </aside>

            {/* --- NFT GRID --- */}
            <div className="lg:col-span-3">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search by name..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-4">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price_asc">Price: Low to High</SelectItem>
                      <SelectItem value="price_desc">Price: High to Low</SelectItem>
                      <SelectItem value="id_asc">ID: Ascending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {filteredAndSortedNfts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredAndSortedNfts.map(nft => (
                    <Card key={nft.id} className="overflow-hidden group">
                      <CardHeader className="p-0">
                         <div className="aspect-square relative">
                          <Image
                            src={nft.imageUrl}
                            alt={nft.name}
                            layout="fill"
                            objectFit="cover"
                            className="group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground truncate">{collection.name}</p>
                        <h3 className="font-semibold truncate mt-1">{nft.name}</h3>
                        <div className="mt-2 font-bold text-lg">
                          {nft.price} SOL
                        </div>
                      </CardContent>
                       <CardFooter className="p-4 pt-0">
                        <Button className="w-full">Buy Now</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <h3 className="text-2xl font-semibold">No NFTs Found</h3>
                  <p className="text-muted-foreground mt-2">
                    Try adjusting your filters.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}