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
  tags?: string;
  weight?: number;
  length?: number;
  breadth?:number;
  height?: number;
}