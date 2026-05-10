import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import { db } from '../db/index.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

router.get('/my', authenticate, async (req, res) => {
  try {
    const bouquets = db.data.bouquets.filter((bouquet) => bouquet.userId === req.user.id)
    return res.json({ bouquets })
  } catch {
    return res.status(500).json({ error: 'Eroare la obtinerea buchetelor' })
  }
})

router.post('/', authenticate, async (req, res) => {
  try {
    const { name, flowers, wrapColor, totalStems, estimatedPrice } = req.body

    if (!name || !Array.isArray(flowers) || flowers.length === 0 || !wrapColor) {
      return res.status(400).json({ error: 'Datele buchetului sunt incomplete' })
    }

    const bouquet = {
      id: uuidv4(),
      userId: req.user.id,
      name: String(name).trim(),
      flowers,
      wrapColor,
      totalStems: Number(totalStems) || flowers.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0),
      estimatedPrice: Number(estimatedPrice) || 0,
      createdAt: new Date().toISOString()
    }

    db.data.bouquets.push(bouquet)
    await db.write()

    return res.status(201).json({ bouquet })
  } catch {
    return res.status(500).json({ error: 'Eroare la salvarea buchetului' })
  }
})

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const bouquetIndex = db.data.bouquets.findIndex((item) => item.id === req.params.id)
    if (bouquetIndex === -1) {
      return res.status(404).json({ error: 'Buchetul nu a fost gasit' })
    }

    if (db.data.bouquets[bouquetIndex].userId !== req.user.id) {
      return res.status(403).json({ error: 'Acces interzis la acest buchet' })
    }

    const [removedBouquet] = db.data.bouquets.splice(bouquetIndex, 1)
    await db.write()

    return res.json({ message: 'Buchet sters', bouquet: removedBouquet })
  } catch {
    return res.status(500).json({ error: 'Eroare la stergerea buchetului' })
  }
})

export default router
