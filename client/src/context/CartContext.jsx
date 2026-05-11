import { createContext, useContext, useMemo, useState } from 'react'

const CartContext = createContext(null)

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const rawCart = localStorage.getItem('cart')
    return rawCart ? JSON.parse(rawCart) : []
  })
  const [pendingOrder, setPendingOrder] = useState(null)

  const persist = (nextItems) => {
    setCartItems(nextItems)
    localStorage.setItem('cart', JSON.stringify(nextItems))
  }

  const addToCart = (item) => {
    const requestedQty = item.quantity || 1
    const stockLimit = Number.isFinite(item.stock) ? item.stock : null
    const existing = cartItems.find((entry) => entry.productId === item.productId)

    if (existing) {
      const nextQty = existing.quantity + requestedQty
      const finalQty = stockLimit != null ? Math.min(nextQty, stockLimit) : nextQty
      if (stockLimit != null && finalQty <= 0) return
      const updated = cartItems.map((entry) =>
        entry.productId === item.productId ? { ...entry, quantity: finalQty } : entry
      )
      persist(updated)
      return
    }

    if (stockLimit != null && stockLimit <= 0) return
    const initialQty = stockLimit != null ? Math.min(requestedQty, stockLimit) : requestedQty
    persist([...cartItems, { ...item, quantity: initialQty }])
  }

  const removeFromCart = (productId) => {
    persist(cartItems.filter((item) => item.productId !== productId))
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
