# FloriShop — Îmbunătățiri recomandate de profesor

> Instrucțiuni pentru agentul VS Code. Citește tot fișierul înainte de a începe.
> Implementează task-urile în ordinea numerotată. Nu sări pești.
> Site-ul existent rulează la petunia.page — nu sparge nimic ce funcționează deja.

---

## Regulă generală

Înainte de orice modificare la un fișier existent:
1. Citește fișierul complet
2. Identifică exact ce trebuie adăugat/modificat
3. Fă modificări chirurgicale — nu rescrie fișiere întregi dacă nu e necesar

---

## TASK 1 — Favicon pentru browser tab

**Prioritate: Scăzută · Timp estimat: 5 minute**

### Ce trebuie făcut

Adaugă o iconiță care apare în tab-ul browserului pentru ambele aplicații (client și admin).

### Implementare

1. Creează un fișier SVG simplu ca favicon în `client/public/favicon.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <text y=".9em" font-size="90">🌸</text>
</svg>
```

2. În `client/index.html`, înlocuiește sau adaugă în `<head>`:
```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
```

3. Repetă identic în `admin/public/favicon.svg` și `admin/index.html`, dar cu emoji 🛠️ sau 🌿.

---

## TASK 2 — Mesaj de succes la crearea contului

**Prioritate: Medie · Timp estimat: 30 minute**

### Ce trebuie făcut

Când un utilizator se înregistrează cu succes, să apară un mesaj vizibil (toast notification) care confirmă crearea contului, înainte de redirect.

### Implementare

**2a. Creează un componenet `Toast.jsx` reutilizabil în `client/src/components/Toast.jsx`:**

```jsx
import { useEffect } from 'react'
import { CheckCircle, XCircle, X } from 'lucide-react'

export default function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [onClose, duration])

  const styles = {
    success: 'bg-green-50 border-green-400 text-green-800',
    error: 'bg-red-50 border-red-400 text-red-800',
  }
  const Icon = type === 'success' ? CheckCircle : XCircle

  return (
    <div className={`fixed top-5 right-5 z-50 flex items-start gap-3 border rounded-xl px-4 py-3 shadow-lg max-w-sm animate-slide-in ${styles[type]}`}>
      <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
      <p className="text-sm font-medium">{message}</p>
      <button onClick={onClose} className="ml-auto">
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
```

**2b. Adaugă animația în `client/tailwind.config.js`:**
```js
theme: {
  extend: {
    keyframes: {
      'slide-in': {
        from: { transform: 'translateX(100%)', opacity: '0' },
        to: { transform: 'translateX(0)', opacity: '1' },
      }
    },
    animation: {
      'slide-in': 'slide-in 0.3s ease-out',
    }
  }
}
```

**2c. Creează un hook `useToast.js` în `client/src/hooks/useToast.js`:**
```js
import { useState, useCallback } from 'react'

export function useToast() {
  const [toast, setToast] = useState(null)

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type })
  }, [])

  const hideToast = useCallback(() => setToast(null), [])

  return { toast, showToast, hideToast }
}
```

**2d. Folosește hook-ul în `client/src/pages/Register.jsx`:**

În funcția de submit, după ce înregistrarea a reușit:
```js
// NU face redirect imediat
showToast('Contul tău a fost creat cu succes! Bun venit la FloriShop 🌸')
// Așteaptă 2 secunde, APOI redirect
setTimeout(() => navigate('/'), 2000)
```

Randează `<Toast>` în JSX-ul paginii (nu în Navbar — local pe pagină):
```jsx
{toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
```

**2e. Același pattern aplicat și în admin — la login admin adaugă toast de bun venit.**

---

## TASK 3 — Lista comenzilor anterioare (Order History)

**Prioritate: Ridicată · Timp estimat: 1-2 ore**

### Ce trebuie făcut

Pagină nouă în client (`/my-orders`) unde utilizatorul autentificat vede toate comenzile sale plasate anterior, cu statusul fiecăreia.

### Backend

Verifică că ruta `GET /api/orders/my` există și returnează comenzile filtrare după `userId` din token. Dacă nu există, adaug-o în `server/routes/orders.js`:

```js
// GET /api/orders/my — comenzile utilizatorului curent
router.get('/my', authenticate, async (req, res) => {
  try {
    await db.read()
    const myOrders = db.data.orders
      .filter(o => o.userId === req.user.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    res.json(myOrders)
  } catch (err) {
    res.status(500).json({ error: 'Eroare la preluarea comenzilor' })
  }
})
```

