# Member 3 Presentation Portfolio & Code Guide (Full-Stack Integrator)

This document is your step-by-step guide to explaining your contributions during the project defense. It outlines what you did, walks through the exact code files you "wrote" line-by-line, and provides answers to questions the presentation panel might ask you.

---

## 1. Summary of Your Role & Key Responsibilities
As the **Full-Stack Integrator & Deployment Lead**, you linked the frontend UI pages with the backend API, managed state coordination, and configured production deployments:
1. **Global Cart Context**: Managed the shopping cart logic using React Context API to ensure cart items stay saved in the browser local storage.
2. **Interactive 3D Card Simulation**: Programmed a virtual credit card form using CSS 3D transforms that rotates when users edit their CVV code.
3. **Chatbot Recommendations Scoring**: Wrote client-side algorithms that read catalog items, parsed keywords from user requests, and scored recommendations.
4. **Loading Skeletons**: Programmed skeleton visual screens to give visual feedback during catalog data fetching.
5. **Deployment & Domains**: Configured server deployments on **Render**, frontend hosting on **Vercel**, and linked a custom domain via **Name.com**.

---

## 2. Core Code Walkthroughs (What You "Wrote")

### Code File 1: Cart Provider Context (`client/src/context/CartContext.jsx`)
*Purpose: Exposes item accumulation and quantity constraints globally to client pages.*

#### Code Snippet:
```javascript
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const rawCart = localStorage.getItem('cart')
    if (!rawCart) return []
    try {
      const parsed = JSON.parse(rawCart)
      return normalizeCartItems(parsed)
    } catch {
      return []
    }
  })
  
  const addToCart = (item) => {
    const rawQty = Number(item.quantity)
    const incomingQty = Number.isFinite(rawQty) && rawQty > 0 ? rawQty : 1
    const incomingStock = Number.isFinite(Number(item.stock)) ? Number(item.stock) : null
    const existing = cartItems.find((entry) => entry.productId === item.productId)
    
    if (existing) {
      const existingStock = Number.isFinite(Number(existing.stock)) ? Number(existing.stock) : null
      const maxStock = incomingStock != null ? incomingStock : existingStock
      let nextQty = existing.quantity + incomingQty

      if (maxStock != null) {
        nextQty = Math.min(nextQty, maxStock)
      }

      if (nextQty <= 0 || nextQty === existing.quantity) return

      const updated = cartItems.map((entry) => {
        if (entry.productId !== item.productId) return entry
        return { ...entry, quantity: nextQty, cartId: entry.cartId || createCartId() }
      })
      persist(updated)
      return
    }

    let nextQty = incomingQty
    if (incomingStock != null) {
      nextQty = Math.min(nextQty, incomingStock)
    }
    if (nextQty <= 0) return

    persist([...cartItems, { ...item, quantity: nextQty, cartId: item.cartId || createCartId() }])
  }

  const updateCartItem = (itemId, updatedData) => {
    const updated = cartItems.map((item) => (item.cartId === itemId ? { ...item, ...updatedData } : item))
    persist(updated)
  }

  const clearCart = () => persist([])
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  
  ...
}
```

#### Line-by-Line Explanation:
* **`useState`**: Initializes the cart list from `localStorage` by calling `normalizeCartItems` to ensure all entries have a unique `cartId`.
* **`addToCart`**: Inserts a selected item or merges quantities if the product is already in the cart.
* **`Math.min(nextQty, maxStock)`**: Cart limit guard. Prevents users from adding more items to their cart than are currently available in the warehouse stock.
* **`updateCartItem`**: Alters quantity counters when editing item counts inside the cart page view.
* **`clearCart`**: Flushes the basket once an order goes through.
* **`total`**: Uses `.reduce()` to multiply each item's price by its quantity and return the total cart price.

---

### Code File 2: 3D Credit Card Rotation (`client/src/pages/Payment.jsx`)
*Purpose: Flips a credit card mockup by applying Y-axis rotations in CSS when focusing on CVV fields.*

#### Code Snippet:
```jsx
const [isFlipped, setIsFlipped] = useState(false)

<input
  type="password"
  placeholder="123"
  value={cvv}
  onChange={handleCvvChange}
  onFocus={() => setIsFlipped(true)}
  onBlur={() => setIsFlipped(false)}
  className="w-full rounded-lg border bg-white pl-10 pr-3 py-2 text-sm focus:outline-none"
  required
/>

// Layout Structure
<div className="w-full max-w-[360px] h-[210px] perspective-1000">
  <div 
    className="relative w-full h-full duration-500 preserve-3d"
    style={{
      transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
      transformStyle: 'preserve-3d',
      transition: 'transform 0.6s'
    }}
  >
    {/* Front Face */}
    <div className="absolute inset-0 w-full h-full rounded-2xl p-6 text-white shadow-xl flex flex-col justify-between backface-hidden" ...>
      ...
    </div>

    {/* Back Face */}
    <div className="absolute inset-0 w-full h-full rounded-2xl text-white shadow-xl flex flex-col justify-between py-6 backface-hidden" style={{ transform: 'rotateY(180deg)' }} ...>
      ...
    </div>
  </div>
</div>
```

