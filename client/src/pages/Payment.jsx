import { useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const Payment = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { pendingOrder, clearCart } = useCart()

  const order = location.state?.order || pendingOrder

  if (!order) {
    return <p className="text-slate-600">Nu exista o comanda in asteptare.</p>
  }

  const handleConfirm = () => {
    clearCart()
    navigate('/order-confirm', { state: { orderId: order.id } })
  }

  return (
    <div className="mx-auto max-w-2xl rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
      <h1 className="mb-4 text-2xl font-bold text-slate-800">Plata (mock)</h1>
      <div className="space-y-3 rounded-lg bg-slate-50 p-4">
        <p className="font-semibold text-slate-700">Comanda: {order.id}</p>
        <ul className="space-y-1 text-sm text-slate-600">
          {order.items.map((item) => (
            <li key={`${item.productId}-${item.name}`}>
              {item.name} - {item.quantity} x {item.price} RON
            </li>
          ))}
        </ul>
        <p className="text-lg font-bold text-pink-600">Total: {order.totalPrice.toFixed(2)} RON</p>
      </div>

      <button
        onClick={handleConfirm}
        className="mt-5 w-full rounded-lg bg-emerald-500 py-3 text-lg font-bold text-white hover:bg-emerald-600"
      >
        Confirma si Plateste
      </button>
    </div>
  )
}

export default Payment
