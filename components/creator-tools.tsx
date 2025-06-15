export default function CreatorTools() {
  const { connected } = useWallet()

  if (!connected) {
    return (
      <div className="flex flex-col items-center justify-center h-64 rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20">
        <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Connect Your Wallet</h2>
        <p className="text-muted-foreground">Please connect your wallet to access the creator tools.</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <Tabs defaultValue="create-collection" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
          <TabsTrigger value="create-collection">Create Collection</TabsTrigger>
          <TabsTrigger value="mint-nft">Mint NFT</TabsTrigger>
          <TabsTrigger value="manage-collections">Manage Collections</TabsTrigger>
        </TabsList>
        <TabsContent value="create-collection" className="mt-4">
          <CreateCollectionForm />
        </TabsContent>
        <TabsContent value="mint-nft" className="mt-4">
          <MintNftForm />
        </TabsContent>
        <TabsContent value="manage-collections" className="mt-4">
            <ManageCollections />
        </TabsContent>
      </Tabs>
    </div>
  )
}