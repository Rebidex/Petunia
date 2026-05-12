import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import { db } from '../db/index.js'
import { authenticate } from '../middleware/auth.js'
import { adminOnly } from '../middleware/adminOnly.js'

const router = express.Router()
const allowedStatuses = ['pending', 'confirmed', 'delivered', 'cancelled']

router.get('/', authenticate, adminOnly, async (req, res) => {
  try {
    return res.json({ orders: db.data.orders })
  } catch {
    return res.status(500).json({ error: 'Eroare la obtinerea comenzilor' })
  }
})

router.get('/my', authenticate, async (req, res) => {
  try {
    const orders = db.data.orders
      .filter((order) => order.userId === req.user.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    return res.json({ orders })
  } catch {
    return res.status(500).json({ error: 'Eroare la obtinerea comenzilor tale' })
  }
})

router.get('/:id', authenticate, async (req, res) => {
  try {
    const order = db.data.orders.find((item) => item.id === req.params.id)
    if (!order) {
      return res.status(404).json({ error: 'Comanda nu a fost gasita' })
    }

    if (req.user.role !== 'admin' && order.userId !== req.user.id) {
      return res.status(403).json({ error: 'Acces interzis la aceasta comanda' })
    }

    return res.json({ order })
  } catch {
    return res.status(500).json({ error: 'Eroare la obtinerea comenzii' })
  }
})

router.post('/', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'client') {
      return res.status(403).json({ error: 'Doar clientii pot plasa comenzi' })
    }

    const { customerName, customerPhone, deliveryAddress, deliveryDate, items, totalPrice, note } = req.body

    if (!customerName || !customerPhone || !deliveryAddress || !deliveryDate || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Datele comenzii sunt incomplete' })
    }

    const orderItems = items.map((item) => {
      const quantity = Number(item.quantity)

      return {
        productId: String(item.productId || '').trim(),
        name: String(item.name || '').trim(),
        price: Number(item.price) || 0,
        quantity: Number.isFinite(quantity) ? quantity : 0
      }
    })

    for (const item of orderItems) {
      if (!item.productId || !Number.isFinite(item.quantity) || item.quantity <= 0) {
        return res.status(400).json({ error: 'Cantitatile produselor sunt invalide' })
      }
    }

    const stockUpdates = []
    for (const item of orderItems) {
      if (item.productId.startsWith('custom-')) {
        continue
      }

      const product = db.data.products.find((entry) => entry.id === item.productId)
      if (!product) {
        return res.status(400).json({ error: `Produs inexistent: ${item.name || item.productId}` })
      }

      const stockValue = Number(product.stock)
      if (Number.isFinite(stockValue) && item.quantity > stockValue) {
        return res.status(400).json({ error: `Stoc insuficient pentru ${product.name}` })
      }

      stockUpdates.push({ product, quantity: item.quantity })
    }

    const order = {
      id: uuidv4(),
      userId: req.user.id,
      customerName: String(customerName).trim(),
      customerPhone: String(customerPhone).trim(),
      deliveryAddress: String(deliveryAddress).trim(),
      deliveryDate,
      items: orderItems,
      totalPrice: Number(totalPrice) || 0,
      status: 'pending',
      note: note ? String(note).trim() : '',
      createdAt: new Date().toISOString()
    }

    stockUpdates.forEach(({ product, quantity }) => {
      const nextStock = Number(product.stock) - quantity
      product.stock = Number.isFinite(nextStock) ? Math.max(0, nextStock) : product.stock
    })

    db.data.orders.push(order)
    await db.write()

    return res.status(201).json({ order })
  } catch {
    return res.status(500).json({ error: 'Eroare la plasarea comenzii' })
  }
})

router.patch('/:id/status', authenticate, adminOnly, async (req, res) => {
  try {
    const { status } = req.body
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: 'Status invalid' })
    }

    const order = db.data.orders.find((item) => item.id === req.params.id)
    if (!order) {
      return res.status(404).json({ error: 'Comanda nu a fost gasita' })
    }

    order.status = status
    await db.write()

    return res.json({ order })
  } catch {
    return res.status(500).json({ error: 'Eroare la actualizarea statusului' })
  }
})

export default router
