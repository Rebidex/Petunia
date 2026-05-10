# FloriShop — Instrucțiuni Complete pentru Claude Code

> Citește acest fișier integral înainte de a scrie orice linie de cod.
> Respectă toate convențiile, structura de foldere și ordinea de implementare.

---

## 1. Viziunea proiectului

**FloriShop** este o aplicație web full-stack pentru o florărie online, construită complet în JavaScript. Permite clienților să comande buchete prefabricate sau să-și creeze propriul buchet personalizat. Administratorii gestionează produsele și comenzile printr-un panou separat.

Proiectul este evaluat academic. Criteriile de notare maximă sunt:
- Comunicare funcțională client ↔ server (demonstrată live)
- CRUD complet pe baza de date
- Autentificare cu roluri (client vs admin)
- Salvare locală a configurațiilor utilizatorului
- Testare cu Postman (colecție exportată)
- Două aplicații frontend distincte (client + admin)
- Deployment public accesibil profesorului

---

## 2. Tech Stack — OBLIGATORIU

| Layer | Tehnologie | Motiv |
|---|---|---|
| Runtime | Node.js 20+ | JavaScript obligatoriu la curs |
| Backend | Express.js 4.x | simplu, rapid, multi-client |
| Auth | jsonwebtoken + bcryptjs | JWT stateless, roluri |
| Baza de date | lowdb 3.x (JSON files) | cerință curs: `.json; stochează date` |
| Frontend | React 18 + Vite | modern, rapid de construit |
| Routing client | react-router-dom v6 | SPA routing |
| HTTP client | axios | cereri la API |
| Styling | Tailwind CSS v3 | rapid, responsive |
| Iconuri | lucide-react | consistente, lightweight |
| Dev tool | concurrently | rulează server + client simultan |

**NU folosi:** TypeScript, Next.js, Prisma, MongoDB, PostgreSQL, Redux. Proiectul trebuie să rămână simplu și demonstrabil în 10 minute.

---

## 3. Structura monorepo — EXACTĂ

```
florishop/
├── CLAUDE.md                  ← acest fișier
├── .gitignore
├── README.md
│
├── server/                    ← Backend Express
│   ├── package.json
│   ├── .env.example
│   ├── index.js               ← entry point
│   ├── middleware/
│   │   ├── auth.js            ← verificare JWT
│   │   └── adminOnly.js       ← verificare rol admin
│   ├── routes/
│   │   ├── auth.js            ← /api/auth
│   │   ├── products.js        ← /api/products
│   │   ├── bouquets.js        ← /api/bouquets (buchete custom salvate)
│   │   ├── orders.js          ← /api/orders
│   │   └── users.js           ← /api/users
│   ├── db/
│   │   ├── index.js           ← inițializare lowdb
│   │   ├── users.json         ← { "users": [] }
│   │   ├── products.json      ← { "products": [] }
│   │   ├── orders.json        ← { "orders": [] }
│   │   └── bouquets.json      ← { "bouquets": [] }
│   └── seed.js                ← populează DB cu date demo
│
├── client/                    ← Frontend Client (React + Vite)
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── api/
│       │   └── axios.js       ← instanță axios configurată
│       ├── context/
│       │   ├── AuthContext.jsx
│       │   └── CartContext.jsx
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── Catalog.jsx
│       │   ├── ProductDetail.jsx
│       │   ├── Builder.jsx    ← builder buchet custom
│       │   ├── Cart.jsx
│       │   ├── Checkout.jsx
│       │   ├── Payment.jsx    ← mock, doar buton
│       │   ├── OrderConfirm.jsx
│       │   ├── Login.jsx
│       │   └── Register.jsx
│       └── components/
│           ├── Navbar.jsx
│           ├── Footer.jsx
│           ├── ProductCard.jsx
│           ├── FlowerChip.jsx ← chip selectabil în builder
│           └── ProtectedRoute.jsx
│
└── admin/                     ← Frontend Admin (React + Vite)
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── api/
        │   └── axios.js
        ├── context/
        │   └── AuthContext.jsx
        ├── pages/
        │   ├── Login.jsx
        │   ├── Dashboard.jsx
        │   ├── Products.jsx   ← tabel cu CRUD complet
        │   ├── Orders.jsx     ← tabel comenzi + schimbare status
        │   └── Users.jsx      ← vizualizare utilizatori
        └── components/
            ├── Sidebar.jsx
            ├── Topbar.jsx
            ├── StatCard.jsx
            └── Modal.jsx      ← refolosibil pentru add/edit
```

