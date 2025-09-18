import api from "@/api";

interface PaymentRequest {
  userId: string;
  items: {
    furnitureId: string;
    quantity: number;
  }[];
  paymentMethod: string;
}

export async function processFurniturePayment(furniture: {
  id: string;
  price: number;
}) {
  try {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const paymentRequest: PaymentRequest = {
      userId: "user-123", // Hardcoded for simulation
      items: [
        {
          furnitureId: furniture.id,
          quantity: 1,
        },
      ],
      paymentMethod: "credit_card", // Hardcoded for simulation
    };

    const response = await api.post(
      "/furniture/payment/process",
      paymentRequest
    );
    return response.data;
  } catch (error) {
    throw new Error("Payment failed. Please try again later.");
  }
}