### Frontend — `client/src/pages/MyOrders.jsx`

Creează pagina cu următoarele elemente:

**Layout:**
- Titlu "Comenzile mele"
- Dacă nu sunt comenzi: ilustrație goală + text "Nu ai plasat nicio comandă încă" + buton "Explorează buchetele"
- Dacă există comenzi: listă de carduri, câte unul per comandă

**Cardul unei comenzi conține:**
- Data comenzii (formatată: `15 iunie 2025`)
- ID comandă scurt (primele 8 caractere din UUID, prefix `#`)
- Lista produselor (nume + cantitate)
- Prețul total
- Badge de status colorat:
  - `pending` → `bg-yellow-100 text-yellow-700` — "În așteptare"
  - `confirmed` → `bg-blue-100 text-blue-700` — "Confirmată"
  - `delivered` → `bg-green-100 text-green-700` — "Livrată"
  - `cancelled` → `bg-red-100 text-red-700` — "Anulată"

**Structura componentei:**
```jsx
export default function MyOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/orders/my')
      .then(res => setOrders(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Comenzile mele</h1>
      {orders.length === 0 ? <EmptyState /> : orders.map(order => <OrderCard key={order.id} order={order} />)}
    </div>
  )
}
```

### Routing

În `client/src/App.jsx`, adaugă ruta protejată:
```jsx
<Route path="/my-orders" element={
  <ProtectedRoute>
    <MyOrders />
  </ProtectedRoute>
} />
```

### Navigare

În `Navbar.jsx`, adaugă link "Comenzile mele" în meniul utilizatorului autentificat (dropdown sau link simplu lângă avatar).

---

## TASK 4 — Pagina de profil utilizator

**Prioritate: Medie · Timp estimat: 1-2 ore**

### Ce trebuie făcut

Pagină `/profile` unde utilizatorul vede și poate edita datele contului său.

### Backend

Adaugă în `server/routes/users.js` (sau `auth.js`):

```js
// PUT /api/users/me — actualizare profil
router.put('/me', authenticate, async (req, res) => {
  try {
    const { name, phone } = req.body
    await db.read()
    const userIndex = db.data.users.findIndex(u => u.id === req.user.id)
    if (userIndex === -1) return res.status(404).json({ error: 'Utilizator negăsit' })
    
    // Permite actualizarea doar câmpurilor sigure (NU email, NU role, NU password aici)
    if (name) db.data.users[userIndex].name = name
    if (phone) db.data.users[userIndex].phone = phone
    
    await db.write()
    const { password: _, ...userSafe } = db.data.users[userIndex]
    res.json(userSafe)
  } catch (err) {
    res.status(500).json({ error: 'Eroare la actualizare' })
  }
})

// PUT /api/users/me/password — schimbare parolă separată
router.put('/me/password', authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    await db.read()
    const user = db.data.users.find(u => u.id === req.user.id)
    const valid = await bcrypt.compare(currentPassword, user.password)
    if (!valid) return res.status(400).json({ error: 'Parola curentă este incorectă' })
    
    const hashed = await bcrypt.hash(newPassword, 10)
    user.password = hashed
    await db.write()
    res.json({ message: 'Parola actualizată cu succes' })
  } catch (err) {
    res.status(500).json({ error: 'Eroare la schimbarea parolei' })
  }
})
```

Asigură-te că câmpul `phone` există în schema user (adaugă-l dacă lipsește — valoare default `""`).

### Frontend — `client/src/pages/Profile.jsx`

**Secțiunile paginii:**

**Secțiunea 1 — Date personale:**
- Câmp: Nume complet (editabil)
- Câmp: Telefon (editabil)
- Câmp: Email (read-only, afișat gri cu tooltip "Email-ul nu poate fi modificat")
- Buton "Salvează modificările" → PUT `/api/users/me`
- Toast de confirmare la save reușit

**Secțiunea 2 — Schimbă parola:**
- Câmp: Parola curentă (password input)
- Câmp: Parola nouă (password input)
- Câmp: Confirmă parola nouă
- Validare client-side: parolele noi trebuie să coincidă, min 6 caractere
- Buton "Schimbă parola" → PUT `/api/users/me/password`
- Toast de confirmare

**Secțiunea 3 — Rezumat activitate (read-only):**
- "Număr total de comenzi: X" (preluate din `/api/orders/my`)
- "Cont creat la: [data]"