---

## 4. Schema bazei de date (JSON)

### `users.json`
```json
{
  "users": [
    {
      "id": "uuid-v4",
      "name": "Ion Popescu",
      "email": "ion@example.com",
      "password": "$2a$10$hashedpassword",
      "role": "client",
      "createdAt": "2025-01-01T10:00:00Z"
    },
    {
      "id": "uuid-v4-admin",
      "name": "Admin FloriShop",
      "email": "admin@florishop.me",
      "password": "$2a$10$hashedpassword",
      "role": "admin",
      "createdAt": "2025-01-01T08:00:00Z"
    }
  ]
}
```

### `products.json`
```json
{
  "products": [
    {
      "id": "uuid-v4",
      "name": "Buchet Romantic Roșu",
      "description": "12 trandafiri roșii cu verdeață",
      "price": 89.99,
      "category": "trandafiri",
      "imageUrl": "https://images.unsplash.com/photo-...",
      "stock": 15,
      "isAvailable": true,
      "createdAt": "2025-01-01T10:00:00Z"
    }
  ]
}
```

### `orders.json`
```json
{
  "orders": [
    {
      "id": "uuid-v4",
      "userId": "uuid-v4",
      "customerName": "Ion Popescu",
      "customerPhone": "0742000000",
      "deliveryAddress": "Str. Florilor 12, Cluj-Napoca",
      "deliveryDate": "2025-06-15",
      "items": [
        {
          "productId": "uuid-v4",
          "name": "Buchet Romantic Roșu",
          "price": 89.99,
          "quantity": 2
        }
      ],
      "totalPrice": 179.98,
      "status": "pending",
      "note": "Te rog adaugă un mesaj de zi de naștere",
      "createdAt": "2025-01-01T10:00:00Z"
    }
  ]
}
```
Statusuri posibile: `"pending"` | `"confirmed"` | `"delivered"` | `"cancelled"`

### `bouquets.json`
```json
{
  "bouquets": [
    {
      "id": "uuid-v4",
      "userId": "uuid-v4",
      "name": "Buchetul meu special",
      "flowers": [
        { "flower": "Trandafir roșu", "quantity": 5, "color": "#e63946" },
        { "flower": "Lalele albe", "quantity": 3, "color": "#f1faee" }
      ],
      "wrapColor": "#a8dadc",
      "totalStems": 8,
      "estimatedPrice": 65.00,
      "createdAt": "2025-01-01T10:00:00Z"
    }
  ]
}
```

---

## 5. API Routes — Backend

### Auth `/api/auth`
| Method | Path | Auth | Descriere |
|--------|------|------|-----------|
| POST | `/register` | — | Creează cont nou (rol: client) |
| POST | `/login` | — | Returnează JWT token |
| GET | `/me` | Bearer | Returnează utilizatorul curent |

### Products `/api/products`
| Method | Path | Auth | Descriere |
|--------|------|------|-----------|
| GET | `/` | — | Lista toate produsele disponibile |
| GET | `/:id` | — | Detalii produs |
| POST | `/` | Admin | Adaugă produs nou |
| PUT | `/:id` | Admin | Editează produs |
| DELETE | `/:id` | Admin | Șterge produs |

### Orders `/api/orders`
| Method | Path | Auth | Descriere |
|--------|------|------|-----------|
| GET | `/` | Admin | Toate comenzile |
| GET | `/my` | Client | Comenzile utilizatorului curent |
| GET | `/:id` | Bearer | O comandă specifică |
| POST | `/` | Client | Plasează comandă nouă |
| PATCH | `/:id/status` | Admin | Schimbă statusul comenzii |

### Bouquets `/api/bouquets`
| Method | Path | Auth | Descriere |
|--------|------|------|-----------|
| GET | `/my` | Client | Buchetele custom ale userului |
| POST | `/` | Client | Salvează buchet custom |
| DELETE | `/:id` | Client | Șterge buchet salvat |

