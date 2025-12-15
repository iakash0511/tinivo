declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackViewContent(product: {
  id: string;
  name: string;
  price: number;
}) {
  window.fbq?.('track', 'ViewContent', {
    content_ids: [product.id],
    content_name: product.name,
    value: product.price,
    currency: 'INR',
  });
}

export function trackAddToCart(product: {
  id: string;
  name: string;
  price: number;
}) {
  window.fbq?.('track', 'AddToCart', {
    content_ids: [product.id],
    content_name: product.name,
    value: product.price,
    currency: 'INR',
  });
}

export function trackPurchase(orderId: string, value: number) {
  window.fbq?.('track', 'Purchase', {
    content_ids: [orderId],
    value,
    currency: 'INR',
  });
}
