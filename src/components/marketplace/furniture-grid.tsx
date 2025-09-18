"use client";

import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { FurnitureCard } from "./furniture-card";
import { useGetAllFurnitures } from "@/app/services/furnitures/furniture";
import { Furniture } from "@/types";

type FurnitureCategory =
  | "living-room"
  | "bedroom"
  | "dining-room"
  | "office"
  | "outdoor"
  | "storage"
  | "decor";

const categories: { value: FurnitureCategory; label: string }[] = [
  { value: "living-room", label: "Living Room" },
  { value: "bedroom", label: "Bedroom" },
  { value: "dining-room", label: "Dining Room" },
  { value: "office", label: "Office" },
  { value: "outdoor", label: "Outdoor" },
  { value: "storage", label: "Storage" },
  { value: "decor", label: "Decor" },
];

export function FurnitureGrid() {
  const [selectedCategory, setSelectedCategory] =
    useState<FurnitureCategory | null>(null);
  const [furniture, setFurniture] = useState<Furniture[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const { data, isLoading: isFetching } = useGetAllFurnitures();

  useEffect(() => {
    if (data) {
      setFurniture(data);
      console.log(data);
    }
  }, [data]);

  const displayedFurniture = selectedCategory
    ? furniture.filter((item) => item.category === selectedCategory)
    : furniture;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Marketplace</h1>
        <Select
          value={selectedCategory || "all"}
          onValueChange={(value) =>
            setSelectedCategory(
              value === "all" ? null : (value as FurnitureCategory)
            )
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error ? (
        <div className="text-center py-12 text-muted-foreground">
          Failed to load furniture. Please try again later.
        </div>
      ) : isFetching ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="h-[300px] animate-pulse bg-muted" />
          ))}
        </div>
      ) : !displayedFurniture.length ? (
        <div className="text-center py-12 text-muted-foreground">
          No furniture found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayedFurniture.map((item) => (
            <FurnitureCard key={item._id} furniture={item} />
          ))}
        </div>
      )}
    </div>
  );
}
