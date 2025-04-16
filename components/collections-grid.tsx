import Link from "next/link"
import { collections } from "@/constants/collections"
import { Card, CardContent } from "@/components/ui/card"

export default function CollectionsGrid() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Featured Collections</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((collection) => (
          <Link 
            key={collection.id} 
            href={`/${collection.chain.name.toLowerCase()}/${collection.contractAddress}${
              collection.startTokenId ? `:${collection.startTokenId}:${collection.endTokenId}` : ''
            }`}
          >
            <Card className="pixel-card bg-zinc-800 border-purple-500 overflow-hidden hover:border-purple-400 transition-colors">
              <div className="relative aspect-video">
                {/* Collection preview - shows first 4 items in a grid */}
                <div className="grid grid-cols-2 h-full">
                  {collection.items.slice(0, 4).map((item, index) => (
                    <div key={item.id} className="relative aspect-square">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={`${collection.name} preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg text-white">{collection.name}</h3>
                    <p className="text-sm text-zinc-400 line-clamp-2">{collection.description}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4">
                  <div className="bg-zinc-900 rounded p-2 text-center">
                    <p className="text-xs text-zinc-500">Items</p>
                    <p className="text-sm font-medium text-purple-400">{collection.totalSupply}</p>
                  </div>
                  <div className="bg-zinc-900 rounded p-2 text-center">
                    <p className="text-xs text-zinc-500">Floor</p>
                    <p className="text-sm font-medium text-green-400">{collection.floorPrice} {collection.chain.symbol}</p>
                  </div>
                  <div className="bg-zinc-900 rounded p-2 text-center">
                    <p className="text-xs text-zinc-500">Volume</p>
                    <p className="text-sm font-medium text-blue-400">{collection.volumeTraded} {collection.chain.symbol}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
} 