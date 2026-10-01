import { defineConfig } from "prisma/config"

// Prisma 7: la URL de la base va acá (no en schema.prisma).
// Etapa 2: definir DATABASE_URL en .env (ver .env.example).
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: {
    url: process.env.DATABASE_URL ?? "postgresql://morena:morena@localhost:5432/morena_store",
  },
})
