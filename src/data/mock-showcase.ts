import type { ShowcaseWork } from "@/types"

const p = (folder: string, name: string, ...nums: number[]) =>
  nums.map((n) => `/products/${folder}/${name}-${String(n).padStart(2, "0")}.jpeg`)

/** Trabajos de ejemplo para la galería "Personalizados". Se reemplazan desde /admin/trabajos. */
export const showcaseWorks: ShowcaseWork[] = [
  {
    id: "sw-mj-coleccion",
    title: "Colección Michael Jackson",
    description: "Cuatro looks icónicos, cada uno con su vestuario cosido a mano.",
    type: "muneco",
    images: p("peluches", "peluche-michael-jackson-coleccion", 1, 2, 3, 4),
    published: true,
    createdAt: "2026-10-10T12:00:00.000Z",
  },
  {
    id: "sw-chapulin",
    title: "Chapulín Colorado",
    description: "Con antenitas y chipote chillón incluidos.",
    type: "muneco",
    images: p("peluches", "peluche-chapulin-colorado", 1, 2, 3),
    published: true,
    createdAt: "2026-10-05T12:00:00.000Z",
  },
  {
    id: "sw-cerati-grupo",
    title: "Gustavo Cerati en tres épocas",
    description: null,
    type: "muneco",
    images: p("peluches", "peluche-gustavo-cerati-grupo", 1, 2),
    published: true,
    createdAt: "2026-09-28T12:00:00.000Z",
  },
  {
    id: "sw-remera-diego-copa",
    title: "Remera Diego campeón",
    description: "Estampado DTF a todo color sobre remera negra.",
    type: "remera",
    images: ["/products/remeras/Remeras-mod-3.jpeg"],
    published: true,
    createdAt: "2026-09-20T12:00:00.000Z",
  },
  {
    id: "sw-remera-diego-telefono",
    title: "Remera Diego al teléfono",
    description: null,
    type: "remera",
    images: ["/products/remeras/Remeras-mod-2.jpeg"],
    published: true,
    createdAt: "2026-09-15T12:00:00.000Z",
  },
  {
    id: "sw-llavero-skzoo",
    title: "Llavero conejito SKZOO",
    description: "Mini versión acolchada para colgar en la mochila.",
    type: "llavero",
    images: p("llaveros", "llavero-skzoo-conejito", 1, 2, 3),
    published: true,
    createdAt: "2026-09-10T12:00:00.000Z",
  },
  {
    id: "sw-llavero-colapinto",
    title: "Llavero Franco Colapinto",
    description: null,
    type: "llavero",
    images: p("llaveros", "llavero-franco-colapinto", 1, 2),
    published: true,
    createdAt: "2026-09-02T12:00:00.000Z",
  },
  {
    id: "sw-almohadon-michi",
    title: "Almohadón de michi",
    description: "Con la forma y los colores de la gata de la familia.",
    type: "almohadon",
    images: ["/products/almohadones/almohadones-gato2.jpeg", "/products/almohadones/almohadones-gato.jpeg"],
    published: true,
    createdAt: "2026-08-25T12:00:00.000Z",
  },
]
