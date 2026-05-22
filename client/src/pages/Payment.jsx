import { useState, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { CreditCard, ShieldCheck, Calendar, User, Eye, EyeOff } from 'lucide-react'
import Toast from '../components/Toast'
import { useToast } from '../hooks/useToast'

const Payment = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { pendingOrder, clearCart } = useCart()
  const { toast, showToast, hideToast } = useToast()

  const order = location.state?.order || pendingOrder

  const [cardNumber, setCardNumber] = useState('')
  const [cardHolder, setCardHolder] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [isFlipped, setIsFlipped] = useState(false)
  
  const [processing, setProcessing] = useState(false)
  const [errors, setErrors] = useState({})

  if (!order) {
    return (
      <div className="mx-auto max-w-md p-6 text-center animate-page">
        <p className="text-slate-600 dark:text-slate-400">Nu exista o comanda in asteptare.</p>
        <button 
          onClick={() => navigate('/catalog')}
          className="mt-4 rounded-lg bg-pink-500 px-4 py-2 font-semibold text-white hover:bg-pink-600 transition-colors"
        >
          Inapoi la Catalog
        </button>
      </div>
    )
  }

  // Detect card brand based on first digit
  const getCardType = (num) => {
    const cleanNum = num.replace(/\D/g, '')
    if (cleanNum.startsWith('4')) return 'Visa'
    if (cleanNum.startsWith('5')) return 'Mastercard'
    if (cleanNum.startsWith('3')) return 'American Express'
    return 'Petunia Card'
  }

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length > 0) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value)
    if (formatted.replace(/\s/g, '').length <= 16) {
      setCardNumber(formatted)
      if (errors.cardNumber) {
        setErrors(prev => ({ ...prev, cardNumber: '' }))
      }
    }
  }

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, '')
    if (value.length >= 2) {
      const month = value.slice(0, 2)
      const year = value.slice(2, 4)
      value = `${month}/${year}`
    }
    if (value.length <= 5) {
      setExpiry(value)
      if (errors.expiry) {
        setErrors(prev => ({ ...prev, expiry: '' }))
      }
    }
  }

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    if (value.length <= 3) {
      setCvv(value)
      if (errors.cvv) {
        setErrors(prev => ({ ...prev, cvv: '' }))
      }
    }
  }

  const validateForm = () => {
    const tempErrors = {}
    const cleanNumber = cardNumber.replace(/\s/g, '')
    
    if (cleanNumber.length !== 16) {
      tempErrors.cardNumber = 'Numarul cardului trebuie sa contina 16 cifre.'
    }
    
    if (cardHolder.trim().length < 3) {
      tempErrors.cardHolder = 'Numele titularului este obligatoriu (minim 3 caractere).'
    }

    const expiryRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/
    if (!expiryRegex.test(expiry)) {
      tempErrors.expiry = 'Formatul datei de expirare trebuie sa fie MM/YY.'
    } else {
      const now = new Date()
      const currentMonth = now.getMonth() + 1
      const currentYear = now.getFullYear() % 100 // Last 2 digits
      
      const [expMonth, expYear] = expiry.split('/').map(Number)
      if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
        tempErrors.expiry = 'Cardul este expirat.'
      }
    }

    if (cvv.length !== 3) {
      tempErrors.cvv = 'Codul CVV/CVC trebuie sa aiba exact 3 cifre.'
    }

    setErrors(tempErrors)
    return Object.keys(tempErrors).length === 0
  }

  const handlePayment = (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setProcessing(true)

    setTimeout(() => {
      setProcessing(false)
      clearCart()
      navigate('/order-confirm', { state: { orderId: order.id } })
    }, 2500)
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 animate-page">
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
      
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Visual Card Section */}
        <div className="flex flex-col items-center justify-start space-y-8">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 w-full text-left">
            Card Bancar
          </h2>
          
          {/* Card Mockup Wrapper (3D effect) */}
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
              <div 
                className="absolute inset-0 w-full h-full rounded-2xl p-6 text-white shadow-xl flex flex-col justify-between backface-hidden"
                style={{
                  background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #db2777 100%)',
                  backfaceVisibility: 'hidden'
                }}
              >
                <div className="flex justify-between items-center">
                  {/* Card Chip */}
                  <div className="w-12 h-9 bg-yellow-400/90 rounded-md flex flex-col justify-around p-1 shadow-inner opacity-90">
                    <div className="w-full h-px bg-slate-900/20" />
                    <div className="w-full h-px bg-slate-900/20" />
                    <div className="w-full h-px bg-slate-900/20" />
                  </div>
                  <span className="font-semibold text-lg italic tracking-wider opacity-90 drop-shadow-sm">
                    {getCardType(cardNumber)}
                  </span>
                </div>

                <div className="text-xl md:text-2xl font-mono tracking-widest text-center my-4 drop-shadow">
                  {cardNumber || '•••• •••• •••• ••••'}
                </div>

                <div className="flex justify-between items-end">
                  <div className="truncate pr-4 max-w-[200px]">
                    <span className="text-[10px] uppercase opacity-70 block">Titular card</span>
                    <span className="font-semibold tracking-wide truncate block text-sm">
                      {cardHolder.toUpperCase() || 'NUME PRENUME'}
                    </span>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <span className="text-[10px] uppercase opacity-70 block">Expira</span>
                    <span className="font-semibold tracking-wide text-sm">
                      {expiry || 'MM/YY'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Back Face */}
              <div 
                className="absolute inset-0 w-full h-full rounded-2xl text-white shadow-xl flex flex-col justify-between py-6 backface-hidden"
                style={{
                  background: 'linear-gradient(135deg, #7c3aed 0%, #be185d 100%)',
                  transform: 'rotateY(180deg)',
                  backfaceVisibility: 'hidden'
                }}
              >
                <div className="w-full h-11 bg-slate-950 mt-1 opacity-90" />
                
                <div className="px-6 flex flex-col space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-grow h-8 bg-white/80 rounded flex items-center justify-end px-3 text-slate-900 font-mono tracking-wider italic text-sm">
                      {cvv ? '•'.repeat(cvv.length) : '•••'}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-[8px] uppercase opacity-70 block">CVV/CVC</span>
                      <span className="font-semibold text-xs text-yellow-300">SECURE</span>
                    </div>
                  </div>
                  
                  <p className="text-[9px] leading-tight text-white/70">
                    Aceasta este o tranzactie securizata de proba. Nu introduceti datele reale ale cardului dumneavoastra. Utilizati date fictive (ex. 16 cifre aleatorii care incep cu 4) pentru a simula tranzactia.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Safe payment details box */}
          <div className="w-full max-w-[360px] rounded-xl border border-slate-100 bg-slate-50 dark:bg-slate-900/50 dark:border-slate-800 p-4 space-y-2 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>Simulare Plata Securizata</span>
            </div>
            <p>Sistemul de testare valideaza regulile reale de format pentru carduri (16 cifre, luna 01-12, an viitor si CVV de 3 cifre), insa tranzactia este fictiva.</p>
          </div>
        </div>

        {/* Payment Form / Checkout Recap */}
        <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm dark:bg-slate-900 dark:border-slate-800">
          <h2 className="mb-4 text-xl font-bold text-slate-800 dark:text-slate-100">
            Rezumat & Detalii Plata
          </h2>

          <div className="mb-6 space-y-3 rounded-lg bg-slate-50 p-4 dark:bg-slate-900/50 dark:border dark:border-slate-800">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 dark:text-slate-400">ID Comanda:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">{order.id.slice(0, 8)}...</span>
            </div>
            <div className="border-t border-slate-200 dark:border-slate-800 my-2" />
            <ul className="max-h-24 overflow-y-auto space-y-1.5 text-xs text-slate-600 dark:text-slate-400 pr-1">
              {order.items.map((item, idx) => (
                <li key={`${item.productId}-${idx}`} className="flex justify-between">
                  <span className="truncate max-w-[200px]">{item.name}</span>
                  <span>{item.quantity} x {item.price} RON</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-slate-200 dark:border-slate-800 my-2" />
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-slate-750 dark:text-slate-300">Total de Plata:</span>
              <span className="text-lg font-bold text-pink-500 dark:text-purple-400">{order.totalPrice.toFixed(2)} RON</span>
            </div>
          </div>

          <form onSubmit={handlePayment} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Nume Titular Card
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="ION POPESCU"
                  value={cardHolder}
                  onChange={(e) => {
                    setCardHolder(e.target.value)
                    if (errors.cardHolder) setErrors(prev => ({ ...prev, cardHolder: '' }))
                  }}
                  onFocus={() => setIsFlipped(false)}
                  className={`w-full rounded-lg border bg-white pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 dark:bg-slate-900 dark:text-slate-100 ${
                    errors.cardHolder 
                      ? 'border-red-500 focus:ring-red-200' 
                      : 'border-slate-300 focus:ring-pink-500 dark:border-slate-750 dark:focus:ring-purple-500'
                  }`}
                  disabled={processing}
                  required
                />
              </div>
              {errors.cardHolder && <p className="mt-1 text-xs text-red-500">{errors.cardHolder}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Numar Card
              </label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="4000 1234 5678 9010"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  onFocus={() => setIsFlipped(false)}
                  className={`w-full rounded-lg border bg-white pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 dark:bg-slate-900 dark:text-slate-100 ${
                    errors.cardNumber 
                      ? 'border-red-500 focus:ring-red-200' 
                      : 'border-slate-300 focus:ring-pink-500 dark:border-slate-750 dark:focus:ring-purple-500'
                  }`}
                  disabled={processing}
                  required
                />
              </div>
              {errors.cardNumber && <p className="mt-1 text-xs text-red-500">{errors.cardNumber}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Data Expirare
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={handleExpiryChange}
                    onFocus={() => setIsFlipped(false)}
                    className={`w-full rounded-lg border bg-white pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 dark:bg-slate-900 dark:text-slate-100 ${
                      errors.expiry 
                        ? 'border-red-500 focus:ring-red-200' 
                        : 'border-slate-300 focus:ring-pink-500 dark:border-slate-750 dark:focus:ring-purple-500'
                    }`}
                    disabled={processing}
                    required
                  />
                </div>
                {errors.expiry && <p className="mt-1 text-xs text-red-500">{errors.expiry}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  CVV / CVC
                </label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
                  <input
                    type="password"
                    placeholder="123"
                    value={cvv}
                    onChange={handleCvvChange}
                    onFocus={() => setIsFlipped(true)}
                    onBlur={() => setIsFlipped(false)}
                    className={`w-full rounded-lg border bg-white pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 dark:bg-slate-900 dark:text-slate-100 ${
                      errors.cvv 
                        ? 'border-red-500 focus:ring-red-200' 
                        : 'border-slate-300 focus:ring-pink-500 dark:border-slate-750 dark:focus:ring-purple-500'
                    }`}
                    disabled={processing}
                    required
                  />
                </div>
                {errors.cvv && <p className="mt-1 text-xs text-red-500">{errors.cvv}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={processing}
              className={`w-full rounded-lg py-3 text-sm font-bold text-white transition-all flex items-center justify-center gap-2 mt-4 ${
                processing 
                  ? 'bg-slate-400 dark:bg-slate-800 cursor-not-allowed' 
                  : 'bg-emerald-500 hover:bg-emerald-600 hover:shadow-lg active:scale-[0.98]'
              }`}
            >
              {processing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Se proceseaza plata...</span>
                </>
              ) : (
                <span>Plateste {order.totalPrice.toFixed(2)} RON</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Payment
