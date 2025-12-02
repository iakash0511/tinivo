export interface BestSellerItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  tag?: string;
  description: string;
  slug: string;
  compareAtPrice?: number;
  quantity?: number;
}