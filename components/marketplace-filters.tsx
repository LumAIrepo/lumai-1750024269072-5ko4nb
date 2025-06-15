export default function MarketplaceFilters() {
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  return (
    <div className="w-full lg:w-72 xl:w-80 h-full bg-card text-card-foreground border-r border-border p-4 flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <ListFilter className="h-5 w-5" />
          Filters
        </h2>
        <Button variant="ghost" size="sm">
          Clear All
        </Button>
      </div>

      <div className="relative">
        <Input placeholder="Search collections..." className="pl-10" />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>
      
      <div>
        <Label htmlFor="sort-by" className="text-sm font-medium text-muted-foreground">Sort by</Label>
        <Select defaultValue="price_low_to_high">
          <SelectTrigger id="sort-by" className="w-full mt-1">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price_low_to_high">Price: Low to High</SelectItem>
            <SelectItem value="price_high_to_low">Price: High to Low</SelectItem>
            <SelectItem value="recently_listed">Recently Listed</SelectItem>
            <SelectItem value="most_viewed">Most Viewed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Accordion type="multiple" defaultValue={['status', 'price']} className="w-full">
        <AccordionItem value="status">
          <AccordionTrigger className="text-base font-semibold">Status</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {statusOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox id={`status-${option.toLowerCase().replace(/\s+/g, '-')}`} />
                  <Label htmlFor={`status-${option.toLowerCase().replace(/\s+/g, '-')}`} className="font-normal cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger className="text-base font-semibold">Price</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full"
                  aria-label="Minimum price"
                />
                <span className="text-muted-foreground">-</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full"
                  aria-label="Maximum price"
                />
              </div>
              <Button className="w-full">Apply</Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {attributeFilters.map((filter) => (
          <AccordionItem key={filter.name} value={`attribute-${filter.name.toLowerCase()}`}>
            <AccordionTrigger className="text-base font-semibold">{filter.name}</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {filter.options.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox id={`attr-${filter.name.toLowerCase()}-${option.toLowerCase().replace(/\s+/g, '-')}`} />
                    <Label
                      htmlFor={`attr-${filter.name.toLowerCase()}-${option.toLowerCase().replace(/\s+/g, '-')}`}
                      className="font-normal cursor-pointer"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}