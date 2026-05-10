import express from 'express'
import { db } from '../db/index.js'
import { authenticate } from '../middleware/auth.js'
import { adminOnly } from '../middleware/adminOnly.js'

const router = express.Router()

const sanitizeUser = (user) => {
  const { password, ...safeUser } = user
  return safeUser
}

router.get('/', authenticate, adminOnly, async (req, res) => {
  try {
    return res.json({ users: db.data.users.map(sanitizeUser) })
  } catch {
    return res.status(500).json({ error: 'Eroare la obtinerea utilizatorilor' })
  }
})

router.delete('/:id', authenticate, adminOnly, async (req, res) => {
  try {
    const userIndex = db.data.users.findIndex((item) => item.id === req.params.id)
    if (userIndex === -1) {
      return res.status(404).json({ error: 'Utilizatorul nu a fost gasit' })
    }

    const [removedUser] = db.data.users.splice(userIndex, 1)

    db.data.orders = db.data.orders.filter((order) => order.userId !== removedUser.id)
    db.data.bouquets = db.data.bouquets.filter((bouquet) => bouquet.userId !== removedUser.id)

    await db.write()

    return res.json({ message: 'Utilizator sters', user: sanitizeUser(removedUser) })
  } catch {
    return res.status(500).json({ error: 'Eroare la stergerea utilizatorului' })
  }
})

export default router
