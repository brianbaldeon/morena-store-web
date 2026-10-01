import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { CartSheet } from "@/components/cart/cart-sheet"
import { getSettings } from "@/lib/services/account"

export default async function StoreLayout({ children }: LayoutProps<"/">) {
  const settings = await getSettings()
  return (
    <>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <CartSheet shippingCost={settings.shippingCost} freeShippingFrom={settings.freeShippingFrom} />
    </>
  )
}
