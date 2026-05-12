import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import FlowerChip from '../components/FlowerChip'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import api from '../api/axios'

const flowerOptions = [
  { name: 'Trandafir rosu', price: 7.5, color: '#e63946' },
  { name: 'Trandafir alb', price: 7.5, color: '#f1faee' },
  { name: 'Lalea', price: 5, color: '#ffd6a5' },
  { name: 'Crizantema', price: 4, color: '#ffb703' },
  { name: 'Bujor', price: 9, color: '#ffafcc' },
  { name: 'Iris', price: 6, color: '#4361ee' },
  { name: 'Eucalipt', price: 3, color: '#84a98c' },
  { name: 'Gypsophila', price: 4, color: '#adb5bd' }
]

const wrapColors = ['#f8edeb', '#ffd6e0', '#fefae0', '#e5f4e3', '#dfe7fd', '#faedcd', '#f1c0e8']

const getDefaultState = () => ({
  flowers: flowerOptions.reduce((acc, flower) => ({ ...acc, [flower.name]: 0 }), {}),
  wrapColor: wrapColors[0]
})

const buildFlowersState = (flowers) => {
  const nextFlowers = flowerOptions.reduce((acc, flower) => ({ ...acc, [flower.name]: 0 }), {})
  if (!Array.isArray(flowers)) {
    return nextFlowers
  }

  flowers.forEach((item) => {
    if (item?.flower) {
      const qty = Number(item.quantity)
      nextFlowers[item.flower] = Number.isFinite(qty) ? qty : 0
    }
  })

  return nextFlowers
}

