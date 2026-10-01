import "server-only"
import type { Brand, Category, Product, ProductWithRelations } from "@/types"
import { brands as seedBrands, categories as seedCategories, products as seedProducts } from "@/data/mock-products"
import { slugify } from "@/lib/utils"
import { COLORS, SIZES } from "@/lib/constants"
import type { BrandInput, CategoryInput, ProductInput } from "@/lib/validations/admin"

// Etapa 1: copias en memoria de los datos de prueba (se reinician al reiniciar el server).
// Se guardan en globalThis para que Route Handlers y Server Components compartan el mismo estado.
// Etapa 2: reemplazar el cuerpo de cada función por consultas de Prisma.
const globalForDb = globalThis as unknown as {
  catalogDb?: { products: Product[]; categories: Category[]; brands: Brand[] }
}
const db = (globalForDb.catalogDb ??= {
  products: [...seedProducts],
  categories: [...seedCategories],
  brands: [...seedBrands],
})

/** Talles y colores disponibles se derivan de las variantes cargadas en el admin. */
function deriveOptions(variants: ProductInput["variants"]) {
  const sizes = SIZES.filter((size) => variants.some((v) => v.size === size))
  const colors = COLORS.filter((color) => variants.some((v) => v.color === color.name))
  return { sizes: [...sizes], colors }
}

function withRelations(product: Product): ProductWithRelations {
  return {
    ...product,
    category: db.categories.find((c) => c.id === product.categoryId) ?? db.categories[0],
    brand: db.brands.find((b) => b.id === product.brandId) ?? null,
  }
}

// ─── Productos ─────────────────────────────────────────────────

export async function listProducts(params: { category?: string; q?: string; ids?: string[] } = {}) {
  let list = db.products
  if (params.category) {
    const category = db.categories.find((c) => c.slug === params.category)
    list = category ? list.filter((p) => p.categoryId === category.id) : []
  }
  if (params.ids) list = list.filter((p) => params.ids!.includes(p.id))
  if (params.q) {
    const q = params.q.toLowerCase()
    list = list.filter((p) => {
      const brand = db.brands.find((b) => b.id === p.brandId)
      return p.name.toLowerCase().includes(q) || brand?.name.toLowerCase().includes(q)
    })
  }
  return list.map(withRelations)
}

export async function getProductBySlug(slug: string) {
  const product = db.products.find((p) => p.slug === slug)
  return product ? withRelations(product) : null
}

export async function getProductById(id: string) {
  const product = db.products.find((p) => p.id === id)
  return product ? withRelations(product) : null
}

export async function getRelatedProducts(product: Product, limit = 4) {
  return db.products
    .filter((p) => p.id !== product.id && (p.categoryId === product.categoryId || p.brandId === product.brandId))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, limit)
    .map(withRelations)
}

export async function getFeaturedProducts(limit = 8) {
  return db.products.filter((p) => p.isFeatured).slice(0, limit).map(withRelations)
}

export async function getNewProducts(limit = 8) {
  return [...db.products]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit)
    .map(withRelations)
}

export async function createProduct(input: ProductInput) {
  const slug = slugify(input.name)
  const product: Product = {
    id: `prod-${Date.now()}`,
    slug,
    name: input.name,
    description: input.description,
    price: input.price,
    compareAtPrice: input.compareAtPrice ?? null,
    images: input.images,
    categoryId: input.categoryId,
    brandId: input.brandId || null,
    productType: input.productType,
    ...deriveOptions(input.variants),
    variants: input.variants.map((v, i) => ({
      id: `${slug}-v${i}`,
      sku: v.sku,
      size: v.size || null,
      color: v.color || null,
      stock: v.stock,
    })),
    stock: input.variants.length ? input.variants.reduce((acc, v) => acc + v.stock, 0) : input.stock,
    isNew: input.isNew,
    isFeatured: input.isFeatured,
    isCustomizable: input.isCustomizable,
    rating: 5,
    sales: 0,
    createdAt: new Date().toISOString(),
  }
  db.products.unshift(product)
  return withRelations(product)
}

export async function updateProduct(id: string, input: ProductInput) {
  const index = db.products.findIndex((p) => p.id === id)
  if (index === -1) return null
  const current = db.products[index]
  db.products[index] = {
    ...current,
    name: input.name,
    description: input.description,
    price: input.price,
    compareAtPrice: input.compareAtPrice ?? null,
    images: input.images,
    categoryId: input.categoryId,
    brandId: input.brandId || null,
    productType: input.productType,
    ...deriveOptions(input.variants),
    variants: input.variants.map((v, i) => ({
      id: `${current.slug}-v${i}`,
      sku: v.sku,
      size: v.size || null,
      color: v.color || null,
      stock: v.stock,
    })),
    stock: input.variants.length ? input.variants.reduce((acc, v) => acc + v.stock, 0) : input.stock,
    isNew: input.isNew,
    isFeatured: input.isFeatured,
    isCustomizable: input.isCustomizable,
  }
  return withRelations(db.products[index])
}

export async function deleteProduct(id: string) {
  const before = db.products.length
  db.products = db.products.filter((p) => p.id !== id)
  return db.products.length < before
}

// ─── Categorías ────────────────────────────────────────────────

export async function listCategories() {
  return db.categories.map((c) => ({
    ...c,
    productCount: db.products.filter((p) => p.categoryId === c.id).length,
  }))
}

export async function getCategoryBySlug(slug: string) {
  return db.categories.find((c) => c.slug === slug) ?? null
}

export async function getCategoryById(id: string) {
  return db.categories.find((c) => c.id === id) ?? null
}

export async function createCategory(input: CategoryInput) {
  const category: Category = { id: `cat-${Date.now()}`, slug: slugify(input.name), ...input }
  db.categories.push(category)
  return category
}

export async function updateCategory(id: string, input: CategoryInput) {
  const index = db.categories.findIndex((c) => c.id === id)
  if (index === -1) return null
  db.categories[index] = { ...db.categories[index], ...input, slug: slugify(input.name) }
  return db.categories[index]
}

export async function deleteCategory(id: string) {
  const before = db.categories.length
  db.categories = db.categories.filter((c) => c.id !== id)
  return db.categories.length < before
}

// ─── Marcas (artistas / personajes) ────────────────────────────

export async function listBrands() {
  return db.brands.map((b) => ({
    ...b,
    productCount: db.products.filter((p) => p.brandId === b.id).length,
  }))
}

export async function getBrandById(id: string) {
  return db.brands.find((b) => b.id === id) ?? null
}

export async function createBrand(input: BrandInput) {
  const brand: Brand = { id: `br-${Date.now()}`, slug: slugify(input.name), ...input }
  db.brands.push(brand)
  return brand
}

export async function updateBrand(id: string, input: BrandInput) {
  const index = db.brands.findIndex((b) => b.id === id)
  if (index === -1) return null
  db.brands[index] = { ...db.brands[index], ...input, slug: slugify(input.name) }
  return db.brands[index]
}

export async function deleteBrand(id: string) {
  const before = db.brands.length
  db.brands = db.brands.filter((b) => b.id !== id)
  return db.brands.length < before
}
