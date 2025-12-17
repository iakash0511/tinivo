export const productBySlugQuery = `
  *[_type == "product" && slug.current == $slug][0]{
    _id,
    name,
    price,
    description,
    category,
    "images": images[].asset->url,
    shipping,
    care,
    isBestseller,
    compareAtPrice,
    quantity,
    tags,
    weight,
    length,
    breadth,
    height,
  }
`
export const getBestSellers = `
    *[_type == "product" && isBestseller == true] | order(_createdAt desc)[0..4] {
    _id,
    name,
    price,
    "slug": slug.current,
    compareAtPrice,
    quantity,
    "image": images[0].asset->url,
    description,
    tags,
    weight,
    length,
    breadth,
    height,
  }
`
export const getProductsUnderAmount = `
  *[_type == "product" && price <= $amount] | order(_createdAt desc)[0..8] {
    _id,
    name,
    price,
    "slug": slug.current,
    compareAtPrice,
    quantity,
    "image": images[0].asset->url,
    description,
    tags,
    weight,
    length,
    breadth,
    height,
  }
`

export const getCombos = `
  *[_type == "product" && category == "combo"] | order(_createdAt desc)[0..4] {
    _id,
    name,
    price,
    "slug": slug.current,
    compareAtPrice,
    quantity,
    "image": images[0].asset->url,
    description,
    tags,
    weight,
    length,
    breadth,
    height,
  }
`

export const getFeaturedProducts = `
    *[_type == "product" && isFeatured == true] | order(_createdAt desc)[0..4] {
    _id,
    name,
    price,
    "slug": slug.current,
    compareAtPrice,
    quantity,
    "image": images[0].asset->url,
    description,
    tags,
    weight,
    length,
    breadth,
    height,
  }
`

export const getAllProducts = `
  *[_type == "product"] | order(_createdAt desc) {
    _id,
    name,
    price,
    "slug": slug.current,
    compareAtPrice,
    quantity,
    "image": images[0].asset->url,
    category,
    isBestseller,
    tags,
  }
`