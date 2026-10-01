import type { DashboardStats, Payment, SalesPoint, StoreSettings, User } from "@/types"

export const dashboardStats: DashboardStats = {
  revenue: 2_845_000,
  revenueChange: 18.4,
  orders: 132,
  ordersChange: 9.1,
  customers: 87,
  customersChange: 12.6,
  pendingCustom: 4,
}

export const salesSeries: SalesPoint[] = [
  { date: "2026-04", ventas: 1_320_000, pedidos: 64 },
  { date: "2026-05", ventas: 1_580_000, pedidos: 75 },
  { date: "2026-06", ventas: 1_910_000, pedidos: 88 },
  { date: "2026-07", ventas: 2_250_000, pedidos: 103 },
  { date: "2026-08", ventas: 2_402_000, pedidos: 121 },
  { date: "2026-09", ventas: 2_845_000, pedidos: 132 },
]

export const adminUsers: User[] = [
  { id: "usr-001", name: "Morena Gómez", email: "morena@example.com", phone: "+54 9 11 5555-1234", avatar: null, role: "ADMIN", createdAt: "2026-03-14T10:00:00-03:00" },
  { id: "usr-002", name: "Lucía Fernández", email: "lucia@example.com", phone: null, avatar: null, role: "CUSTOMER", createdAt: "2026-05-02T12:00:00-03:00" },
  { id: "usr-003", name: "Tomás Ruiz", email: "tomas@example.com", phone: "+54 9 351 444-2211", avatar: null, role: "CUSTOMER", createdAt: "2026-06-20T18:30:00-03:00" },
  { id: "usr-004", name: "Camila Sosa", email: "camila@example.com", phone: null, avatar: null, role: "CUSTOMER", createdAt: "2026-07-11T09:10:00-03:00" },
  { id: "usr-005", name: "Julián Pérez", email: "julian@example.com", phone: "+54 9 341 222-1100", avatar: null, role: "CUSTOMER", createdAt: "2026-08-05T21:00:00-03:00" },
  { id: "usr-006", name: "Sofía Medina", email: "sofia@example.com", phone: null, avatar: null, role: "CUSTOMER", createdAt: "2026-09-28T14:45:00-03:00" },
]

export const payments: Payment[] = [
  { id: "pay-1", orderNumber: "MOR-1046", customerName: "Sofía Medina", amount: 36500, method: "MERCADO_PAGO", status: "APPROVED", date: "2026-10-01T08:16:00-03:00" },
  { id: "pay-2", orderNumber: "MOR-1045", customerName: "Lucía Fernández", amount: 23000, method: "MERCADO_PAGO", status: "APPROVED", date: "2026-09-30T10:13:00-03:00" },
  { id: "pay-3", orderNumber: "MOR-1044", customerName: "Tomás Ruiz", amount: 64000, method: "MERCADO_PAGO", status: "IN_PROCESS", date: "2026-09-29T19:46:00-03:00" },
  { id: "pay-4", orderNumber: "MOR-1043", customerName: "Camila Sosa", amount: 19500, method: "MERCADO_PAGO", status: "APPROVED", date: "2026-09-28T13:01:00-03:00" },
  { id: "pay-5", orderNumber: "MOR-1042", customerName: "Morena Gómez", amount: 45000, method: "MERCADO_PAGO", status: "APPROVED", date: "2026-09-26T15:22:00-03:00" },
  { id: "pay-6", orderNumber: "MOR-1040", customerName: "Julián Pérez", amount: 12000, method: "MERCADO_PAGO", status: "REJECTED", date: "2026-09-21T11:00:00-03:00" },
]

export const storeSettings: StoreSettings = {
  storeName: "Store Morena",
  email: "hola@storemorena.com.ar",
  phone: "+54 9 11 5555-0000",
  instagram: "@store.morena",
  shippingCost: 4500,
  freeShippingFrom: 60000,
  productionDays: 10,
}
