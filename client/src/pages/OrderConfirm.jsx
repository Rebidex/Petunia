import { Link, useLocation } from 'react-router-dom'

const OrderConfirm = () => {
  const location = useLocation()
  const orderId = location.state?.orderId

  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center shadow-sm">
      <h1 className="mb-3 text-3xl font-extrabold text-emerald-700">Comanda confirmata</h1>
      <p className="text-slate-700">Multumim! Comanda ta a fost inregistrata cu succes.</p>
      {orderId && <p className="mt-2 text-sm text-slate-600">ID comanda: {orderId}</p>}
      <Link to="/catalog" className="mt-5 inline-block rounded-lg bg-pink-500 px-5 py-2 font-semibold text-white">
        Continua cumparaturile
      </Link>
    </div>
  )
}

export default OrderConfirm
