import type { Metadata } from "next"
import { RegisterForm } from "@/components/auth/register-form"
import { safeNext } from "@/lib/safe-redirect"

export const metadata: Metadata = { title: "Crear cuenta" }

export default async function RegisterPage(props: PageProps<"/registro">) {
  const { next } = await props.searchParams
  return <RegisterForm next={safeNext(next)} />
}
