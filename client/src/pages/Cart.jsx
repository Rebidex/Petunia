import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const Cart = () => {
  const navigate = useNavigate()
  const { cartItems, removeFromCart, total } = useCart()

  if (cartItems.length === 0) {
    return (
      <div className="rounded-xl border border-slate-100 bg-white p-6 text-center shadow-sm">
        <p className="mb-4 text-slate-600">Cosul este gol.</p>
        <Link to="/catalog" className="rounded-lg bg-pink-500 px-4 py-2 font-semibold text-white">
          Vezi produse
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-800">Cosul meu</h1>
      <div className="space-y-3">
        {cartItems.map((item) => (
          <div key={item.cartId || item.productId} className="flex items-center justify-between rounded-xl border bg-white p-4">
            <div className="space-y-1">
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-slate-500">
                {item.quantity} x {item.price} RON
              </p>
              {item.type === 'custom-bouquet' && (
                <button
                  onClick={() =>
                    navigate('/builder', {
                      state: {
                        editCartId: item.cartId,
                        flowers: item.flowers,
                        wrapColor: item.wrapColor,
                        name: item.name
                      }
                    })
                  }
                  className="text-sm font-medium text-pink-500 underline hover:text-pink-700"
                >
                  Editeaza buchetul
                </button>
              )}
            </div>
            <button
              onClick={() => removeFromCart(item.cartId)}
              className="rounded-md border border-slate-300 px-3 py-1 text-sm"
            >
              Sterge
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between rounded-xl bg-slate-900 p-4 text-white">
        <p className="text-lg font-bold">Total: {total.toFixed(2)} RON</p>
        <Link to="/checkout" className="rounded-lg bg-emerald-400 px-4 py-2 font-semibold text-slate-900">
          Continua la checkout
        </Link>
      </div>
    </div>
  )
}

export default Cart
