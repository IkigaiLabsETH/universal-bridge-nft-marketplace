"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Heart, Share2, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PixelHeader from "@/components/pixel-header";

import { getListing } from "thirdweb/extensions/marketplace";
import { defineChain, getContract } from "thirdweb";
import { client } from "@/app/client";
import { arbitrumSepolia } from "thirdweb/chains";
import { MARKETPLACE_CONTRACT_ADDRESS } from "@/constants/addresses";

type Listing = {
  id: string;
  assetContractAddress: string;
  tokenId: string;
  quantity: string;
  currencyValuePerToken: {
    displayValue: string;
    symbol: string;
  };
  asset: {
    metadata: {
      name: string;
      description: string;
      image: string;
      attributes: {
        trait_type: string;
        value: string;
      }[];
    };
    supply: string;
    id: string;
  };
  creatorAddress: string;
  type: string;
};

export default function NFTDetailPage({ params }: { params: { id: string } }) {
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState("attributes");

  const chain = defineChain(arbitrumSepolia);

  const market = getContract({
    address: MARKETPLACE_CONTRACT_ADDRESS,
    chain,
    client,
  });

  const formatIpfsUrl = (url: string) => {
    if (!url || !url.startsWith("ipfs://")) return "/placeholder.svg";
    return url.replace(
      "ipfs://",
      "https://d877020b8b0fc8b22cc94da95dfb1ef7.ipfscdn.io/ipfs/"
    );
  };

  const getAttributeValue = (attributes: any[], traitType: string) => {
    const attribute = attributes.find((attr) => attr.trait_type === traitType);
    return attribute ? attribute.value : "N/A";
  };

  useEffect(() => {
    const fetchListing = async () => {
      setIsLoading(true);
      try {
        const listingData = await getListing({
          contract: market,
          listingId: BigInt(params.id),
        });

        setListing(listingData as unknown as Listing);
      } catch (error) {
        console.error("Error fetching listing:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchListing();
    }
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <PixelHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <h2 className="text-2xl text-purple-400">Loading NFT details...</h2>
          </div>
        </main>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-black text-white">
        <PixelHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <h2 className="text-2xl text-purple-400">NFT not found</h2>
            <Link
              href="/"
              className="mt-4 inline-block text-green-400 hover:text-green-300"
            >
              Return to marketplace
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const power = getAttributeValue(listing.asset.metadata.attributes, "power");
  const ability = getAttributeValue(listing.asset.metadata.attributes, "ability");
  const level = getAttributeValue(listing.asset.metadata.attributes, "level");
  const type = getAttributeValue(listing.asset.metadata.attributes, "type");

  return (
    <div className="min-h-screen bg-black text-white">
      <PixelHeader />

      <main className="container mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to marketplace
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="relative">
            <div className="aspect-square relative overflow-hidden rounded-lg border-2 border-purple-500/20">
              <img
                src={formatIpfsUrl(listing.asset.metadata.image)}
                alt={listing.asset.metadata.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 flex space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`bg-black/70 ${
                    isLiked ? "text-red-500" : "text-purple-400 hover:text-purple-300"
                  }`}
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <Heart className={`h-5 w-5 ${isLiked ? "fill-red-500" : ""}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-black/70 text-purple-400 hover:text-purple-300"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
              <div className="absolute bottom-4 left-4 bg-black/70 px-3 py-1 rounded-full">
                <span className="text-sm text-purple-400">
                  {listing.asset.supply === "1" ? "Unique" : `Supply: ${listing.asset.supply}`}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-1">
                    {listing.asset.metadata.name}
                  </h1>
                  <p className="text-sm text-zinc-400">
                    Created by{" "}
                    <span className="text-purple-400">
                      {`${listing.creatorAddress.substring(0, 6)}...${listing.creatorAddress.substring(
                        listing.creatorAddress.length - 4
                      )}`}
                    </span>
                  </p>
                </div>
                <div className="bg-purple-500/10 px-3 py-1 rounded-full">
                  <span className="text-sm text-purple-400">{type}</span>
                </div>
              </div>

              <p className="text-zinc-300">{listing.asset.metadata.description}</p>

              <div className="bg-zinc-900/50 p-4 rounded-lg">
                <p className="text-sm text-zinc-400 mb-1">Current price</p>
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold text-green-400 mr-2">
                    {listing.currencyValuePerToken.displayValue} {listing.currencyValuePerToken.symbol}
                  </span>
                </div>
              </div>

              <div className="flex gap-4">
                <Button className="flex-1 bg-purple-600 hover:bg-purple-700 h-12">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Buy Now
                </Button>
                <Button className="flex-1 bg-green-600 hover:bg-green-700 h-12">
                  Make Offer
                </Button>
              </div>
            </div>

            <div className="bg-zinc-900/50 rounded-lg overflow-hidden">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full grid grid-cols-3 bg-zinc-900/50">
                  <TabsTrigger
                    value="attributes"
                    className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                  >
                    Attributes
                  </TabsTrigger>
                  <TabsTrigger
                    value="details"
                    className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                  >
                    Details
                  </TabsTrigger>
                  <TabsTrigger
                    value="history"
                    className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                  >
                    History
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="attributes" className="p-4">
                  <div className="grid grid-cols-2 gap-4">
                    {listing.asset.metadata.attributes.map((attr, index) => (
                      <Card key={index} className="bg-zinc-800/50 border-zinc-700">
                        <CardContent className="p-4">
                          <p className="text-sm text-zinc-400">{attr.trait_type}</p>
                          <p className="text-lg font-medium text-white">{attr.value}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="details" className="p-4">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-zinc-400">Contract Address</p>
                      <p className="text-white">{listing.assetContractAddress}</p>
                    </div>
                    <div>
                      <p className="text-sm text-zinc-400">Token ID</p>
                      <p className="text-white">{listing.tokenId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-zinc-400">Token Standard</p>
                      <p className="text-white">ERC-721</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="history" className="p-4">
                  <div className="text-center text-zinc-400">
                    No transaction history available
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
