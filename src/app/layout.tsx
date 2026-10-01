import type { Metadata } from "next"
import { Outfit } from "next/font/google"
import { ThemeProvider } from "@/providers/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "Store Morena · Hecho a mano para vos",
    template: "%s · Store Morena",
  },
  description:
    "Muñecos de tus artistas favoritos, llaveros, remeras y buzos con estampado DTF, y muñecos personalizados hechos a mano.",
  icons: { icon: "/brand/favicon.svg" },
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-AR" className={`${outfit.variable} h-full`} suppressHydrationWarning>
      <body className="flex min-h-full flex-col font-sans">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster position="bottom-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
