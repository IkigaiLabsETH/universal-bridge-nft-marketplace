"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface NFTCollection {
  id: string;
  name: string;
  image: string;
  volume24h: number;
  sales24h: number;
  priceChange24h: number;
}

export default function ExplorePage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedChain, setSelectedChain] = useState("Ethereum");
  const [selectedCollection, setSelectedCollection] = useState("AI Inspired");

  const collections: NFTCollection[] = [
    {
      id: "1",
      name: "Winds of Yawanawa by Yawanawa and Refik Anadol",
      image: "/collections/1.jpg",
      volume24h: 0,
      sales24h: 6.37,
      priceChange24h: 100
    },
    {
      id: "2",
      name: "LOSTPOETS",
      image: "/collections/2.jpg",
      volume24h: 0.13,
      sales24h: 0.04,
      priceChange24h: 6.90
    },
    // Add more collections as needed
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-zinc-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-yellow-400 text-4xl font-bold">
              生
            </Link>
            <div className="flex-1 max-w-xl mx-4">
              <div className="relative">
                <input
                  type="search"
                  placeholder="Search collections and addresses"
                  className="w-full bg-transparent border border-yellow-400 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-yellow-400 h-5 w-5" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" className="text-white border-zinc-700 hover:bg-zinc-800">
                Sign In
              </Button>
              <Button variant="ghost" size="icon" className="text-white">
                <span className="sr-only">Menu</span>
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-yellow-400 text-6xl font-bold mb-8">Explore</h1>
        
        {/* Chain Selector */}
        <div className="flex items-center gap-2 mb-8">
          <span className="text-zinc-400">on</span>
          <div className="relative">
            <select
              value={selectedChain}
              onChange={(e) => setSelectedChain(e.target.value)}
              className="appearance-none bg-transparent text-yellow-400 font-bold border-b-2 border-yellow-400 pr-8 py-1 focus:outline-none"
            >
              <option value="Ethereum">Ethereum</option>
              <option value="Polygon">Polygon</option>
              <option value="Solana">Solana</option>
            </select>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="h-4 w-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Collection Filter and View Toggle */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <span className="text-white">Collection:</span>
            <select
              value={selectedCollection}
              onChange={(e) => setSelectedCollection(e.target.value)}
              className="appearance-none bg-transparent text-white border-b-2 border-white pr-8 py-1 focus:outline-none"
            >
              <option value="AI Inspired">AI Inspired</option>
              <option value="Photography">Photography</option>
              <option value="Art">Art</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className="text-yellow-400"
            >
              <LayoutGrid className="h-5 w-5" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
              className="text-yellow-400"
            >
              <List className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Collections Grid */}
        <div className={`grid ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4" : "grid-cols-1"} gap-6`}>
          {collections.map((collection) => (
            <Card key={collection.id} className="bg-zinc-900 border-zinc-800 overflow-hidden">
              <Link href={`/collection/${collection.id}`}>
                <div className="aspect-square relative">
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-white font-medium mb-2">{collection.name}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-zinc-400">24h Volume:</p>
                      <p className="text-white">Ξ {collection.volume24h}</p>
                      <p className="text-sm text-green-400">↑ {collection.priceChange24h}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-zinc-400">24h sales:</p>
                      <p className="text-white">Ξ {collection.sales24h}</p>
                    </div>
                  </div>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
} 