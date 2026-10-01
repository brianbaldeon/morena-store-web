import type { Brand, Category, ColorOption, Product, ProductType, ProductVariant } from "@/types"
import { COLORS } from "@/lib/constants"

// ─── Imágenes ──────────────────────────────────────────────────

const unsplash = (id: string) => `https://images.unsplash.com/${id}?w=900&h=1200&fit=crop&q=80`

export const IMG = {
  potro: "/products/peluches/Peluches1.jpeg",
  showman: "/products/peluches/Peluches2.jpeg",
  f1: "/products/peluches/Peluches3.jpeg",
  f1Duo: "/products/peluches/Peluches4.jpeg",
  michi: "/products/almohadones/almohadones-gato2.jpeg",
  michiFront: "/products/almohadones/almohadones.jpeg",
  michiBack: "/products/almohadones/almohadones-gato.jpeg",
  diegoBrindis: "/products/remeras/Remeras-mod-1.jpeg",
  diegoTelefono: "/products/remeras/Remeras-mod-2.jpeg",
  diegoCopa: "/products/remeras/Remeras-mod-3.jpeg",
  teeWhite: unsplash("photo-1521572163474-6864f9cf17ab"),
  teeBlack: unsplash("photo-1583743814966-8936f5b7be1a"),
  teeBlackHanger: unsplash("photo-1618354691373-d851c5c3a990"),
  teeManeki: unsplash("photo-1576566588028-4147f3842f27"),
  teeSkeleton: unsplash("photo-1503341504253-dff4815485f1"),
  teeStack: unsplash("photo-1562157873-818bc0726f68"),
  hoodieGrey: unsplash("photo-1556821840-3a63f95609a7"),
  hoodieGirl: unsplash("photo-1517841905240-472988babdf9"),
  sweatWhite: unsplash("photo-1620799140408-edc6dcb6d633"),
  robot: unsplash("photo-1563396983906-b3795482a59a"),
  starWars: unsplash("photo-1608889825103-eb5ed706fc64"),
  batman: unsplash("photo-1559715541-5daf8a0296d0"),
} as const

// ─── Categorías ────────────────────────────────────────────────

export const categories: Category[] = [
  {
    id: "cat-munecos",
    name: "Muñecos",
    slug: "munecos",
    description: "Muñecos de tela cosidos a mano de tus artistas y personajes favoritos.",
    image: IMG.potro,
    productType: "MUNECO",
  },
  {
    id: "cat-llaveros",
    name: "Llaveros",
    slug: "llaveros",
    description: "Mini muñecos acolchados para llevar a todos lados.",
    image: IMG.f1Duo,
    productType: "LLAVERO",
  },
  {
    id: "cat-remeras",
    name: "Remeras",
    slug: "remeras",
    description: "Remeras de algodón peinado con estampado DTF.",
    image: IMG.diegoCopa,
    productType: "REMERA",
  },
  {
    id: "cat-buzos",
    name: "Buzos",
    slug: "buzos",
    description: "Buzos de frisa con estampado DTF.",
    image: IMG.hoodieGrey,
    productType: "BUZO",
  },
  {
    id: "cat-almohadones",
    name: "Almohadones",
    slug: "almohadones",
    description: "Almohadones con la forma de tu mascota.",
    image: IMG.michi,
    productType: "OTRO",
  },
]

// ─── Marcas (artistas y personajes) ────────────────────────────

export const brands: Brand[] = [
  { id: "br-maradona", name: "Diego Maradona", slug: "diego-maradona", avatar: IMG.diegoCopa, kind: "ARTISTA" },
  { id: "br-potro", name: "Rodrigo \"El Potro\"", slug: "rodrigo-el-potro", avatar: IMG.potro, kind: "ARTISTA" },
  { id: "br-f1", name: "Fórmula 1", slug: "formula-1", avatar: IMG.f1, kind: "PERSONAJE" },
  { id: "br-starwars", name: "Star Wars", slug: "star-wars", avatar: IMG.starWars, kind: "PERSONAJE" },
  { id: "br-batman", name: "Batman", slug: "batman", avatar: IMG.batman, kind: "PERSONAJE" },
  { id: "br-michi", name: "Michi Morena", slug: "michi-morena", avatar: IMG.michi, kind: "PERSONAJE" },
  { id: "br-morena", name: "Diseños Morena", slug: "disenos-morena", avatar: IMG.teeManeki, kind: "PERSONAJE" },
]

// ─── Productos ─────────────────────────────────────────────────

