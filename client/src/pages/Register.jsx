import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Toast from '../components/Toast'
import { useToast } from '../hooks/useToast'

const Register = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  const { toast, showToast, hideToast } = useToast()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showValidationModal, setShowValidationModal] = useState(false)
  const [validationErrors, setValidationErrors] = useState([])

  const calculateStrength = () => {
    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[a-z]/.test(password)) score++
    if (/\d/.test(password)) score++
    if (/[@$!%*?&]/.test(password)) score++
    return score
  }

  const strength = calculateStrength()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    const errors = []
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const isEmailValid = emailRegex.test(email)

    const lengthValid = password.length >= 8
    const hasUpper = /[A-Z]/.test(password)
    const hasLower = /[a-z]/.test(password)
    const hasDigit = /\d/.test(password)
    const hasSpecial = /[@$!%*?&]/.test(password)

    errors.push({ label: 'Format email valid (ex: nume@domeniu.com)', valid: isEmailValid })
    errors.push({ label: 'Lungime de cel putin 8 caractere', valid: lengthValid })
    errors.push({ label: 'Cel putin o litera mare (A-Z)', valid: hasUpper })
    errors.push({ label: 'Cel putin o litera mica (a-z)', valid: hasLower })
    errors.push({ label: 'Cel putin o cifra (0-9)', valid: hasDigit })
    errors.push({ label: 'Cel putin un caracter special (@$!%*?&)', valid: hasSpecial })

    const hasInvalid = errors.some((item) => !item.valid)
    if (hasInvalid) {
      setValidationErrors(errors)
      setShowValidationModal(true)
      return
    }

    try {
      await register(name, email, password)
      showToast('Contul tau a fost creat cu succes! Bun venit la Petunia 🌸')
      setTimeout(() => navigate('/'), 2000)
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Inregistrare esuata')
    }
  }

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
      
      <div className="mx-auto max-w-md rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:bg-slate-900 dark:border-slate-800 animate-page">
        <h1 className="mb-4 text-2xl font-bold text-slate-800 dark:text-slate-100">Creeaza cont</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nume"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:bg-slate-900 dark:border-slate-750 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:bg-slate-900 dark:border-slate-750 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
            required
          />
          <div>
            <input
              type="password"
              placeholder="Parola"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:bg-slate-900 dark:border-slate-750 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
            {password && (
              <div className="mt-2 space-y-1">
                <div className="flex h-1.5 gap-1 rounded bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      strength <= 2 ? 'bg-red-500 w-1/3' : strength <= 4 ? 'bg-amber-500 w-2/3' : 'bg-emerald-500 w-full'
                    }`}
                  />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Securitate parola:{' '}
                  <span className={`font-semibold ${
                    strength <= 2 ? 'text-red-500' : strength <= 4 ? 'text-amber-500' : 'text-emerald-500'
                  }`}>
                    {strength <= 2 ? 'Slaba' : strength <= 4 ? 'Medie' : 'Puternica'}
                  </span>
                </p>
              </div>
            )}
          </div>
          {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}
          <button className="w-full rounded-lg bg-pink-500 py-2 font-semibold text-white hover:bg-pink-600 transition-colors">
            Creeaza cont
          </button>
        </form>
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
          Ai deja cont?{' '}
          <Link to="/login" className="font-semibold text-pink-600 dark:text-pink-400 hover:underline">
            Autentificare
          </Link>
        </p>
      </div>

      {/* Security requirements modal */}
      {showValidationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900 border dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-850 dark:text-slate-100 mb-3">Cerinte de securitate</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Pentru inregistrare, te rugam sa respecti urmatoarele reguli de validare:
            </p>
            <ul className="space-y-3">
              {validationErrors.map((err, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm">
                  {err.valid ? (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 font-bold text-xs">✓</span>
                  ) : (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400 font-bold text-xs">✗</span>
                  )}
                  <span className={err.valid ? 'text-emerald-700 dark:text-emerald-400 font-medium' : 'text-slate-600 dark:text-slate-400'}>
                    {err.label}
                  </span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setShowValidationModal(false)}
              className="mt-6 w-full rounded-lg bg-pink-500 py-2 font-semibold text-white hover:bg-pink-600 transition-colors"
            >
              Am inteles
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default Register
