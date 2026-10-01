"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Lock, ShoppingBag } from "lucide-react"
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { api } from "@/lib/api-client"
import { loginSchema, type LoginInput } from "@/lib/validations/auth"
import { useSessionStore } from "@/store/session"
import { mockUser } from "@/data/mock-user"
import { GoogleButton } from "./google-button"

export function LoginForm({ next }: { next: string }) {
  const router = useRouter()
  const signIn = useSessionStore((s) => s.signIn)
  const fromCheckout = next.startsWith("/checkout")

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  async function onSubmit(values: LoginInput) {
    try {
      const { user } = await api.auth.login(values)
      signIn(user)
      toast.success(`¡Hola, ${user.name.split(" ")[0]}!`)
      router.replace(next)
    } catch {
      toast.error("No pudimos iniciar sesión. Probá de nuevo.")
    }
  }

  function signInWithGoogle() {
    signIn(mockUser)
    toast.success(`¡Hola, ${mockUser.name.split(" ")[0]}!`)
    router.replace(next)
  }

  return (
    <div className="space-y-6">
      {fromCheckout && (
        <Alert className="border-primary/30 bg-primary/5">
          <ShoppingBag className="text-primary!" />
          <AlertTitle>Ingresá para finalizar tu compra</AlertTitle>
          <AlertDescription>Tu carrito queda guardado. Después te llevamos al pago con Mercado Pago.</AlertDescription>
        </Alert>
      )}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Ingresá a tu cuenta</h1>
        <p className="mt-1 text-sm text-muted-foreground">Usá tu email o tu cuenta de Google.</p>
      </div>

      <GoogleButton onClick={signInWithGoogle} disabled={form.formState.isSubmitting} />

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <Separator className="flex-1" /> o con tu email <Separator className="flex-1" />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" autoComplete="email" placeholder="vos@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Contraseña</FormLabel>
                  <button
                    type="button"
                    className="text-xs text-primary hover:underline"
                    onClick={() => toast.info("En la próxima etapa vas a poder recuperar tu contraseña por email.")}
                  >
                    ¿La olvidaste?
                  </button>
                </div>
                <FormControl>
                  <Input type="password" autoComplete="current-password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" size="lg" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? <Loader2 className="animate-spin" /> : <Lock />}
            {fromCheckout ? "Ingresar y continuar al pago" : "Ingresar"}
          </Button>
        </form>
      </Form>

      <p className="text-center text-sm text-muted-foreground">
        ¿No tenés cuenta?{" "}
        <Link href={`/registro?next=${encodeURIComponent(next)}`} className="font-medium text-primary hover:underline">
          Creá una
        </Link>
      </p>
      <p className="text-center text-xs text-muted-foreground">
        Modo demo: cualquier email y contraseña de 6+ caracteres inician sesión.
      </p>
    </div>
  )
}
