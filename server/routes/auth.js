import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { db } from '../db/index.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

const sanitizeUser = (user) => {
  const { password, ...safeUser } = user
  return safeUser
}

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Numele, emailul si parola sunt obligatorii' })
    }

    const normalizedEmail = String(email).toLowerCase().trim()
    const exists = db.data.users.find((user) => user.email === normalizedEmail)

    if (exists) {
      return res.status(409).json({ error: 'Email deja folosit' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = {
      id: uuidv4(),
      name: String(name).trim(),
      email: normalizedEmail,
      password: hashedPassword,
      phone: '',
      role: 'client',
      createdAt: new Date().toISOString()
    }

    db.data.users.push(newUser)
    await db.write()

    return res.status(201).json({ message: 'Cont creat cu succes', user: sanitizeUser(newUser) })
  } catch (error) {
    return res.status(500).json({ error: 'Eroare la inregistrare' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Emailul si parola sunt obligatorii' })
    }

    const normalizedEmail = String(email).toLowerCase().trim()
    const user = db.data.users.find((entry) => entry.email === normalizedEmail)

    if (!user) {
      return res.status(401).json({ error: 'Credentiale invalide' })
    }

    const passwordMatches = await bcrypt.compare(password, user.password)
    if (!passwordMatches) {
      return res.status(401).json({ error: 'Credentiale invalide' })
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    return res.json({ token, user: sanitizeUser(user) })
  } catch (error) {
    return res.status(500).json({ error: 'Eroare la autentificare' })
  }
})

router.get('/me', authenticate, async (req, res) => {
  try {
    const user = db.data.users.find((entry) => entry.id === req.user.id)
    if (!user) {
      return res.status(404).json({ error: 'Utilizatorul nu a fost gasit' })
    }

    const normalizedUser = {
      ...user,
      phone: typeof user.phone === 'string' ? user.phone : ''
    }

    return res.json({ user: sanitizeUser(normalizedUser) })
  } catch {
    return res.status(500).json({ error: 'Eroare la obtinerea profilului' })
  }
})

export default router
