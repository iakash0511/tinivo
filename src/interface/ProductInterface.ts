export interface Product {
  _id: string;
  name: string;
  slug: string;
  image: string;
  images: string[];
  category: string;
  brand: string;
  tags?: string[];
  stock: number;
  shipping: string;
  care: string;
  price: number;
  salePrice?: number;
  rating?: number;
  numReviews?: number;
  description: string;
  quantity: number;
  giftWrap: boolean;
  compareAtPrice?: number;
}