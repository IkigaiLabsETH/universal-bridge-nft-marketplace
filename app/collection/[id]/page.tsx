"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getContract, readContract } from "thirdweb";
import { client } from "@/app/client";
import { ethereum } from "@/app/chains";

interface Collection {
  id: string;
  name: string;
  description: string;
  floorPrice: number | null;
  items: number | null;
  owners: number | null;
  topBid: null;
  volume: number;
  createdAt: string | null;
}

export default function CollectionPage({ params }: { params: { id: string } }) {
  const [sortBy, setSortBy] = useState("floor-low-high");
  const [activeTab, setActiveTab] = useState("collection");
  const [collection, setCollection] = useState<Collection>({
    id: params.id,
    name: "Collection",
    description: "",
    floorPrice: null,
    items: null,
    owners: null,
    topBid: null,
    volume: 0,
    createdAt: null
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCollectionData = async () => {
      try {
        setIsLoading(true);
        
        // Initialize contract on Ethereum mainnet
        const contract = getContract({
          address: params.id,
          chain: ethereum,
          client,
        });

        // Read contract data using readContract
        const [name, symbol, totalSupply] = await Promise.all([
          readContract({
            contract,
            method: "function name() view returns (string)"
          }),
          readContract({
            contract,
            method: "function symbol() view returns (string)"
          }),
          readContract({
            contract,
            method: "function totalSupply() view returns (uint256)"
          })
        ]);

        // Update collection data
        setCollection({
          id: params.id,
          name: name as string,
          description: `${name as string} (${symbol as string})`,
          floorPrice: null, // You'll need to implement marketplace integration for this
          items: Number(totalSupply) || null,
          owners: null, // Would need separate indexing service to track this
          topBid: null, // You'll need to implement marketplace integration for this
          volume: 0, // You'll need to implement marketplace integration for this
          createdAt: null // Would need to query blockchain for contract creation
        });

      } catch (error) {
        console.error("Error fetching collection data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollectionData();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black">
        <main className="container mx-auto px-4 py-8">
          <div className="text-center text-zinc-400">Loading collection data...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <main className="container mx-auto px-4 py-8">
        {/* Collection Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-8">{collection.name}</h1>
          
          {/* Collection Stats */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
            <div>
              <p className="text-sm text-zinc-400 mb-1">Floor</p>
              <p className="text-lg font-medium text-white">
                {collection.floorPrice ? `Ξ ${collection.floorPrice}` : '—'}
              </p>
            </div>
            <div>
              <p className="text-sm text-zinc-400 mb-1">Items</p>
              <p className="text-lg font-medium text-white">
                {collection.items ?? '—'}
              </p>
            </div>
            <div>
              <p className="text-sm text-zinc-400 mb-1">Owners</p>
              <p className="text-lg font-medium text-white">
                {collection.owners ?? '—'}
              </p>
            </div>
            <div>
              <p className="text-sm text-zinc-400 mb-1">Top Bid</p>
              <p className="text-lg font-medium text-white">
                {collection.topBid ? `Ξ ${collection.topBid}` : '—'}
              </p>
            </div>
            <div>
              <p className="text-sm text-zinc-400 mb-1">Volume</p>
              <p className="text-lg font-medium text-white">
                Ξ {collection.volume}
              </p>
            </div>
            <div>
              <p className="text-sm text-zinc-400 mb-1">Created On</p>
              <p className="text-lg font-medium text-white">
                {collection.createdAt ?? '—'}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs and Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="bg-zinc-900">
              <TabsTrigger 
                value="collection"
                className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black"
              >
                Collection
              </TabsTrigger>
              <TabsTrigger 
                value="activity"
                className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black"
              >
                Activity
              </TabsTrigger>
            </TabsList>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none"
            >
              <option value="floor-low-high">Floor: Low to high</option>
              <option value="floor-high-low">Floor: High to low</option>
              <option value="recent">Recently listed</option>
            </select>
          </div>

          <TabsContent value="collection" className="mt-6">
            <div className="text-center text-zinc-400 py-12">
              No results found
            </div>
          </TabsContent>

          <TabsContent value="activity" className="mt-6">
            <div className="text-center text-zinc-400 py-12">
              No activity found
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
} 