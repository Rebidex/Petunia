import { JSONFilePreset } from 'lowdb/node'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const defaults = {
  users: [],
  products: [],
  orders: [],
  bouquets: []
}

export const db = await JSONFilePreset(join(__dirname, 'db.json'), defaults)
