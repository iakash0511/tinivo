export interface Order {
  _id?: string
  orderId: string
  customerName?: string
  shippingStatus?: 'delivered' | 'shipped' | 'packed' | string
  total?: number
  email?: string
  phone?: string
  trackingUrl?: string
  address?: string
  city?: string
  pincode?: string
  items?: Array<{
    name: string
    quantity: number
  }>
  paymentMethod?: 'prepaid' | 'cod' | 'partial_cod'
  paymentStatus?: 'paid' | 'cod'
  prepaidAmount?: number
  codAmount?: number
  createdAt?: string
  updatedAt?: string
  // include other fields if needed
}