const APPAREL_SIZES = ["XS", "S", "M", "L", "XL", "XXL"]
const color = (name: string): ColorOption => COLORS.find((c) => c.name === name) ?? COLORS[0]

interface Seed {
  name: string
  type: ProductType
  category: string
  brand: string | null
  price: number
  compareAt?: number
  images: string[]
  stock: number
  sizes?: string[]
  colors?: string[]
  isNew?: boolean
  isFeatured?: boolean
  isCustomizable?: boolean
  sales: number
  daysAgo: number
  description: string
}

function buildVariants(slug: string, sizes: string[], colors: ColorOption[], stock: number): ProductVariant[] {
  if (sizes.length === 0 && colors.length === 0) return []
  const sizeList = sizes.length ? sizes : [null]
  const colorList = colors.length ? colors.map((c) => c.name) : [null]
  const combos = sizeList.flatMap((size) => colorList.map((c) => ({ size, color: c })))
  const perVariant = Math.max(1, Math.floor(stock / combos.length))
  return combos.map((combo, i) => ({
    id: `${slug}-v${i}`,
    sku: `${slug}-${combo.size ?? "u"}-${combo.color ?? "u"}`.toUpperCase(),
    size: combo.size,
    color: combo.color,
    stock: perVariant,
  }))
}