### Users `/api/users`
| Method | Path | Auth | Descriere |
|--------|------|------|-----------|
| GET | `/` | Admin | Lista utilizatori |
| DELETE | `/:id` | Admin | Șterge utilizator |

---

## 6. Implementarea Backend — Detalii

### `server/index.js`
```js
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import productRoutes from './routes/products.js'
import orderRoutes from './routes/orders.js'
import bouquetRoutes from './routes/bouquets.js'
import userRoutes from './routes/users.js'

dotenv.config()
const app = express()

app.use(cors({
  origin: [process.env.CLIENT_URL, process.env.ADMIN_URL],
  credentials: true
}))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/bouquets', bouquetRoutes)
app.use('/api/users', userRoutes)

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }))

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`FloriShop API running on port ${PORT}`))
```

### `server/db/index.js` — lowdb setup
```js
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

> **Notă:** Folosește un singur fișier `db.json` cu toate colecțiile pentru simplitate cu lowdb 3.x, sau fișiere separate cu instanțe lowdb separate. Alege varianta cu un singur `db.json` — e mai simplu de gestionat.

### `server/middleware/auth.js`
```js
import jwt from 'jsonwebtoken'

export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Token lipsă' })
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Token invalid' })
  }
}

export const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Acces interzis' })
  next()
}
```

### `server/.env.example`
```
PORT=3001
JWT_SECRET=florishop_super_secret_key_change_in_production
CLIENT_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
```

### `server/package.json`
```json
{
  "name": "florishop-server",
  "type": "module",
  "scripts": {
    "dev": "node --watch index.js",
    "start": "node index.js",
    "seed": "node seed.js"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "jsonwebtoken": "^9.0.2",
    "lowdb": "^7.0.1",
    "uuid": "^10.0.0"
  }
}
```

---

## 7. Implementarea Client Frontend — Detalii

### `client/vite.config.js`
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  define: { 'process.env': {} }
})
```

### `client/src/api/axios.js`
```js
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api
```

### Pagina Builder (`client/src/pages/Builder.jsx`)
Aceasta este pagina cea mai importantă din perspectiva cerințelor cursului.

**Funcționalitate obligatorie:**
1. Grilă de flori selectabile (trandafiri, lalele, crizanteme, bujori, iris, eucalipt, etc.) — cel puțin 8 opțiuni
2. Fiecare floare are un selector de cantitate (+ / -)
3. Selector culoare fundal pachet (palette de 6-8 culori)
4. Preview live al buchetului (liste cu florile adăugate și prețul estimat)
5. **Salvare în localStorage** — la fiecare modificare, starea se salvează automat în `localStorage.setItem('builderState', JSON.stringify(state))`
6. La încărcarea paginii, **restaurare din localStorage** — dacă există date salvate, le pre-populează
7. Buton "Salvează buchetul" — trimite POST la `/api/bouquets` (dacă e logat) SAU îl adaugă direct în coș
8. Buton "Adaugă în coș" — calculează prețul și adaugă în CartContext

**Prețuri flori (pentru calcul):**
- Trandafir roșu: 7.5 RON/buc
- Trandafir alb: 7.5 RON/buc
- Lalea: 5 RON/buc
- Crizantemă: 4 RON/buc
- Bujor: 9 RON/buc
- Iris: 6 RON/buc
- Eucalipt: 3 RON/buc
- Gypsophila: 4 RON/buc

### Pagina Checkout (`client/src/pages/Checkout.jsx`)
Formular cu câmpurile:
- Nume complet (required)
- Telefon (required, validat format RO)
- Adresă de livrare (required)
- Data livrării (required, min: mâine)
- Notă opțională

La submit: POST `/api/orders` cu token, redirect la `/payment`

### Pagina Payment (`client/src/pages/Payment.jsx`)
- Afișează sumar comandă (produse, total)
- Un buton mare verde "Confirmă și Plătește"
- La click: redirect la `/order-confirm` cu mesaj de succes
- **Nu face nimic real** — e mock pentru demonstrație

### LocalStorage — ce se salvează
```js
// Builder state
localStorage.setItem('builderState', JSON.stringify({ flowers, wrapColor }))

// Cart
localStorage.setItem('cart', JSON.stringify(cartItems))

// Auth token
localStorage.setItem('token', jwtToken)
localStorage.setItem('user', JSON.stringify(userData))
```

