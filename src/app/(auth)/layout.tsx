import Image from "next/image"
import { Logo } from "@/components/brand/logo"
import { LuckyCat } from "@/components/brand/lucky-cat"
import { IMG } from "@/data/mock-products"

export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="grid min-h-svh flex-1 lg:grid-cols-2">
      <div className="flex flex-col px-4 py-6 sm:px-8">
        <Logo />
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm">{children}</div>
        </div>
        <p className="text-center text-xs text-muted-foreground">© 2026 Store Morena</p>
      </div>
      <aside className="relative hidden overflow-hidden bg-muted lg:block">
        <Image src={IMG.diegoTelefono} alt="" fill priority sizes="50vw" className="object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-[oklch(0.25_0.03_255/0.85)] via-transparent to-transparent" />
        <div className="absolute inset-x-10 bottom-10 flex items-end gap-4 text-white">
          <div className="size-16 shrink-0 rounded-xl bg-white/15 p-1 backdrop-blur">
            <LuckyCat />
          </div>
          <div>
            <p className="text-3xl leading-tight font-light">Hecho a mano para vos</p>
            <p className="mt-1 text-sm opacity-80">Muñecos, llaveros y prendas con tu estampa.</p>
          </div>
        </div>
      </aside>
    </div>
  )
}
