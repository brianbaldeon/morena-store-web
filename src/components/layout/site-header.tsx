import Link from "next/link"
import { Sparkles } from "lucide-react"
import { Logo } from "@/components/brand/logo"
import { listProducts } from "@/lib/services/catalog"
import { SearchCommand } from "./search-command"
import { CartButton, FavoritesButton } from "./header-actions"
import { UserMenu } from "./user-menu"
import { ThemeToggle } from "./theme-toggle"
import { MobileNav } from "./mobile-nav"
import { MainNav } from "./main-nav"

export async function SiteHeader() {
  const products = await listProducts()
  const searchItems = products.map((p) => ({
    slug: p.slug,
    name: p.name,
    image: p.images[0],
    price: p.price,
    brand: p.brand?.name ?? null,
  }))

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 lg:gap-6 lg:px-6">
        <MobileNav />
        <Logo className="shrink-0" />
        <SearchCommand items={searchItems} className="mx-auto hidden max-w-xl md:block" />
        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <CartButton />
          <FavoritesButton />
          <Link
            href="/personalizar"
            className="mx-1 hidden items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors hover:border-primary hover:text-primary lg:flex"
          >
            <Sparkles className="size-4 text-primary" /> Personalizá
          </Link>
          <ThemeToggle className="hidden sm:flex" />
          <UserMenu />
        </div>
      </div>
      <div className="px-4 pb-3 md:hidden">
        <SearchCommand items={searchItems} />
      </div>
      <MainNav />
    </header>
  )
}
