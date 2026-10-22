import type { Brand, Category, ColorOption, ProductWithRelations } from "@/types"

let seq = 0

const CATEGORY_MUNECOS: Category = {
  id: "cat-munecos",
  name: "Muñecos",
  slug: "munecos",
  description: "",
  image: "/img.jpg",
  productType: "MUNECO",
}

const CATEGORY_REMERAS: Category = {
  id: "cat-remeras",
  name: "Remeras",
  slug: "remeras",
  description: "",
  image: "/img.jpg",
  productType: "REMERA",
}

const BRAND_CERATI: Brand = {
  id: "br-cerati",
  name: "Gustavo Cerati",
  slug: "gustavo-cerati",
  avatar: "/img.jpg",
  kind: "ARTISTA",
}

const BRAND_MICHI: Brand = {
  id: "br-michi",
  name: "Michi Morena",
  slug: "michi-morena",
  avatar: "/img.jpg",
  kind: "PERSONAJE",
}

export const CATEGORIES = { munecos: CATEGORY_MUNECOS, remeras: CATEGORY_REMERAS }
export const BRANDS = { cerati: BRAND_CERATI, michi: BRAND_MICHI }

/** Fábrica de productos de prueba con valores por default razonables, para no repetir boilerplate en cada test. */
export function makeProduct(overrides: Partial<ProductWithRelations> = {}): ProductWithRelations {
  seq += 1
  const category = overrides.category ?? CATEGORY_MUNECOS
  const brand = overrides.brand ?? null
  return {
    id: `prod-${seq}`,
    name: `Producto ${seq}`,
    slug: `producto-${seq}`,
    description: "",
    price: 10000,
    compareAtPrice: null,
    images: ["/img.jpg"],
    categoryId: category.id,
    brandId: brand?.id ?? null,
    productType: category.productType,
    sizes: [],
    colors: [],
    variants: [],
    stock: 10,
    isNew: false,
    isFeatured: false,
    isCustomizable: false,
    rating: 0,
    sales: 0,
    createdAt: "2026-01-01T00:00:00.000Z",
    category,
    brand,
    ...overrides,
  }
}

export function makeColor(name: string, hex = "#000000"): ColorOption {
  return { name, hex }
}
