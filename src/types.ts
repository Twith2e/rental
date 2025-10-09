export type RegisterationResponse = {
  success: boolean;
  message: string;
  token: string;
};

export type User = {
  email: string;
  name: string;
};

export type ProfileResponse = {
  success: boolean;
  data: User;
};

export type Furniture = {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  quantity: number;
  imageUrl: string;
};
