import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useCart } from '../context/CartContext'

const phoneRegex = /^(\+4|0)?7\d{8}$/

const Checkout = () => {
  const navigate = useNavigate()
  const { cartItems, total, setPendingOrder } = useCart()
  const [form, setForm] = useState({
    customerName: '',
    customerPhone: '',
    deliveryAddress: '',
    deliveryDate: '',
    note: ''
  })
  const [error, setError] = useState('')

  const minDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!phoneRegex.test(form.customerPhone)) {
      setError('Telefon invalid (format RO)')
      return
    }

    if (cartItems.length === 0) {
      setError('Cosul este gol')
      return
    }

    try {
      const response = await api.post('/orders', {
        ...form,
        items: cartItems.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        totalPrice: Number(total.toFixed(2))
      })

      setPendingOrder(response.data.order)
      navigate('/payment', { state: { order: response.data.order } })
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Nu s-a putut plasa comanda')
    }
  }

  return (
    <div className="mx-auto max-w-2xl rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
      <h1 className="mb-4 text-2xl font-bold text-slate-800">Checkout</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nume complet"
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
          required
          value={form.customerName}
          onChange={(event) => setForm((prev) => ({ ...prev, customerName: event.target.value }))}
        />
        <input
          type="tel"
          placeholder="Telefon"
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
          required
          value={form.customerPhone}
          onChange={(event) => setForm((prev) => ({ ...prev, customerPhone: event.target.value }))}
        />
        <textarea
          placeholder="Adresa de livrare"
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
          required
          value={form.deliveryAddress}
          onChange={(event) => setForm((prev) => ({ ...prev, deliveryAddress: event.target.value }))}
        />
        <input
          type="date"
          min={minDate}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
          required
          value={form.deliveryDate}
          onChange={(event) => setForm((prev) => ({ ...prev, deliveryDate: event.target.value }))}
        />
        <textarea
          placeholder="Nota optionala"
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
          value={form.note}
          onChange={(event) => setForm((prev) => ({ ...prev, note: event.target.value }))}
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button className="w-full rounded-lg bg-pink-500 py-2 font-semibold text-white hover:bg-pink-600">
          Trimite catre plata
        </button>
      </form>
    </div>
  )
}

export default Checkout
