export default function NFTCard({
  imageUrl,
  name,
  collectionName,
  price,
  isVerified = false,
}: NFTCardProps) {
  return (
    <div className="relative group w-full max-w-sm bg-card border border-border rounded-xl overflow-hidden shadow-sm transition-all hover:shadow-md">
      <div className="absolute top-3 right-3 z-10">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-card/60 backdrop-blur-sm hover:bg-card/80"
        >
          <Heart className="h-5 w-5 text-card-foreground" />
          <span className="sr-only">Favorite</span>
        </Button>
      </div>

      <div className="aspect-square overflow-hidden">
        <Image
          src={imageUrl}
          alt={`Image of ${name}`}
          width={400}
          height={400}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          priority={false}
        />
      </div>

      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-grow min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-sm text-muted-foreground truncate">
                {collectionName}
              </p>
              {isVerified && (
                <ShieldCheck className="h-4 w-4 text-blue-500 flex-shrink-0" />
              )}
            </div>
            <h3
              className="text-md font-semibold text-card-foreground truncate"
              title={name}
            >
              {name}
            </h3>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-xs text-muted-foreground">Price</p>
            <p className="text-md font-bold">◎ {price.toLocaleString()}</p>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Button className="w-full">Buy Now</Button>
          <Button variant="outline" size="icon">
            <ShoppingCart className="h-5 w-5" />
            <span className="sr-only">Add to cart</span>
          </Button>
        </div>
      </div>
    </div>
  )
}