const Builder = () => {
  const { isAuthenticated } = useAuth()
  const { addToCart, updateCartItem } = useCart()
  const location = useLocation()
  const navigate = useNavigate()
  const [state, setState] = useState(getDefaultState)
  const [name, setName] = useState('Buchet personalizat Petunia')
  const [message, setMessage] = useState('')
  const [editingCartId, setEditingCartId] = useState(null)

  useEffect(() => {
    if (location.state?.editCartId) {
      setEditingCartId(location.state.editCartId)
      setName(location.state.name || 'Buchet personalizat Petunia')
      setState({
        flowers: buildFlowersState(location.state.flowers),
        wrapColor: location.state.wrapColor || wrapColors[0]
      })
      return
    }

    const raw = localStorage.getItem('builderState')
    if (!raw) return

    try {
      const parsed = JSON.parse(raw)
      setState((prev) => ({
        flowers: { ...prev.flowers, ...(parsed.flowers || {}) },
        wrapColor: parsed.wrapColor || prev.wrapColor
      }))
    } catch {
      setState(getDefaultState())
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('builderState', JSON.stringify(state))
  }, [state])

  const selectedFlowers = useMemo(
    () =>
      flowerOptions
        .filter((flower) => state.flowers[flower.name] > 0)
        .map((flower) => ({
          flower: flower.name,
          quantity: state.flowers[flower.name],
          color: flower.color,
          price: flower.price
        })),
    [state.flowers]
  )

  const totalStems = selectedFlowers.reduce((sum, item) => sum + item.quantity, 0)
  const estimatedPrice = selectedFlowers.reduce((sum, item) => sum + item.quantity * item.price, 0)

  const updateQty = (flowerName, delta) => {
    setState((prev) => ({
      ...prev,
      flowers: {
        ...prev.flowers,
        [flowerName]: Math.max(0, (prev.flowers[flowerName] || 0) + delta)
      }
    }))
  }

  const handleSaveBouquet = async () => {
    setMessage('')

    if (selectedFlowers.length === 0) {
      setMessage('Selecteaza cel putin o floare.')
      return
    }

    if (isAuthenticated) {
      try {
        await api.post('/bouquets', {
          name,
          flowers: selectedFlowers.map((item) => ({
            flower: item.flower,
            quantity: item.quantity,
            color: item.color
          })),
          wrapColor: state.wrapColor,
          totalStems,
          estimatedPrice
        })
        setMessage('Buchetul a fost salvat in contul tau.')
      } catch {
        setMessage('Nu s-a putut salva buchetul.')
      }
      return
    }

    addToCart({
      productId: `custom-${Date.now()}`,
      name,
      price: Number(estimatedPrice.toFixed(2)),
      quantity: 1,
      type: 'custom-bouquet',
      flowers: selectedFlowers,
      wrapColor: state.wrapColor
    })
    setMessage('Nu esti logat, buchetul a fost adaugat in cos.')
  }

  const handleAddToCart = () => {
    if (selectedFlowers.length === 0) {
      setMessage('Selecteaza cel putin o floare.')
      return
    }

    addToCart({
      productId: `custom-${Date.now()}`,
      name,
      price: Number(estimatedPrice.toFixed(2)),
      quantity: 1,
      type: 'custom-bouquet',
      flowers: selectedFlowers,
      wrapColor: state.wrapColor
    })
    setMessage('Buchetul custom a fost adaugat in cos.')
  }

  const handleUpdateCart = () => {
    setMessage('')

    if (selectedFlowers.length === 0) {
      setMessage('Selecteaza cel putin o floare.')
      return
    }

    updateCartItem(editingCartId, {
      name: name || `Buchet personalizat (${totalStems} fire)`,
      price: Number(estimatedPrice.toFixed(2)),
      flowers: selectedFlowers,
      wrapColor: state.wrapColor,
      type: 'custom-bouquet'
    })

    navigate('/cart')
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <section className="space-y-4 lg:col-span-2">
        <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
          <label className="mb-2 block text-sm font-semibold text-slate-700">Nume buchet</label>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </div>

        <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
          <h1 className="mb-3 text-2xl font-bold text-slate-800">Builder Buchet Petunia</h1>
          <div className="grid gap-3 sm:grid-cols-2">
            {flowerOptions.map((flower) => (
              <FlowerChip
                key={flower.name}
                flower={flower}
                quantity={state.flowers[flower.name] || 0}
                onInc={() => updateQty(flower.name, 1)}
                onDec={() => updateQty(flower.name, -1)}
              />
            ))}
          </div>
        </div>
      </section>

      <aside className="space-y-4">
        <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
          <p className="mb-2 text-sm font-semibold text-slate-700">Culoare ambalaj</p>
          <div className="flex flex-wrap gap-2">
            {wrapColors.map((color) => (
              <button
                key={color}
                onClick={() => setState((prev) => ({ ...prev, wrapColor: color }))}
                className={`h-8 w-8 rounded-full border-2 ${
                  state.wrapColor === color ? 'border-slate-800' : 'border-slate-200'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm" style={{ background: state.wrapColor }}>
          <h2 className="mb-2 text-lg font-bold text-slate-800">Preview live</h2>
          {selectedFlowers.length === 0 ? (
            <p className="text-sm text-slate-600">Nicio floare selectata.</p>
          ) : (
            <ul className="space-y-1 text-sm text-slate-700">
              {selectedFlowers.map((item) => (
                <li key={item.flower}>
                  {item.flower}: {item.quantity} x {item.price} RON
                </li>
              ))}
            </ul>
          )}
          <div className="mt-3 border-t border-slate-300 pt-2 text-sm font-semibold text-slate-900">
            <p>Total fire: {totalStems}</p>
            <p>Pret estimat: {estimatedPrice.toFixed(2)} RON</p>
          </div>
        </div>

        <button
          onClick={handleSaveBouquet}
          className="w-full rounded-lg border border-pink-500 px-4 py-2 font-semibold text-pink-600 hover:bg-pink-50"
        >
          Salveaza buchetul
        </button>
        {editingCartId ? (
          <button
            onClick={handleUpdateCart}
            className="w-full rounded-lg bg-pink-500 px-4 py-2 font-semibold text-white hover:bg-pink-600"
          >
            Actualizeaza in cos
          </button>
        ) : (
          <button
            onClick={handleAddToCart}
            className="w-full rounded-lg bg-pink-500 px-4 py-2 font-semibold text-white hover:bg-pink-600"
          >
            Adauga in cos
          </button>
        )}

        {message && <p className="text-sm text-slate-600">{message}</p>}
      </aside>
    </div>
  )
}

export default Builder