**Layout:**
```jsx
<div className="max-w-2xl mx-auto px-4 py-10 space-y-8">
  <h1 className="text-2xl font-bold text-slate-800">Profilul meu</h1>
  <PersonalInfoSection />
  <PasswordSection />
  <ActivitySummarySection />
</div>
```

### Routing și navigare

```jsx
<Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
```

În `Navbar.jsx`: link "Profilul meu" lângă "Comenzile mele".

### Sync cu AuthContext

După un save reușit al numelui, actualizează și state-ul din `AuthContext`:
```js
// În AuthContext, adaugă funcție updateUser
const updateUser = (newData) => setUser(prev => ({ ...prev, ...newData }))
```

---

## TASK 5 — Editare buchet personalizat din coș

**Prioritate: Ridicată · Timp estimat: 2-3 ore**

### Ce trebuie făcut

Când un utilizator are un buchet personalizat în coș, poate da click pe titlul lui pentru a deschide Builder-ul cu configurația pre-populată, modifica florile, și actualiza produsul din coș.

### Modificări în CartContext

Adaugă o funcție `updateCartItem`:
```js
const updateCartItem = (itemId, updatedData) => {
  setCart(prev => {
    const updated = prev.map(item =>
      item.cartId === itemId ? { ...item, ...updatedData } : item
    )
    localStorage.setItem('cart', JSON.stringify(updated))
    return updated
  })
}
```

Asigură-te că fiecare item din coș are un `cartId` unic (generează cu `crypto.randomUUID()` la adăugare).

### Modificări în Cart.jsx

Pentru item-urile de tip `customBouquet`, randul din coș trebuie să aibă:
```jsx
{item.type === 'customBouquet' && (
  <button
    onClick={() => navigate('/builder', { state: { editCartId: item.cartId, flowers: item.flowers, wrapColor: item.wrapColor } })}
    className="text-pink-500 text-sm underline hover:text-pink-700"
  >
    ✏️ Editează buchetul
  </button>
)}
```

### Modificări în Builder.jsx

La inițializarea paginii, verifică dacă există `location.state.editCartId` (primit prin React Router navigate state):

```js
const location = useLocation()
const navigate = useNavigate()
const { updateCartItem } = useCart()

useEffect(() => {
  // Prioritate 1: edităm un item din coș (venit din Cart)
  if (location.state?.editCartId) {
    setFlowers(location.state.flowers)
    setWrapColor(location.state.wrapColor)
    setEditingCartId(location.state.editCartId)
    return
  }
  // Prioritate 2: restaurare din localStorage (comportamentul existent)
  const saved = localStorage.getItem('builderState')
  if (saved) {
    const { flowers, wrapColor } = JSON.parse(saved)
    setFlowers(flowers)
    setWrapColor(wrapColor)
  }
}, [])
```

Modifică butonul de submit din Builder:
```jsx
// Dacă suntem în modul editare coș
{editingCartId ? (
  <button onClick={handleUpdateCart} className="btn-primary">
    ✓ Actualizează în coș
  </button>
) : (
  <button onClick={handleAddToCart} className="btn-primary">
    Adaugă în coș
  </button>
)}
```

Funcția `handleUpdateCart`:
```js
const handleUpdateCart = () => {
  updateCartItem(editingCartId, {
    flowers,
    wrapColor,
    estimatedPrice: calculatePrice(flowers),
    name: `Buchet personalizat (${totalStems} fire)`
  })
  navigate('/cart')
}
```

---

## TASK 6 — Pagini legale (Cookie Policy & Terms)

**Prioritate: Scăzută · Timp estimat: 30 minute**

> Profesorul a menționat că pentru un proiect pur academic nu e obligatoriu. Include-le totuși — arată profesionalim și înțelegerea contextului real de business.

### Ce trebuie făcut

Două pagini statice simple, fără backend.

### `client/src/pages/CookiePolicy.jsx`

Conținut minimal dar realist:
```
FloriShop folosește cookie-uri pentru:
- Autentificare (session token JWT stocat în localStorage)  
- Coș de cumpărături (stocat în localStorage)
- Preferințele builderului de buchete (stocat în localStorage)

Nu folosim cookie-uri de tracking sau advertising third-party.
```

### `client/src/pages/TermsAndConditions.jsx`

Conținut minimal:
```
- Comenzile sunt prelucrate în 24h
- Livrare disponibilă în Cluj-Napoca și împrejurimi
- Drept de retur în 24h de la livrare pentru produse deteriorate
- Prețurile includ TVA
```

### Banner cookie (opțional dar arată bine)