const seeds: Seed[] = [
  // Muñecos
  {
    name: "Muñeco Rodrigo \"El Potro\"",
    type: "MUNECO",
    category: "cat-munecos",
    brand: "br-potro",
    price: 28000,
    images: [IMG.potro, IMG.showman],
    stock: 12,
    isNew: true,
    isFeatured: true,
    sales: 184,
    daysAgo: 3,
    description:
      "Muñeco de tela de 35 cm con el short de boxeo de \"El Potro\". Estampado en sublimación, relleno siliconado y cordón para colgar.",
  },
  {
    name: "Muñeco piloto F1",
    type: "MUNECO",
    category: "cat-munecos",
    brand: "br-f1",
    price: 29500,
    images: [IMG.f1, IMG.f1Duo],
    stock: 8,
    isNew: true,
    isFeatured: true,
    sales: 231,
    daysAgo: 1,
    description: "Muñeco de 35 cm con mono de carrera. Frente y espalda estampados, ideal para fanáticos de la Fórmula 1.",
  },
  {
    name: "Muñeco personalizado de tu persona favorita",
    type: "MUNECO",
    category: "cat-munecos",
    brand: null,
    price: 32000,
    images: [IMG.showman, IMG.potro],
    stock: 50,
    isCustomizable: true,
    isFeatured: true,
    sales: 312,
    daysAgo: 40,
    description:
      "Mandanos fotos de vos, tu pareja o tu amigo y armamos un muñeco único con su cara, ropa y accesorios.",
  },
  {
    name: "Set muñequitos galácticos",
    type: "MUNECO",
    category: "cat-munecos",
    brand: "br-starwars",
    price: 36000,
    compareAt: 42000,
    images: [IMG.starWars],
    stock: 5,
    sales: 64,
    daysAgo: 20,
    description: "Set de tres muñequitos de 15 cm inspirados en la saga galáctica.",
  },
  {
    name: "Muñeco robot retro",
    type: "MUNECO",
    category: "cat-munecos",
    brand: "br-morena",
    price: 22000,
    images: [IMG.robot],
    stock: 14,
    sales: 41,
    daysAgo: 55,
    description: "Robot de tela con detalles bordados, inspirado en los juguetes de lata de los 50.",
  },
  {
    name: "Patito vigilante",
    type: "MUNECO",
    category: "cat-munecos",
    brand: "br-batman",
    price: 15500,
    images: [IMG.batman],
    stock: 30,
    sales: 58,
    daysAgo: 70,
    description: "Patito con máscara de murciélago. Protege tu escritorio de noche.",
  },

  // Llaveros
  {
    name: "Llavero mini Potro",
    type: "LLAVERO",
    category: "cat-llaveros",
    brand: "br-potro",
    price: 6500,
    images: [IMG.potro],
    stock: 40,
    isNew: true,
    sales: 402,
    daysAgo: 2,
    description: "Versión llavero de 10 cm, acolchada y con argolla metálica.",
  },
  {
    name: "Llavero piloto F1",
    type: "LLAVERO",
    category: "cat-llaveros",
    brand: "br-f1",
    price: 6500,
    images: [IMG.f1Duo, IMG.f1],
    stock: 9,
    isNew: true,
    sales: 380,
    daysAgo: 4,
    description: "Llavero de 10 cm con frente y espalda estampados.",
  },
  {
    name: "Llavero Michi",
    type: "LLAVERO",
    category: "cat-llaveros",
    brand: "br-michi",
    price: 5800,
    images: [IMG.michi],
    stock: 60,
    sales: 220,
    daysAgo: 25,
    description: "El gatito de la suerte de Morena, en llavero.",
  },
  {
    name: "Llavero personalizado",
    type: "LLAVERO",
    category: "cat-llaveros",
    brand: null,
    price: 6500,
    images: [IMG.michiFront, IMG.f1Duo],
    stock: 100,
    isCustomizable: true,
    sales: 510,
    daysAgo: 45,
    description: "Tu mascota, tu ídolo o tu cara en un llavero de tela acolchado.",
  },
  {
    name: "Llavero patito vigilante",
    type: "LLAVERO",
    category: "cat-llaveros",
    brand: "br-batman",
    price: 5500,
    images: [IMG.batman],
    stock: 11,
    sales: 75,
    daysAgo: 60,
    description: "Mini patito con antifaz, con argolla.",
  },

  // Remeras
  {
    name: "Remera Diego brindis",
    type: "REMERA",
    category: "cat-remeras",
    brand: "br-maradona",
    price: 18500,
    images: [IMG.diegoBrindis, IMG.diegoTelefono],
    stock: 12,
    sizes: APPAREL_SIZES,
    colors: ["Negro"],
    isNew: true,
    isFeatured: true,
    sales: 290,
    daysAgo: 2,
    description: "Remera negra de algodón peinado 24/1 con estampado DTF de alta definición.",
  },
  {
    name: "Remera Diego teléfono",
    type: "REMERA",
    category: "cat-remeras",
    brand: "br-maradona",
    price: 18500,
    images: [IMG.diegoTelefono, IMG.diegoBrindis],
    stock: 12,
    sizes: APPAREL_SIZES,
    colors: ["Negro", "Blanco"],
    isNew: true,
    sales: 198,
    daysAgo: 5,
    description: "Remera de algodón peinado con el Diego más ochentoso.",
  },
  {
    name: "Remera Diego campeón",
    type: "REMERA",
    category: "cat-remeras",
    brand: "br-maradona",
    price: 18500,
    compareAt: 22000,
    images: [IMG.diegoCopa, IMG.diegoTelefono],
    stock: 12,
    sizes: APPAREL_SIZES,
    colors: ["Negro"],
    isFeatured: true,
    sales: 350,
    daysAgo: 12,
    description: "La foto más linda del mundo, estampada en DTF.",
  },
  {
    name: "Remera Maneki original",
    type: "REMERA",
    category: "cat-remeras",
    brand: "br-michi",
    price: 17500,
    images: [IMG.teeManeki],
    stock: 25,
    sizes: APPAREL_SIZES,
    colors: ["Blanco"],
    isNew: true,
    sales: 160,
    daysAgo: 6,
    description: "El gatito de la suerte en estampa retro.",
  },
  {
    name: "Remera hueso peace",
    type: "REMERA",
    category: "cat-remeras",
    brand: "br-morena",
    price: 16500,
    images: [IMG.teeSkeleton],
    stock: 18,
    sizes: APPAREL_SIZES,
    colors: ["Negro"],
    sales: 88,
    daysAgo: 35,
    description: "Remera negra con mano de esqueleto haciendo la V.",
  },
  {
    name: "Remera personalizada DTF",
    type: "REMERA",
    category: "cat-remeras",
    brand: null,
    price: 18500,
    images: [IMG.teeWhite, IMG.teeBlackHanger],
    stock: 200,
    sizes: APPAREL_SIZES,
    colors: ["Blanco", "Negro", "Gris", "Azul"],
    isCustomizable: true,
    isFeatured: true,
    sales: 620,
    daysAgo: 90,
    description: "Subí tu diseño y lo estampamos en DTF sobre la remera que elijas.",
  },
  {
    name: "Remera básica negra",
    type: "REMERA",
    category: "cat-remeras",
    brand: "br-morena",
    price: 12000,
    images: [IMG.teeBlack, IMG.teeBlackHanger],
    stock: 40,
    sizes: APPAREL_SIZES,
    colors: ["Negro"],
    sales: 140,
    daysAgo: 80,
    description: "Remera lisa de algodón peinado, lista para combinar.",
  },
  {
    name: "Remera Potro boxeo",
    type: "REMERA",
    category: "cat-remeras",
    brand: "br-potro",
    price: 18500,
    images: [IMG.teeBlackHanger, IMG.potro],
    stock: 7,
    sizes: APPAREL_SIZES,
    colors: ["Negro", "Blanco"],
    sales: 95,
    daysAgo: 15,
    description: "Remera con la estampa del short de boxeo más famoso del cuarteto.",
  },
  {
    name: "Remera colores lisos",
    type: "REMERA",
    category: "cat-remeras",
    brand: "br-morena",
    price: 12000,
    images: [IMG.teeStack],
    stock: 60,
    sizes: APPAREL_SIZES,
    colors: ["Rojo", "Negro", "Blanco", "Azul", "Amarillo"],
    sales: 110,
    daysAgo: 100,
    description: "Remera lisa en cinco colores.",
  },

  // Buzos
  {
    name: "Buzo canguro gris",
    type: "BUZO",
    category: "cat-buzos",
    brand: "br-morena",
    price: 34000,
    images: [IMG.hoodieGrey, IMG.hoodieGirl],
    stock: 12,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Gris"],
    isNew: true,
    sales: 120,
    daysAgo: 4,
    description: "Buzo de frisa con capucha y bolsillo canguro.",
  },
  {
    name: "Buzo personalizado DTF",
    type: "BUZO",
    category: "cat-buzos",
    brand: null,
    price: 34000,
    images: [IMG.sweatWhite, IMG.hoodieGrey],
    stock: 120,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Blanco", "Negro", "Gris", "Azul"],
    isCustomizable: true,
    sales: 260,
    daysAgo: 60,
    description: "Tu diseño en DTF sobre un buzo de frisa.",
  },
  {
    name: "Buzo Diego campeón",
    type: "BUZO",
    category: "cat-buzos",
    brand: "br-maradona",
    price: 38000,
    compareAt: 44000,
    images: [IMG.hoodieGirl, IMG.diegoCopa],
    stock: 10,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Gris", "Negro"],
    sales: 77,
    daysAgo: 18,
    description: "Buzo con capucha con la estampa del 86 en la espalda.",
  },
  {
    name: "Buzo Michi blanco",
    type: "BUZO",
    category: "cat-buzos",
    brand: "br-michi",
    price: 32000,
    images: [IMG.sweatWhite],
    stock: 15,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Blanco"],
    isNew: true,
    sales: 66,
    daysAgo: 8,
    description: "Buzo cuello redondo con el Michi bordado en el pecho.",
  },

  // Almohadones
  {
    name: "Almohadón de tu mascota",
    type: "OTRO",
    category: "cat-almohadones",
    brand: null,
    price: 24000,
    images: [IMG.michi, IMG.michiFront, IMG.michiBack],
    stock: 80,
    isCustomizable: true,
    isFeatured: true,
    sales: 410,
    daysAgo: 50,
    description: "Mandanos una foto de tu mascota y la convertimos en un almohadón con su forma.",
  },
  {
    name: "Almohadón Michi atigrado",
    type: "OTRO",
    category: "cat-almohadones",
    brand: "br-michi",
    price: 21000,
    images: [IMG.michiFront, IMG.michiBack],
    stock: 6,
    isNew: true,
    sales: 99,
    daysAgo: 7,
    description: "Almohadón con forma de gato atigrado, estampado de los dos lados.",
  },
]

const NOW = new Date("2026-10-01T12:00:00-03:00").getTime()
const DAY = 24 * 60 * 60 * 1000

function slugOf(name: string) {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
}

export const products: Product[] = seeds.map((seed, i) => {
  const slug = slugOf(seed.name)
  const colors = (seed.colors ?? []).map(color)
  const sizes = seed.sizes ?? []
  return {
    id: `prod-${String(i + 1).padStart(3, "0")}`,
    name: seed.name,
    slug,
    description: seed.description,
    price: seed.price,
    compareAtPrice: seed.compareAt ?? null,
    images: seed.images,
    categoryId: seed.category,
    brandId: seed.brand,
    productType: seed.type,
    sizes,
    colors,
    variants: buildVariants(slug, sizes, colors, seed.stock),
    stock: seed.stock,
    isNew: seed.isNew ?? false,
    isFeatured: seed.isFeatured ?? false,
    isCustomizable: seed.isCustomizable ?? false,
    rating: 4.5 + ((i * 7) % 5) / 10,
    sales: seed.sales,
    createdAt: new Date(NOW - seed.daysAgo * DAY).toISOString(),
  }
})