### `client/package.json`
```json
{
  "name": "florishop-client",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "axios": "^1.7.2",
    "lucide-react": "^0.400.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.24.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.39",
    "tailwindcss": "^3.4.6",
    "vite": "^5.3.2"
  }
}
```

---

## 8. Implementarea Admin Frontend — Detalii

### Port: 5174 (diferit de client!)

### `admin/vite.config.js`
```js
export default defineConfig({
  plugins: [react()],
  server: { port: 5174 }
})
```

### Dashboard (`admin/src/pages/Dashboard.jsx`)
Afișează 4 stat cards:
- Total comenzi
- Comenzi pending
- Total produse
- Total utilizatori

Fiecare card face GET la ruta corespunzătoare.

### Products (`admin/src/pages/Products.jsx`)
Tabel cu coloane: Nume | Categorie | Preț | Stoc | Disponibil | Acțiuni

Acțiuni per rând:
- Buton Edit → deschide `<Modal>` cu formular pre-populat → PUT `/api/products/:id`
- Buton Delete → confirmare → DELETE `/api/products/:id`

Buton "Adaugă produs" (sus dreapta) → `<Modal>` gol → POST `/api/products`

### Orders (`admin/src/pages/Orders.jsx`)
Tabel cu coloane: ID | Client | Data | Total | Status | Acțiuni

Status afișat ca badge colorat:
- `pending` → galben
- `confirmed` → albastru
- `delivered` → verde
- `cancelled` → roșu

Acțiune: dropdown select pentru schimbare status → PATCH `/api/orders/:id/status`

### Auth Admin
Adminul nu poate fi creat din UI — există din seed. La login, dacă `role !== 'admin'`, afișează eroare "Acces permis doar pentru administratori".

---

## 9. Design — Tailwind CSS

**Paleta de culori:**
- Primary: roz `#e91e8c` (floral, feminin)
- Secondary: verde deschis `#4ade80`
- Neutral: slate-ul Tailwind
- Background: `white` și `slate-50`

**Principii:**
- Mobile-first, responsive pe toate paginile
- Cards cu `shadow-sm`, `rounded-xl`, `border border-slate-100`
- Butoane principale: `bg-pink-500 hover:bg-pink-600 text-white rounded-lg px-6 py-2`
- Font: Inter (import din Google Fonts în `index.html`)
- Navbar fix cu logo "🌸 FloriShop"

**Imagini produse:** Folosește URL-uri de la Unsplash cu query-uri de flori. Exemplu:
```
https://images.unsplash.com/photo-1487530811015-780780169a86?w=400&q=80
```

---

## 10. Seed Data (`server/seed.js`)

Scriptul de seed trebuie să creeze:
- 1 admin: `admin@florishop.me` / `Admin123!`
- 2 clienți demo: `ion@test.com` / `Test123!` și `maria@test.com` / `Test123!`
- 10 produse variate (trandafiri, lalele, buchete mixte, plante)
- 3 comenzi cu statusuri diferite
- 2 buchete custom salvate

---

## 11. Ordinea de implementare — RESPECTĂ ACEASTĂ ORDINE

```
FAZA 1 — Backend (implementează complet înainte să treci mai departe)
  ✓ Setup server/, package.json, .env
  ✓ Inițializare lowdb, db.json cu structura
  ✓ Middleware auth.js și adminOnly.js
  ✓ Route /api/auth (register, login, /me)
  ✓ Route /api/products (CRUD complet)
  ✓ Route /api/orders (CRUD + patch status)
  ✓ Route /api/bouquets
  ✓ Route /api/users
  ✓ seed.js — rulează și verifică că DB are date
  ✓ Testează TOATE rutele cu curl sau verificare manuală

FAZA 2 — Client Frontend
  ✓ Setup Vite + React + Tailwind
  ✓ AuthContext + CartContext
  ✓ Navbar + Footer + ProtectedRoute
  ✓ axios.js cu interceptor
  ✓ Login + Register
  ✓ Home (hero + produse featured)
  ✓ Catalog (grid produse + filtrare categorie)
  ✓ ProductDetail
  ✓ Builder (cu localStorage obligatoriu)
  ✓ Cart
  ✓ Checkout
  ✓ Payment (mock)
  ✓ OrderConfirm

FAZA 3 — Admin Frontend
  ✓ Setup Vite + React + Tailwind (port 5174)
  ✓ AuthContext admin
  ✓ Login admin (verifică rol)
  ✓ Sidebar + Topbar layout
  ✓ Dashboard cu stat cards
  ✓ Products CRUD complet
  ✓ Orders cu schimbare status
  ✓ Users vizualizare

FAZA 4 — Polish și pregătire deployment
  ✓ .env.example pentru server
  ✓ README.md cu instrucțiuni de rulare
  ✓ Exportă colecție Postman (manual după ce rulezi serverul)
  ✓ Verifică că totul funcționează cu `npm run dev` în fiecare folder
```

