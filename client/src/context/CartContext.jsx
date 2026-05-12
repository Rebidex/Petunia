import { createContext, useContext, useMemo, useState } from 'react'

const createCartId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `cart-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

const normalizeCartItems = (items) => {
  if (!Array.isArray(items)) {
    return []
  }

  let changed = false
  const normalized = items.map((item) => {
    if (item?.cartId) {
      return item
    }
    changed = true
    return { ...item, cartId: createCartId() }
  })

  if (changed) {
    localStorage.setItem('cart', JSON.stringify(normalized))
  }

  return normalized
}

const CartContext = createContext(null)

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const rawCart = localStorage.getItem('cart')
    if (!rawCart) {
      return []
    }

    try {
      const parsed = JSON.parse(rawCart)
      return normalizeCartItems(parsed)
    } catch {
      return []
    }
  })
  const [pendingOrder, setPendingOrder] = useState(null)

  const persist = (nextItems) => {
    setCartItems(nextItems)
    localStorage.setItem('cart', JSON.stringify(nextItems))
  }

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

      if (nextQty <= 0 || nextQty === existing.quantity) {
        return
      }

      const updated = cartItems.map((entry) => {
        if (entry.productId !== item.productId) {
          return entry
        }

        const nextEntry = { ...entry, quantity: nextQty, cartId: entry.cartId || createCartId() }
        if (incomingStock != null) {
          nextEntry.stock = incomingStock
        }

        return nextEntry
      })
      persist(updated)
      return
    }

    let nextQty = incomingQty
    if (incomingStock != null) {
      nextQty = Math.min(nextQty, incomingStock)
    }

    if (nextQty <= 0) {
      return
    }

    const nextItem = { ...item, quantity: nextQty, cartId: item.cartId || createCartId() }
    if (incomingStock != null) {
      nextItem.stock = incomingStock
    }

    persist([...cartItems, nextItem])
  }

  const removeFromCart = (cartId) => {
    persist(cartItems.filter((item) => item.cartId !== cartId))
  }

  const updateCartItem = (itemId, updatedData) => {
    const updated = cartItems.map((item) => (item.cartId === itemId ? { ...item, ...updatedData } : item))
    persist(updated)
  }

  const clearCart = () => {
    persist([])
  }

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const value = useMemo(
    () => ({
      cartItems,
      addToCart,
      removeFromCart,
      updateCartItem,
      clearCart,
      total,
      pendingOrder,
      setPendingOrder
    }),
    [cartItems, total, pendingOrder]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart trebuie folosit in CartProvider')
  }
  return context
}
