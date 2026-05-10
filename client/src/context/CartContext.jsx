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
    const existing = cartItems.find((entry) => entry.productId === item.productId)
    if (existing) {
      const updated = cartItems.map((entry) =>
        entry.productId === item.productId
          ? { ...entry, quantity: entry.quantity + (item.quantity || 1) }
          : entry
      )
      persist(updated)
      return
    }

    persist([...cartItems, { ...item, quantity: item.quantity || 1 }])
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
