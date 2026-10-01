import type { Metadata } from "next"
import { LoginForm } from "@/components/auth/login-form"
import { safeNext } from "@/lib/safe-redirect"

export const metadata: Metadata = { title: "Ingresar" }

export default async function LoginPage(props: PageProps<"/login">) {
  const { next } = await props.searchParams
  return <LoginForm next={safeNext(next)} />
}
