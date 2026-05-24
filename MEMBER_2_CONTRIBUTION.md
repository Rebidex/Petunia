# Member 2 Presentation Portfolio & Code Guide (Backend Engineer)

This document is your step-by-step guide to explaining your contributions during the project defense. It outlines what you did, walks through the exact code files you "wrote" line-by-line, and provides answers to questions the presentation panel might ask you.

---

## 1. Summary of Your Role & Key Responsibilities
As the **Backend Engineer**, you were responsible for the server infrastructure, database storage layer, validation middleware, and transaction routes:
1. **File-Based Database**: Integrated Lowdb, configuring it to write asynchronously to a flat JSON file (`db.json`) which serves as the server's database storage.
2. **Registration Safety Checks**: Implemented secure registration controllers that inspect user password strength and email formats before writing them to the database.
3. **Inventory Tracking Operations**: Programmed database transactions in checkout and cancellation routes. If an order is canceled, your code automatically restocks those quantities back into the catalog.
4. **Endpoint Routing**: Structured routing folders cleanly, dividing controllers into auth, product, order, and custom bouquet routers.

---

## 2. Core Code Walkthroughs (What You "Wrote")

### Code File 1: JSON File Database Configuration (`server/db/index.js`)
*Purpose: Initializes the local JSON database file driver with initial table keys.*

#### Code Snippet:
```javascript
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
```

#### Line-by-Line Explanation:
* **`JSONFilePreset`**: A preconfigured utility function from Lowdb that reads from and writes to a JSON file on the local disk.
* **`__dirname`**: Calculates the absolute filesystem path of the folder containing the current script.
* **`defaults`**: The structural template. If `db.json` is missing or empty, Lowdb automatically initializes it with empty arrays for users, products, orders, and custom bouquets.
* **`export const db`**: Initializes the database and exports the instance so other routes can read and write records.

---

### Code File 2: Registration Validation & Hashing (`server/routes/auth.js`)
*Purpose: Inspects user details during registration and hashes passwords before saving.*

#### Code Snippet:
```javascript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
if (!emailRegex.test(normalizedEmail)) {
  return res.status(400).json({ error: 'Formatul emailului este invalid.' })
}

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
if (!passwordRegex.test(password)) {
  return res.status(400).json({
    error: 'Parola trebuie sa aiba cel putin 8 caractere si sa contina o litera mare, o litera mica, un numar si un caracter special (@$!%*?&).'
  })
}

const exists = db.data.users.find((user) => user.email === normalizedEmail)
if (exists) {
  return res.status(409).json({ error: 'Email deja folosit' })
}

const hashedPassword = await bcrypt.hash(password, 10)
```

#### Line-by-Line Explanation:
* **`emailRegex`**: Matches a standard pattern like `user@domain.com` by ensuring there is text before and after the `@` symbol and a valid domain suffix.
* **`passwordRegex`**: Uses positive lookaheads `(?=...)` to check password strength:
  * `(?=.*[a-z])` checking at least 1 lowercase letter.
  * `(?=.*[A-Z])` checking at least 1 uppercase letter.
  * `(?=.*\d)` checking at least 1 numerical digit.
  * `(?=.*[@$!%*?&])` checking at least 1 special symbol.
  * `{8,}` enforcing a minimum length of 8 characters.
* **`db.data.users.find(...)`**: Queries the local array database. If the email is already in use, it aborts the signup, returning a `409 Conflict` HTTP status code.
* **`bcrypt.hash(password, 10)`**: Asynchronously hashes the plain text password with 10 salt rounds so that user credentials are encrypted.

---

### Code File 3: Stock Restoration Endpoint (`server/routes/orders.js`)
*Purpose: Cancels active pending orders and returns the items' quantities to inventory.*

#### Code Snippet:
```javascript
router.post('/:id/cancel', authenticate, async (req, res) => {
  try {
    const order = db.data.orders.find((item) => item.id === req.params.id)
    if (!order) {
      return res.status(404).json({ error: 'Comanda nu a fost gasita' })
    }

    if (order.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acces interzis la aceasta comanda' })
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ error: 'Doar comenzile in asteptare pot fi anulate' })
    }

    // Restore stock
    for (const item of order.items) {
      if (item.productId.startsWith('custom-')) {
        continue
      }
      const product = db.data.products.find((p) => p.id === item.productId)
      if (product) {
        const currentStock = Number(product.stock)
        const restoredQty = Number(item.quantity)
        if (Number.isFinite(currentStock) && Number.isFinite(restoredQty)) {
          product.stock = currentStock + restoredQty
        }
      }
    }

    order.status = 'cancelled'
    await db.write()

    return res.json({ order })
  } catch {
    return res.status(500).json({ error: 'Eroare la anularea comenzii' })
  }
})
```

#### Line-by-Line Explanation:
* **`db.data.orders.find(...)`**: Locates the target order inside the database array by comparing it to the dynamic URL parameter `req.params.id`.
* **`if (order.userId !== req.user.id && ...)`**: Authorization check. Ensures only the owner of the order or an admin can run this request.
* **`if (order.status !== 'pending')`**: Checks order state. Prevents cancellation of orders that have already been shipped or processed.
* **`for (const item of order.items) { ... }`**: Loops through the items of the canceled order.
* **`product.stock = currentStock + restoredQty`**: Restores the stock values. Reads the current stock count, adds back the quantity that had been ordered, and updates the catalog item in memory.
* **`await db.write()`**: Asynchronously saves memory records back to `db.json` on the disk, making the cancellation permanent.

---

## 3. Defense Panel Q&A Cheat Sheet (What to Say)

#### Q1: "What is Lowdb and why did you choose it over MongoDB or MySQL?"
* **Your Answer**: *"Lowdb is a lightweight, local JSON file-based database. For a local project of this scale, it eliminates database server hosting setup while letting us perform asynchronous reads and writes. We query and update database items using standard JavaScript array methods, making it clean and fast."*

#### Q2: "How did you implement validation logic for secure account signups?"
* **Your Answer**: *"I wrote server-side validation middleware using Regex pattern matching. During registration, the server checks if the email is structurally valid and ensures the password meets security requirements. If validation fails, the server rejects the request with a detailed error message without executing database write operations."*

#### Q3: "What happens to stock levels when an order is created versus when it is canceled?"
* **Your Answer**: *"When a client places an order, the server loops through their cart items, verifies if there is enough stock in db.json, and decrements those quantities. If the client decides to cancel their pending order, the cancel router loops through the order details and automatically increments the stock levels back in db.json, writing those changes asynchronously to the disk."*

#### Q4: "How does the backend authenticate users on private routes?"
* **Your Answer**: *"We use JSON Web Tokens (JWT). When a user logs in, the server generates a token containing their ID and role, signed with a secret key. The frontend sends this token in request headers. A custom middleware (authenticate) verifies the signature, and rejects the request if the token is invalid or expired."*
