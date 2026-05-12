import express from 'express'
import bcrypt from 'bcryptjs'
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

router.put('/me', authenticate, async (req, res) => {
  try {
    const { name, phone } = req.body
    await db.read()

    const userIndex = db.data.users.findIndex((item) => item.id === req.user.id)
    if (userIndex === -1) {
      return res.status(404).json({ error: 'Utilizator negasit' })
    }

    const user = db.data.users[userIndex]
    if (typeof user.phone !== 'string') {
      user.phone = ''
    }

    if (typeof name === 'string' && name.trim()) {
      user.name = name.trim()
    }

    if (typeof phone === 'string') {
      user.phone = phone.trim()
    }

    await db.write()

    return res.json(sanitizeUser(user))
  } catch {
    return res.status(500).json({ error: 'Eroare la actualizare' })
  }
})

router.put('/me/password', authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Parolele sunt obligatorii' })
    }

    await db.read()

    const user = db.data.users.find((item) => item.id === req.user.id)
    if (!user) {
      return res.status(404).json({ error: 'Utilizator negasit' })
    }

    const valid = await bcrypt.compare(currentPassword, user.password)
    if (!valid) {
      return res.status(400).json({ error: 'Parola curenta este incorecta' })
    }

    const hashed = await bcrypt.hash(newPassword, 10)
    user.password = hashed
    await db.write()

    return res.json({ message: 'Parola actualizata cu succes' })
  } catch {
    return res.status(500).json({ error: 'Eroare la schimbarea parolei' })
  }
})

export default router