---

## 12. Deployment

### Backend → Render.com
1. Push repo pe GitHub
2. Render → New Web Service → Connect repo → Root directory: `server`
3. Build command: `npm install`
4. Start command: `node index.js`
5. Environment vars: `JWT_SECRET`, `CLIENT_URL`, `ADMIN_URL`, `NODE_ENV=production`
6. După deploy, rulează seed: `node seed.js` (o singură dată)

### Frontend → Vercel
**Client:**
1. Vercel → New Project → Root directory: `client`
2. Framework: Vite
3. Env var: `VITE_API_URL=https://florishop-api.onrender.com/api`

**Admin:**
1. Vercel → New Project → Root directory: `admin`
2. Env var: `VITE_API_URL=https://florishop-api.onrender.com/api`

### Domeniu → name.com (GitHub Student Pack)
1. Activează beneficiul Name.com din GitHub Student Pack
2. Revendică domeniu gratuit (de obicei `.me` sau `.tech`)
3. În Name.com DNS, adaugă:
   - `CNAME @ → cname.vercel-dns.com` (sau A record cu IP Vercel)
   - `CNAME admin → cname.vercel-dns.com`
4. În Vercel → Settings → Domains → adaugă `yourdomain.me` la client și `admin.yourdomain.me` la admin

---

## 13. Postman Collection

Creează o colecție Postman numită **"FloriShop API"** cu folderele:
- Auth (register, login, /me)
- Products (GET all, GET one, POST, PUT, DELETE)
- Orders (GET all admin, GET my, POST, PATCH status)
- Bouquets (GET my, POST, DELETE)

Setează o variabilă de colecție `{{token}}` și folosește un test în requestul de login:
```js
pm.collectionVariables.set("token", pm.response.json().token)
```

Exportează colecția ca `FloriShop.postman_collection.json` și include-o în repo.

---

## 14. Convenții de cod

- ES Modules (`import/export`) peste tot, inclusiv în server (`"type": "module"`)
- `async/await` în loc de `.then().catch()`
- Try/catch în toate rutele Express
- IDs generate cu `uuid` (`import { v4 as uuidv4 } from 'uuid'`)
- Parole hashuite cu `bcryptjs` (saltRounds: 10)
- Toate răspunsurile API returnează JSON
- Erori returnate ca `{ "error": "mesaj descriptiv" }` cu statusul HTTP corect
- Comentarii în română sau engleză — consistent per fișier

---

## 15. Verificare finală înainte de prezentare

Rulează acest checklist:

```
□ npm run dev funcționează în server/, client/, admin/ fără erori
□ Register funcționează și creează user în db.json
□ Login returnează token valid
□ Adminul poate adăuga un produs nou
□ Produsul nou apare instant în client (fără refresh manual în aplicație)
□ Clientul poate plasa o comandă
□ Comanda apare în panoul admin
□ Adminul poate schimba statusul comenzii
□ Builder-ul salvează în localStorage (verificat în DevTools → Application → Local Storage)
□ La refresh, builder-ul restaurează selecția anterioară
□ Toate rutele din Postman returnează 200/201
□ Site-ul e accesibil pe domeniu public
□ Admin-ul e accesibil pe subdomain
```

---

*Proiect pentru materia Transmisia Datelor — echipa MiniTehnicus*
*Deadline: ultima săptămână de școală*
