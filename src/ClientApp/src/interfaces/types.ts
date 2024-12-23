export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
}

export interface OrderProduct {
  id: number;
  name: string;
  price: number;
}

export interface Order {
  id: number;
  productId: number;
  quantity: number;
  total: number;
  date: string;
  product?: OrderProduct;
}

export interface OrderResponse {
  id: number;
  productId: number;
  quantity: number;
  total: number;
  date: string;
  product?: Product;
}

export interface CreateOrderDTO {
  productId: number;
  quantity: number;
}