import { notFound } from "next/navigation"
import { ExternalLink, Copy } from "lucide-react"
import { collections } from "@/constants/collections"
import CategoryNFTGrid from "@/components/category-nft-grid"
import { Button } from "@/components/ui/button"

interface ContractPageProps {
  params: {
    chain: string;
    contract: string;
  }
}

export default function ContractPage({ params }: ContractPageProps) {
  // Find collection by contract address
  const collection = collections.find(
    (c) => c.contractAddress.toLowerCase() === params.contract.toLowerCase() &&
          c.chain.name.toLowerCase() === params.chain
  )

  if (!collection) {
    notFound()
  }

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const getBlockExplorerLink = (address: string) => {
    return `${collection.chain.blockExplorer}/address/${address}`
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        {/* Collection Header */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{collection.name}</h1>
            <p className="text-zinc-400 mb-4 max-w-2xl">{collection.description}</p>
            
            {/* Contract Info */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-zinc-500">Contract:</span>
                <code className="text-purple-400 bg-zinc-800 px-2 py-1 rounded">
                  {truncateAddress(collection.contractAddress)}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => navigator.clipboard.writeText(collection.contractAddress)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <a
                  href={getBlockExplorerLink(collection.contractAddress)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
              {collection.startTokenId && (
                <div className="text-zinc-500">
                  Token Range: {collection.startTokenId} - {collection.endTokenId}
                </div>
              )}
            </div>
          </div>

          {/* Collection Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
            <div className="bg-zinc-800 rounded-lg p-4">
              <p className="text-sm text-zinc-500">Items</p>
              <p className="text-xl font-bold text-purple-400">{collection.totalSupply}</p>
            </div>
            <div className="bg-zinc-800 rounded-lg p-4">
              <p className="text-sm text-zinc-500">Floor Price</p>
              <p className="text-xl font-bold text-green-400">{collection.floorPrice} {collection.chain.symbol}</p>
            </div>
            <div className="bg-zinc-800 rounded-lg p-4">
              <p className="text-sm text-zinc-500">Volume Traded</p>
              <p className="text-xl font-bold text-blue-400">{collection.volumeTraded} {collection.chain.symbol}</p>
            </div>
            <div className="bg-zinc-800 rounded-lg p-4">
              <p className="text-sm text-zinc-500">Created</p>
              <p className="text-sm font-medium text-zinc-400">
                {new Date(collection.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Collection Items */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">Items</h2>
            <div className="flex gap-2">
              <Button variant="outline" className="text-purple-400 border-purple-400">
                Activity
              </Button>
              <select className="bg-zinc-800 text-white border border-zinc-700 rounded px-3 py-2">
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Recently Listed</option>
                <option>Recently Created</option>
              </select>
            </div>
          </div>
          <CategoryNFTGrid category="all" collectionId={collection.id} />
        </div>
      </div>
    </div>
  )
} 