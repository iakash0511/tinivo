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