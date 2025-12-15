export type Category = 'packs' | 'fresh' | 'pantry';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  isPromo?: boolean;
  stock: number;
  featured?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

// Changed to string to support the numeric IDs and custom codes from the new data
export type ShippingZone = string;

export interface UserData {
  name: string;
  address: string;
  zone: ShippingZone;
  isBenavidezUser: boolean;
}

declare global {
  interface Window {
    fbq: any;
  }
}