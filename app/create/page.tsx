export default function CreatePage() {
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()
  const { toast } = useToast()

  const [name, setName] = useState('')
  const [symbol, setSymbol] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [txSignature, setTxSignature] = useState('')

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImage(file)
      setImageUrl(URL.createObjectURL(file))
    }
  }

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create an NFT.",
        variant: "destructive",
      })
      return
    }
    if (!name || !symbol || !image) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields (Name, Symbol, Image).",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setTxSignature('')

    try {
      // In a real application, you would upload the image and metadata to a
      // decentralized storage service like Arweave or IPFS.
      // For this example, we'll simulate this and proceed with a simple transaction.
      const metadata = {
        name,
        symbol,
        description,
        image: `https://example.com/images/${image.name}`, // Placeholder URL
      }
      
      console.log("Simulating metadata upload:", metadata)

      // A real NFT mint would involve a more complex transaction with the Metaplex program.
      // As a placeholder to demonstrate wallet interaction, we'll create a simple
      // system transfer transaction. This could be replaced with your program's instructions.
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey("Czesj2Mhey218s2j1fBvGokrSj5cGSb31zn4hV2T6X91"), // A placeholder recipient
          lamports: 0.001 * LAMPORTS_PER_SOL, // A nominal amount
        })
      )

      const signature = await sendTransaction(transaction, connection)
      await connection.confirmTransaction(signature, 'processed')

      setTxSignature(signature)
      toast({
        title: "Transaction Successful!",
        description: `Your creation has been submitted to the blockchain.`,
      })
    } catch (error) {
      console.error("Transaction failed", error)
      toast({
        title: "Transaction Failed",
        description: `An error occurred: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [publicKey, connection, sendTransaction, name, symbol, description, image, toast])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Create New Item</CardTitle>
              <CardDescription>
                Provide details for your new collectible. Fields with * are required.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="image">Image*</Label>
                <div className="flex items-center justify-center w-full">
                  <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted">
                    {imageUrl ? (
                      <img src={imageUrl} alt="Preview" className="object-cover h-full w-full rounded-lg" />
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                      </div>
                    )}
                    <input id="image-upload" type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name*</Label>
                <Input id="name" placeholder="e.g. 'Solana Sunrise'" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="symbol">Symbol*</Label>
                <Input id="symbol" placeholder="e.g. 'SUN'" value={symbol} onChange={(e) => setSymbol(e.target.value)} required maxLength={10} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="A brief description of your item." value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start space-y-4">
              <Button type="submit" disabled={!publicKey || isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : 'Create Item'}
              </Button>
              {txSignature && (
                <div className="text-sm text-muted-foreground">
                  <p>Success! View your transaction on Solana Explorer:</p>
                  <a
                    href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline break-all"
                  >
                    {txSignature}
                  </a>
                </div>
              )}
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  )
}