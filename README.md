# Petunia Monorepo

Petunia este o aplicatie full-stack pentru florarie online, construita in JavaScript, cu 3 aplicatii:
- `server/` - API Express + lowdb
- `client/` - frontend client React (port 5173)
- `admin/` - frontend admin React (port 5174)

## Tech Stack
- Node.js 20+
- Express 4
- lowdb 7 (JSON)
- JWT (`jsonwebtoken`) + `bcryptjs`
- React 18 + Vite
- Tailwind CSS 3

## Structura
- `server/` backend API
- `client/` frontend client
- `admin/` frontend admin

## Setup Local
1. Instaleaza dependentele:
```bash
npm install
npm install --prefix server
npm install --prefix client
npm install --prefix admin
```
2. Configureaza backendul:
- copiaza `server/.env.example` in `server/.env` (deja inclus local in proiect)
3. Ruleaza seed:
```bash
npm run seed --prefix server
```
4. Porneste toate aplicatiile:
```bash
npm run dev
```

Sau separat:
```bash
npm run dev --prefix server
npm run dev --prefix client
npm run dev --prefix admin
```

## Credențiale demo
- Admin: `admin@florishop.me` / `Admin123!`
- Client: `ion@test.com` / `Test123!`
- Client: `maria@test.com` / `Test123!`

## API
Base URL local: `http://localhost:3001/api`

### Auth
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

### Products
- `GET /products`
- `GET /products/:id`
- `POST /products` (admin)
- `PUT /products/:id` (admin)
- `DELETE /products/:id` (admin)

### Orders
- `GET /orders` (admin)
- `GET /orders/my` (client)
- `GET /orders/:id` (auth)
- `POST /orders` (client)
- `PATCH /orders/:id/status` (admin)

### Bouquets
- `GET /bouquets/my` (client)
- `POST /bouquets` (client)
- `DELETE /bouquets/:id` (client)

### Users
- `GET /users` (admin)
- `DELETE /users/:id` (admin)

## Builder LocalStorage
In client (`/builder`) se salveaza automat:
- `builderState` (flori + wrapColor)

Se mai salveaza:
- `cart`
- `token`
- `user`

## Build
```bash
npm run build --prefix client
npm run build --prefix admin
```

## Deploy (ghid)
- Backend: Render (`server/`)
- Frontend client: Vercel (`client/`)
- Frontend admin: Vercel (`admin/`)

## Observatii
- Colectia Postman este in `Petunia.postman_collection.json`.
- API a fost testat local pentru login, produse, comenzi, buchete si users.
