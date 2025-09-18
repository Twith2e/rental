import api from "@/api";
import { Furniture } from "@/types";

export interface TransactionItem {
  furnitureId: Furniture;
  quantity: number;
  priceAtTime: number;
}

export interface Transaction {
  _id: string;
  email: string;
  amount: number;
  items: TransactionItem[];
  paymentMethod: string;
  createdAt: string;
}

export async function getTransactionHistory(
  email: string
): Promise<Transaction[]> {
  try {
    const response = await api.get<Transaction[]>(`/payment/history/${email}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to fetch transaction history"
    );
  }
}
