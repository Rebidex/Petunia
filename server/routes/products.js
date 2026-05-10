import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import { db } from '../db/index.js'
import { authenticate } from '../middleware/auth.js'
import { adminOnly } from '../middleware/adminOnly.js'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const products = db.data.products.filter((product) => product.isAvailable !== false)
    return res.json({ products })
  } catch {
    return res.status(500).json({ error: 'Eroare la obtinerea produselor' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const product = db.data.products.find((item) => item.id === req.params.id)
    if (!product) {
      return res.status(404).json({ error: 'Produsul nu a fost gasit' })
    }

    return res.json({ product })
  } catch {
    return res.status(500).json({ error: 'Eroare la obtinerea produsului' })
  }
})

router.post('/', authenticate, adminOnly, async (req, res) => {
  try {
    const { name, description, price, category, imageUrl, stock, isAvailable } = req.body

    if (!name || !description || price == null || !category) {
      return res.status(400).json({ error: 'Datele produsului sunt incomplete' })
    }

    const product = {
      id: uuidv4(),
      name: String(name).trim(),
      description: String(description).trim(),
      price: Number(price),
      category: String(category).trim().toLowerCase(),
      imageUrl:
        imageUrl ||
        'https://images.unsplash.com/photo-1487530811015-780780169a86?w=400&q=80',
      stock: Number.isFinite(Number(stock)) ? Number(stock) : 0,
      isAvailable: typeof isAvailable === 'boolean' ? isAvailable : true,
      createdAt: new Date().toISOString()
    }

    db.data.products.push(product)
    await db.write()

    return res.status(201).json({ product })
  } catch {
    return res.status(500).json({ error: 'Eroare la crearea produsului' })
  }
})

router.put('/:id', authenticate, adminOnly, async (req, res) => {
  try {
    const product = db.data.products.find((item) => item.id === req.params.id)
    if (!product) {
      return res.status(404).json({ error: 'Produsul nu a fost gasit' })
    }

    const fields = ['name', 'description', 'price', 'category', 'imageUrl', 'stock', 'isAvailable']
    for (const field of fields) {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field]
      }
    }

    if (req.body.price !== undefined) product.price = Number(req.body.price)
    if (req.body.stock !== undefined) product.stock = Number(req.body.stock)

    await db.write()
    return res.json({ product })
  } catch {
    return res.status(500).json({ error: 'Eroare la actualizarea produsului' })
  }
})

router.delete('/:id', authenticate, adminOnly, async (req, res) => {
  try {
    const productIndex = db.data.products.findIndex((item) => item.id === req.params.id)
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Produsul nu a fost gasit' })
    }

    const [removedProduct] = db.data.products.splice(productIndex, 1)
    await db.write()

    return res.json({ message: 'Produs sters', product: removedProduct })
  } catch {
    return res.status(500).json({ error: 'Eroare la stergerea produsului' })
  }
})

export default router
