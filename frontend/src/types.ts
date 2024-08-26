
export interface CartItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
}

export interface ShippingInfo {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface PaymentInfo {
  method: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
}

export interface OrderReview {
  items: CartItem[];
  total: number;
}

export interface Order {
  totalPrice: any;
  _id: string;
  items: CartItem[];
  total: number;
  shippingInfo: ShippingInfo;
  paymentInfo: PaymentInfo;
  status: string;
  createdAt: string;
}

export interface Product {
  category: string;
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  reviews: Review[];
}

export interface Review {
  _id: string;
  rating: number;
  comment: string;
  user: {
    _id: string;
    name: string;
  };
}

export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
}
