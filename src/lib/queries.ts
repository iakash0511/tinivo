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
    isBestseller
  }
`
export const getBestSellers = `
    *[_type == "product" && isBestseller == true] | order(_createdAt desc) {
    _id,
    name,
    price,
    "slug": slug.current,
    "image": images[0].asset->url,
    description,
  }
`

export const getAllProducts = `
  *[_type == "product"] | order(_createdAt desc) {
    _id,
    name,
    price,
    "slug": slug.current,
    "image": images[0].asset->url,
    category,
    isBestseller
  }
`