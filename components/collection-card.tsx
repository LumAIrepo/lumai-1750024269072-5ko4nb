export default function CollectionCard({ collection }: CollectionCardProps) {
  return (
    <Link href={`/collection/${collection.id}`} className="block group" aria-label={`View ${collection.name} collection`}>
      <Card className="overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:border-primary/50">
        <CardHeader className="p-0">
          <div className="relative aspect-video w-full overflow-hidden">
            <Image
              src={collection.imageUrl}
              alt={`Image of ${collection.name} collection`}
              fill
              className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg truncate" title={collection.name}>
              {collection.name}
            </h3>
            {collection.verified && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 text-blue-500 flex-shrink-0"
                aria-label="Verified collection"
              >
                <path
                  fillRule="evenodd"
                  d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12c0 1.357-.6 2.573-1.549 3.397a4.49 4.49 0 01-1.307 3.498 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.491 4.491 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 grid grid-cols-2 gap-4 text-sm">
          <div className="flex flex-col">
            <span className="text-muted-foreground">Floor</span>
            <div className="flex items-center gap-1.5 font-semibold text-foreground">
              <SolanaIcon />
              <span>{formatNumber(collection.floorPrice)}</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-muted-foreground">24h Volume</span>
            <div className="flex items-center gap-1.5 font-semibold text-foreground">
              <SolanaIcon />
              <span>{formatNumber(collection.volume24h)}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}