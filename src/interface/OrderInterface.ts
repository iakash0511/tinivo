export interface Order {
  _id?: string
  orderId: string
  customerName?: string
  shippingStatus?: 'delivered' | 'shipped' | 'packed' | string
  total?: number
  email?: string
  phone?: string
  trackingUrl?: string
  // include other fields if needed
}