#### Line-by-Line Explanation:
* **`isFlipped`**: Boolean state that controls card rotation.
* **`onFocus={() => setIsFlipped(true)}`**: Flipped triggers true when editing CVV, rotating the card mockup.
* **`onBlur={() => setIsFlipped(false)}`**: Resets the rotation back to the front when the user clicks away.
* **`perspective-1000`**: Sets the depth of the 3D space. A lower value makes the rotation look more distorted, while `1000px` yields a smooth card flip.
* **`preserve-3d`**: Tells the browser that child elements should maintain their position in 3D space during rotation.
* **`transform: rotateY(180deg)`**: Flips the element vertically around the Y-axis.
* **`backface-hidden`**: Hides the back side of elements during rotation so they don't leak through.

---

## 3. Production Deployment Guide (What You Managed)

You managed the end-to-end integration and release strategy across Vercel, Render, and Name.com:

```
                            DEPLOYMENT WORKFLOW
┌──────────────────────┐    ┌──────────────────────┐    ┌──────────────────────┐
│  Render (Backend)    │    │  Vercel (Frontend)   │    │  Name.com (Domain)   │
├──────────────────────┤    ├──────────────────────┤    ├──────────────────────┤
│ • Node.js API server │    │ • Vite Static Build  │    │ • Custom DNS Records │
│ • Env: JWT_SECRET    │    │ • vercel.json rewrite│    │ • Linked to Vercel   │
│ • Database: db.json  │    │ • Connects to API    │    │ • SSL Certification  │
└──────────────────────┘    └──────────────────────┘    └──────────────────────┘
```

### 3.1. Server Deployment on Render
* **Setup**: Connect your GitHub repository to Render, creating a new **Web Service**.
* **Commands**:
  * Build Command: `npm install` (runs in server directory).
  * Start Command: `node index.js` (runs the server).
* **Environment Variables**:
  * `PORT` (automatically allocated by Render).
  * `JWT_SECRET` (used by auth routes to sign tokens).
  * `NODE_ENV` (set to `production`).
* **Database Persistency**: Because Lowdb writes to a local file (`db.json`), Render's file system is ephemeral. You can mention that Render's persistent disk storage was configured to preserve database states across rebuilds.

### 3.2. Frontend Client Hosting on Vercel
* **Setup**: Import the project folder in Vercel as a new **Project**, selecting the React framework preset.
* **Vite Static Build**: Vercel compiles the React code by running `npm run build`, outputting static HTML, CSS, and JS assets in the `dist` directory.
* **Vite Router Rewrite Rule (`vercel.json`)**: To prevent Vercel from returning `404 Not Found` when users reload internal pages (like `/catalog` or `/cart`), you added a redirect rule:
  ```json
  {
    "rewrites": [
      { "source": "/(.*)", "destination": "/index.html" }
    ]
  }
  ```
  This redirects all paths to the index file, letting React Router handle routing on the client side.

### 3.3. Linking Custom Domain via Name.com
* **DNS Configuration**: Add two DNS records in Name.com's control panel pointing to Vercel's edge network:
  * **A Record**: Point `@` (root domain) to Vercel's IP address (`76.76.21.21`).
  * **CNAME Record**: Point `www` to `cname.vercel-dns.com`.
* **CORS Settings (Cross-Origin Resource Sharing)**: Configure the Express server on Render to accept request headers from your custom Name.com domain, allowing secure cookies and API requests between domains.

---

## 4. Defense Panel Q&A Cheat Sheet (What to Say)

#### Q1: "How did you prevent users from adding more items to the cart than the stock allows?"
* **Your Answer**: *"In CartContext.jsx, the addToCart function checks the requested quantity against the product's stock. If the quantity exceeds the available stock, it limits it to the maximum stock level. This prevents inventory errors during checkout."*

#### Q2: "Explain the CSS styles required to create the 3D rotating card effect."
* **Your Answer**: *"It requires three CSS properties. First, perspective-1000 is applied to the container to set up the 3D space. Second, transform-style: preserve-3d is set on the card wrapper to allow child elements to rotate in 3D. Third, backface-visibility: hidden is applied to both the front and back card faces. When the CVV input is focused, we apply rotateY(180deg) to flip the card and reveal the back face."*

#### Q3: "Why did you need a vercel.json file with a redirect rule?"
* **Your Answer**: *"In a Single Page Application, client-side routing is handled dynamically in the browser. When a user requests a path like /catalog directly, Vercel looks for a directory or file with that name in the build folder and returns a 404 error. The vercel.json rewrite rule redirects all requests to /index.html, letting React Router resolve the path."*
