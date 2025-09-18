"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BedDouble, Wallet, TrendingUp } from "lucide-react";
import { Transaction } from "@/app/services/dashboard/dashboard-service";
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

interface DashboardMetrics {
  totalSpent: number;
  totalItems: number;
  mostBoughtCategory: {
    category: string;
    count: number;
  };
  monthlySpending: {
    month: string;
    amount: number;
  }[];
}

export function calculateMetrics(
  transactions: Transaction[]
): DashboardMetrics {
  const categoryCount: Record<string, number> = {};
  const monthlySpending: Record<string, number> = {};
  let totalSpent = 0;
  let totalItems = 0;

  transactions.forEach((transaction) => {
    totalSpent += transaction.amount;
    totalItems += transaction.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    transaction.items.forEach((item) => {
      const category = item.furnitureId.category;
      categoryCount[category] = (categoryCount[category] || 0) + item.quantity;
    });

    const month = new Date(transaction.createdAt).toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
    monthlySpending[month] = (monthlySpending[month] || 0) + transaction.amount;
  });

  const mostBoughtCategory = Object.entries(categoryCount).reduce(
    (max, [category, count]) =>
      count > (max.count || 0) ? { category, count } : max,
    { category: "", count: 0 }
  );

  const monthlySpendingArray = Object.entries(monthlySpending)
    .map(([month, amount]) => ({
      month,
      amount,
    }))
    .sort((a, b) => {
      const dateA = new Date(a.month);
      const dateB = new Date(b.month);
      return dateA.getTime() - dateB.getTime();
    });

  return {
    totalSpent,
    totalItems,
    mostBoughtCategory,
    monthlySpending: monthlySpendingArray,
  };
}

export function MetricCards({ metrics }: { metrics: DashboardMetrics }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(metrics.totalSpent)}
          </div>
          <p className="text-xs text-muted-foreground">Lifetime spending</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Items</CardTitle>
          <BedDouble className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.totalItems} Items</div>
          <p className="text-xs text-muted-foreground">Total items purchased</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Most Bought Category
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold capitalize">
            {metrics.mostBoughtCategory.category.replace("-", " ")}
          </div>
          <p className="text-xs text-muted-foreground">
            {metrics.mostBoughtCategory.count} items in this category
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export function SpendingChart({
  data,
}: {
  data: DashboardMetrics["monthlySpending"];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Spending</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={70}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => formatCurrency(value)}
              />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ fill: "#2563eb" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function TransactionHistory({
  transactions,
}: {
  transactions: Transaction[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
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
            {transactions.map((transaction) => (
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
      </CardContent>
    </Card>
  );
}
