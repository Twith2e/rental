"use client";

import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Furniture } from "@/types";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import api from "@/api";
import { useUser } from "@/app/context/user-context";
import { useRouter } from "next/navigation";

interface FurnitureCardProps {
  furniture: Furniture;
}

export function FurnitureCard({ furniture }: FurnitureCardProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();
  const router = useRouter();

  const handlePayment = async (furniture: Furniture) => {
    setIsProcessing(true);

    try {
      await api.post("/payment/process", {
        email: user?.email,
        items: [
          {
            furnitureId: furniture._id,
            quantity: 1,
          },
        ],
        paymentMethod: "credit_card",
      });
      toast({
        title: "Payment Successful",
        description: `Successfully purchased ${furniture.name}`,
        variant: "default",
      });
      router.push("/dashboard");
    } catch (error) {
      toast({
        title: "Payment Failed",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card
      className={`overflow-hidden transition-all hover:shadow-lg relative ${
        isProcessing ? "pointer-events-none opacity-60" : ""
      }`}
      onClick={() => handlePayment(furniture)}
    >
      <div className="aspect-video relative bg-muted">
        {furniture.imgUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={furniture.imgUrl}
            alt={furniture.name}
            className="object-cover w-full h-full"
          />
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold">{furniture.name}</h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
          {furniture.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(furniture.price)} retail
            </p>
          </div>
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
            {furniture.category}
          </span>
        </div>
      </div>
      {isProcessing && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/5 backdrop-blur-sm">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
    </Card>
  );
}
