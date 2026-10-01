import "server-only"
import type { Address, StoreSettings, User } from "@/types"
import { addresses as seedAddresses, mockUser } from "@/data/mock-user"
import { adminUsers, dashboardStats, payments, salesSeries, storeSettings } from "@/data/mock-admin"
import type { AddressInput, ProfileInput } from "@/lib/validations/checkout"
import type { SettingsInput } from "@/lib/validations/admin"
import type { LoginInput, RegisterInput } from "@/lib/validations/auth"

const globalForDb = globalThis as unknown as {
  accountDb?: { user: User; addresses: Address[]; settings: StoreSettings }
}
const db = (globalForDb.accountDb ??= {
  user: { ...mockUser },
  addresses: [...seedAddresses],
  settings: { ...storeSettings },
})

// ─── Auth (simulada) ───────────────────────────────────────────
// Etapa 2: Auth.js. Hoy cualquier email/contraseña válidos inician sesión con el usuario de prueba.

export async function login(input: LoginInput) {
  return { ...db.user, email: input.email }
}

export async function register(input: RegisterInput) {
  return { ...db.user, id: `usr-${Date.now()}`, name: input.name, email: input.email, role: "CUSTOMER" as const }
}

// ─── Perfil y direcciones ──────────────────────────────────────

export async function getProfile() {
  return db.user
}

export async function updateProfile(input: ProfileInput) {
  db.user = { ...db.user, name: input.name, email: input.email, phone: input.phone || null }
  return db.user
}

export async function listAddresses() {
  return db.addresses
}

export async function getAddress(id: string) {
  return db.addresses.find((a) => a.id === id) ?? null
}

export async function createAddress(input: AddressInput) {
  const address: Address = { id: `adr-${Date.now()}`, ...input, apartment: input.apartment || null }
  if (address.isDefault) db.addresses = db.addresses.map((a) => ({ ...a, isDefault: false }))
  db.addresses.push(address)
  return address
}

export async function updateAddress(id: string, input: AddressInput) {
  const index = db.addresses.findIndex((a) => a.id === id)
  if (index === -1) return null
  if (input.isDefault) db.addresses = db.addresses.map((a) => ({ ...a, isDefault: false }))
  db.addresses[index] = { ...db.addresses[index], ...input, apartment: input.apartment || null }
  return db.addresses[index]
}

export async function deleteAddress(id: string) {
  const before = db.addresses.length
  db.addresses = db.addresses.filter((a) => a.id !== id)
  return db.addresses.length < before
}

// ─── Ajustes y admin ───────────────────────────────────────────

export async function getSettings() {
  return db.settings
}

export async function updateSettings(input: SettingsInput) {
  db.settings = { ...db.settings, ...input }
  return db.settings
}

export async function getDashboard() {
  return { stats: dashboardStats, sales: salesSeries, payments }
}

export async function listUsers() {
  return adminUsers
}
