import Link from "next/link"
import { Heart } from "lucide-react"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { collections } from "@/constants/collections"

interface CategoryNFTGridProps {
  category: string;
  collectionId?: string;
}

export default function CategoryNFTGrid({ category, collectionId }: CategoryNFTGridProps) {
  // Get all NFTs from all collections or specific collection
  const allNFTs = collectionId
    ? collections
        .filter(collection => collection.id === collectionId)
        .flatMap(collection => 
          collection.items.map(item => ({
            ...item,
            collectionName: collection.name,
            collectionId: collection.id
          }))
        )
    : collections.flatMap(collection => 
        collection.items.map(item => ({
          ...item,
          collectionName: collection.name,
          collectionId: collection.id
        }))
      )

  // Filter NFTs based on category, or show all if category is "all"
  const filteredNFTs = category === "all" 
    ? allNFTs 
    : allNFTs.filter((nft) => nft.category === category)

  return (
    <div>
      {filteredNFTs.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl text-purple-400 mb-4">No items found in this category</h3>
          <p className="text-zinc-400">Check back later or explore other categories</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNFTs.map((nft) => (
            <Card key={nft.id} className="pixel-card bg-zinc-800 border-purple-500 overflow-hidden">
              <Link href={`/nft/${nft.id}`}>
                <div className="relative aspect-square">
                  <img
                    src={nft.image || "/placeholder.svg"}
                    alt={nft.name}
                    className="w-full h-full object-cover pixel-image"
                  />
                  <div className="absolute top-2 right-2 bg-zinc-900/70 px-2 py-1 rounded pixel-tag">
                    <span className="text-xs text-green-400">{nft.category}</span>
                  </div>
                  <div className="absolute bottom-2 left-2 bg-zinc-900/70 px-2 py-1 rounded pixel-tag">
                    <span className="text-xs text-purple-400">
                      {nft.supply === 1 ? "Unique" : `Supply: ${nft.supply}`}
                    </span>
                  </div>
                </div>
              </Link>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg text-white">{nft.name}</h3>
                    <p className="text-xs text-zinc-400">{nft.collectionName}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="text-purple-400 hover:text-purple-300">
                    <Heart className="h-5 w-5" />
                    <span className="sr-only">Like</span>
                  </Button>
                </div>

                {/* Item attributes */}
                <div className="grid grid-cols-3 gap-1 mb-3 text-center">
                  {nft.attributes.slice(0, 3).map((attr) => (
                    <div key={attr.trait_type} className="bg-zinc-900 rounded p-1">
                      <p className="text-xs text-zinc-500">{attr.trait_type}</p>
                      <p className="text-sm text-green-400">{attr.value}</p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-zinc-500">Current price</p>
                    <p className="text-lg font-bold text-green-400">{nft.price} ETH</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-zinc-500">Likes</p>
                    <p className="text-sm text-purple-400">{nft.likes}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex gap-2">
                <Button className="w-full pixel-button bg-purple-600 hover:bg-purple-700">Buy Now</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

