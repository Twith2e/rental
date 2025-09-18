"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/app/context/user-context";
import {
  getTransactionHistory,
  type Transaction,
} from "@/app/services/dashboard/dashboard-service";

export function DashboardTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useUser();

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user?.email) return;

      try {
        setIsLoading(true);
        const data = await getTransactionHistory(user.email);
        setTransactions(data);
      } catch (error) {
        toast({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to load transaction history",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [user?.email, toast]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-4 w-full h-24 animate-pulse bg-muted" />
        ))}
      </div>
    );
  }

  if (!transactions.length) {
    return (
      <Card className="p-8 text-center text-muted-foreground">
        No transactions found.
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <Card key={transaction._id} className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">
                {transaction.items
                  .map((item) => item.furnitureId.name)
                  .join(", ")}
              </p>
              <p className="text-sm text-muted-foreground">
                {new Date(transaction.createdAt).toLocaleDateString()} via{" "}
                {transaction.paymentMethod}
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium">
                {formatCurrency(transaction.amount)}
              </p>
              <p className="text-sm text-muted-foreground">
                {transaction.items.reduce(
                  (acc, item) => acc + item.quantity,
                  0
                )}{" "}
                items
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
