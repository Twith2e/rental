"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BedDouble, Wallet } from "lucide-react";
import { useUser } from "@/app/context/user-context";
import {
  getTransactionHistory,
  type Transaction,
} from "@/app/services/dashboard/dashboard-service";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";

export default function DashboardPage() {
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

  // Calculate summary metrics
  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalItems = transactions.reduce(
    (sum, t) =>
      sum + t.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
    0
  );

  return (
    <div className="flex flex-col gap-8 p-8 bg-gradient-to-b from-slate-50 to-white min-h-screen">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Welcome to Rental Furnish
        </h1>
        <p className="text-slate-600 mt-2">
          Your personalized furniture rental dashboard.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-slate-100">
            <CardTitle className="text-sm font-medium text-slate-900">
              Total Spent
            </CardTitle>
            <Wallet className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-slate-900">
              {formatCurrency(totalSpent)}
            </div>
            <p className="text-sm text-slate-600 mt-1">Lifetime spending</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-slate-100">
            <CardTitle className="text-sm font-medium text-slate-900">
              Total Items
            </CardTitle>
            <BedDouble className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-slate-900">
              {totalItems}
            </div>
            <p className="text-sm text-slate-600 mt-1">Items rented</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow col-span-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-slate-100">
            <CardTitle className="text-sm font-medium text-slate-900">
              Monthly Spending Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={transactions
                    .reduce((acc, transaction) => {
                      const month = new Date(
                        transaction.createdAt
                      ).toLocaleString("default", { month: "long" });
                      const existingMonth = acc.find(
                        (item) => item.month === month
                      );
                      if (existingMonth) {
                        existingMonth.amount += transaction.amount;
                      } else {
                        acc.push({ month, amount: transaction.amount });
                      }
                      return acc;
                    }, [] as { month: string; amount: number }[])
                    .sort((a, b) => {
                      const months = [
                        "January",
                        "February",
                        "March",
                        "April",
                        "May",
                        "June",
                        "July",
                        "August",
                        "September",
                        "October",
                        "November",
                        "December",
                      ];
                      return months.indexOf(a.month) - months.indexOf(b.month);
                    })}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-slate-200"
                  />
                  <XAxis dataKey="month" className="text-sm text-slate-600" />
                  <YAxis
                    className="text-sm text-slate-600"
                    tickFormatter={(value) => formatCurrency(value)}
                  />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "6px",
                      padding: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={{ fill: "#6366f1" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Transaction History
        </h2>
        <Card className="border border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[400px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-8 text-slate-600">
                No transactions found.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction: Transaction) => (
                    <TableRow key={transaction._id}>
                      <TableCell>
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {transaction.items
                          .map((item) => item.furnitureId.name)
                          .join(", ")}
                      </TableCell>
                      <TableCell className="capitalize">
                        {transaction.paymentMethod}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(transaction.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