Adaugă în `App.jsx` un banner simplu care apare dacă `localStorage.getItem('cookiesAccepted')` nu există:

```jsx
function CookieBanner() {
  const [visible, setVisible] = useState(!localStorage.getItem('cookiesAccepted'))
  
  if (!visible) return null
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-800 text-white px-6 py-4 flex items-center justify-between gap-4">
      <p className="text-sm">
        Folosim cookie-uri pentru a-ți oferi o experiență mai bună.{' '}
        <Link to="/cookie-policy" className="underline">Află mai multe</Link>
      </p>
      <button
        onClick={() => { localStorage.setItem('cookiesAccepted', 'true'); setVisible(false) }}
        className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-1.5 rounded-lg text-sm flex-shrink-0"
      >
        Accept
      </button>
    </div>
  )
}
```

### Routing și Footer

```jsx
<Route path="/cookie-policy" element={<CookiePolicy />} />
<Route path="/terms" element={<TermsAndConditions />} />
```

În `Footer.jsx`, adaugă linkuri:
```jsx
<Link to="/cookie-policy">Cookie Policy</Link>
<Link to="/terms">Termeni și Condiții</Link>
```

---

## TASK 7 — SSR (Server-Side Rendering) pentru SEO

**Prioritate: Scăzută pentru proiect academic · Timp estimat: 4-8 ore (schimbare majoră)**

> Profesorul a explicat corect: SSR ajută la indexarea paginilor de produse pe Google. Pentru un proiect academic evaluat în 10 minute, **nu e prioritar** și riscă să introducă buguri. Implementează-l DOAR dacă celelalte task-uri sunt complete și stabile.

### Abordarea recomandată: migrare la Vite SSR (fără Next.js)

Nu migra la Next.js — ar necesita rescrierea rutingului și structurii. Folosește în schimb **Vite SSR** care funcționează cu același cod React.

### Ce pagini beneficiază de SSR

Doar paginile publice care trebuie indexate:
- `/` — Home
- `/catalog` — lista produse
- `/products/:id` — detalii produs

Paginile private (cart, checkout, profile, my-orders) rămân SPA normale.

### Implementare minimă

1. Instalează `@vitejs/plugin-react` (deja ai) și configurează entry points separate:
   - `client/src/entry-client.jsx` — hydration în browser
   - `client/src/entry-server.jsx` — `renderToString` din `react-dom/server`
   
2. Modifică `client/index.html` pentru a include placeholder `<!--ssr-outlet-->`.

3. Creează `client/server.js` — un server Express mic care:
   - Servește paginile SSR pentru rutele publice
   - Returnează SPA normal pentru rutele private

4. Actualizează Render.com să ruleze `client/server.js` în loc de a servi static.

> **Notă importantă pentru agent:** Dacă implementezi SSR, testează că login-ul, cart-ul și builder-ul funcționează corect după hydration. Erorile de hydration sunt greu de debugat.

---

## Ordinea de implementare

```
FAZA 1 — Quick wins (fă-le primele, nu pot sparge nimic)
  □ TASK 1 — Favicon
  □ TASK 2 — Toast la register

FAZA 2 — Funcționalități noi (backend + frontend)  
  □ TASK 3 — Lista comenzilor mele (/my-orders)
  □ TASK 4 — Pagina de profil (/profile)

FAZA 3 — UX îmbunătățit
  □ TASK 5 — Editare buchet din coș

FAZA 4 — Legal și polish
  □ TASK 6 — Pagini Cookie Policy & Terms + banner

FAZA 5 — Doar dacă e timp (risc ridicat de breaking changes)
  □ TASK 7 — SSR
```

---

## Verificare după implementare

```
□ Favicon apare în tab-ul browser la petunia.page
□ La register apare toast verde, apoi redirect după 2 secunde
□ /my-orders afișează comenzile utilizatorului logat
□ /my-orders redirecționează dacă nu ești logat
□ /profile afișează datele userului și permite editarea numelui
□ Schimbarea parolei funcționează și invalideaza sesiunea curentă dacă vrei
□ Click "Editează buchetul" din coș deschide Builder cu florile pre-selectate
□ Modificarea în Builder și "Actualizează în coș" reflectă schimbările în coș
□ /cookie-policy și /terms sunt accesibile și apar în footer
□ Banner cookie apare la prima vizită și dispare după accept
□ Nimic din ce funcționa înainte nu s-a spart
```

---

*FloriShop — echipa MiniTehnicus*
*Actualizare post-feedback profesor*
