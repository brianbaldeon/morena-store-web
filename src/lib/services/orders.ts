import "server-only"
import type { CustomOrder, Order, OrderStatus } from "@/types"
import { customOrders as seedCustomOrders, orders as seedOrders } from "@/data/mock-user"
import type { CustomOrderUpdateInput, OrderStatusInput } from "@/lib/validations/admin"
import type { CheckoutRequest } from "@/lib/validations/checkout"
import { getProductById } from "./catalog"
import { getSettings } from "./account"

const globalForDb = globalThis as unknown as {
  ordersDb?: { orders: Order[]; customOrders: CustomOrder[]; sequence: number }
}
const db = (globalForDb.ordersDb ??= {
  orders: [...seedOrders],
  customOrders: [...seedCustomOrders],
  sequence: 1047,
})

// ─── Pedidos ───────────────────────────────────────────────────

export async function listOrders(params: { userId?: string; status?: OrderStatus } = {}) {
  return db.orders
    .filter((o) => (params.userId ? o.userId === params.userId : true))
    .filter((o) => (params.status ? o.status === params.status : true))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function getOrderByNumber(number: string) {
  return db.orders.find((o) => o.number === number) ?? null
}

export async function getOrderById(id: string) {
  return db.orders.find((o) => o.id === id) ?? null
}

export async function updateOrderStatus(id: string, input: OrderStatusInput) {
  const order = db.orders.find((o) => o.id === id)
  if (!order) return null
  order.status = input.status
  order.trackingNumber = input.trackingNumber || order.trackingNumber
  order.timeline = [...order.timeline, { status: input.status, date: new Date().toISOString() }]
  return order
}

/**
 * Crea el pedido en estado PENDIENTE.
 * Etapa 2: acá se crea la preferencia de Mercado Pago (Checkout Pro) y se devuelve su init_point.
 */
export async function createOrder(request: CheckoutRequest, userId: string) {
  const settings = await getSettings()
  const items = await Promise.all(
    request.items.map(async (item, i) => {
      const product = await getProductById(item.productId)
      return {
        id: `oi-${Date.now()}-${i}`,
        productId: item.productId,
        name: product?.name ?? "Producto",
        image: product?.images[0] ?? "",
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        customization: null,
      }
    }),
  )
  const subtotal = items.reduce((acc, i) => acc + i.unitPrice * i.quantity, 0)
  const { customer } = request
  const shippingCost =
    customer.shippingMethod === "RETIRO" || subtotal >= settings.freeShippingFrom ? 0 : settings.shippingCost
  const now = new Date().toISOString()
  const order: Order = {
    id: `ord-${db.sequence}`,
    number: `MOR-${db.sequence++}`,
    userId,
    customerName: customer.name,
    customerEmail: customer.email,
    items,
    shippingMethod: customer.shippingMethod,
    shippingAddress:
      customer.shippingMethod === "DOMICILIO"
        ? {
            recipient: customer.name,
            street: customer.street ?? "",
            number: customer.number ?? "",
            apartment: customer.apartment || null,
            city: customer.city ?? "",
            province: customer.province ?? "",
            postalCode: customer.postalCode ?? "",
            phone: customer.phone,
          }
        : null,
    subtotal,
    shippingCost,
    total: subtotal + shippingCost,
    status: "PENDIENTE",
    paymentStatus: "PENDING",
    mpPaymentId: null,
    trackingNumber: null,
    createdAt: now,
    timeline: [{ status: "PENDIENTE", date: now }],
  }
  db.orders.unshift(order)
  return order
}

// ─── Pedidos personalizados ────────────────────────────────────

export async function listCustomOrders() {
  return [...db.customOrders].sort((a, b) => a.dueDate.localeCompare(b.dueDate))
}

export async function getCustomOrderById(id: string) {
  return db.customOrders.find((o) => o.id === id) ?? null
}

export async function updateCustomOrder(id: string, input: CustomOrderUpdateInput) {
  const order = db.customOrders.find((o) => o.id === id)
  if (!order) return null
  order.status = input.status
  if (input.designPreview) order.designPreview = input.designPreview
  // Al aprobar el diseño, el pedido pagado pasa a producción.
  const parent = db.orders.find((o) => o.number === order.orderNumber)
  if (input.status === "PRODUCCION" && parent?.status === "PAGADO") {
    parent.status = "EN_PRODUCCION"
    parent.timeline = [...parent.timeline, { status: "EN_PRODUCCION", date: new Date().toISOString() }]
  }
  return order
}
