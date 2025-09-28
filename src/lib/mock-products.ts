// lib/mock-products.ts
export const mockProducts = [
  {
    id: '1',
    name: 'Mini Panda Mirror',
    price: 399,
    comparePrice: 499,
    image: '/products/panda-mirror.jpg',
    description: 'Cute & handy, perfect for purse or pouch!',
    care: 'Wipe gently with soft cloth',
    shipping: 'Ships in 2–3 days across India',
    isGiftable: true,
  },
  // Add more if needed
];

export const getProductBySlug = (slug: string) => {
  return mockProducts.find((item) => item.id == slug);
};
