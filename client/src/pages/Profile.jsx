import { useEffect, useState } from 'react'
import api from '../api/axios'
import Toast from '../components/Toast'
import { useToast } from '../hooks/useToast'
import { useAuth } from '../context/AuthContext'
import { User, Phone, Mail, ShieldAlert } from 'lucide-react'

const Profile = () => {
  const { user, updateUser } = useAuth()
  const { toast, showToast, hideToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [ordersCount, setOrdersCount] = useState(0)
  const [createdAt, setCreatedAt] = useState(user?.createdAt || '')
  
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || ''
  })
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [showValidationModal, setShowValidationModal] = useState(false)
  const [validationErrors, setValidationErrors] = useState([])

  useEffect(() => {
    let active = true

    const loadProfile = async () => {
      try {
        const [userResponse, ordersResponse] = await Promise.all([
          api.get('/auth/me'), 
          api.get('/orders/my')
        ])
        const apiUser = userResponse.data.user || userResponse.data
        const orders = Array.isArray(ordersResponse.data) 
          ? ordersResponse.data 
          : ordersResponse.data.orders || []

        if (active) {
          setProfileForm({
            name: apiUser?.name || '',
            phone: apiUser?.phone || '',
            email: apiUser?.email || ''
          })
          setCreatedAt(apiUser?.createdAt || '')
          setOrdersCount(orders.length)
        }
      } catch {
        if (active) {
          setError('Nu am putut incarca datele de profil.')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadProfile()

    return () => {
      active = false
    }
  }, [])

  const calculateStrength = () => {
    let score = 0
    const pass = passwordForm.newPassword
    if (pass.length >= 8) score++
    if (/[A-Z]/.test(pass)) score++
    if (/[a-z]/.test(pass)) score++
    if (/\d/.test(pass)) score++
    if (/[@$!%*?&]/.test(pass)) score++
    return score
  }

  const strength = calculateStrength()

  const handleProfileSave = async (event) => {
    event.preventDefault()
    setError('')

    try {
      const response = await api.put('/users/me', {
        name: profileForm.name,
        phone: profileForm.phone
      })
      updateUser(response.data)
      setProfileForm((prev) => ({
        ...prev,
        name: response.data.name || prev.name,
        phone: response.data.phone || ''
      }))
      showToast('Profilul a fost actualizat cu succes! ✨')
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Nu s-a putut actualiza profilul.')
    }
  }

  const handlePasswordChange = async (event) => {
    event.preventDefault()
    setPasswordError('')

    const errors = []
    const newPass = passwordForm.newPassword

    const lengthValid = newPass.length >= 8
    const hasUpper = /[A-Z]/.test(newPass)
    const hasLower = /[a-z]/.test(newPass)
    const hasDigit = /\d/.test(newPass)
    const hasSpecial = /[@$!%*?&]/.test(newPass)
    const matchValid = newPass === passwordForm.confirmPassword

    errors.push({ label: 'Lungime de cel putin 8 caractere', valid: lengthValid })
    errors.push({ label: 'Cel putin o litera mare (A-Z)', valid: hasUpper })
    errors.push({ label: 'Cel putin o litera mica (a-z)', valid: hasLower })
    errors.push({ label: 'Cel putin o cifra (0-9)', valid: hasDigit })
    errors.push({ label: 'Cel putin un caracter special (@$!%*?&)', valid: hasSpecial })
    errors.push({ label: 'Parolele noi coincid', valid: matchValid })

    const hasInvalid = errors.some((item) => !item.valid)
    if (hasInvalid) {
      setValidationErrors(errors)
      setShowValidationModal(true)
      return
    }

    try {
      await api.put('/users/me/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      })
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      showToast('Parola a fost modificata cu succes! 🔒')
    } catch (requestError) {
      setPasswordError(requestError.response?.data?.error || 'Nu s-a putut schimba parola.')
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 animate-pulse text-center">
        <p className="text-slate-655 dark:text-slate-400">Se incarca profilul...</p>
      </div>
    )
  }

  if (error && !profileForm.email) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 text-center animate-page">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' })
    : '-'

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-10 animate-page">
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Profilul meu</h1>

      {/* Personal Info Form */}
      <form onSubmit={handleProfileSave} className="space-y-4 rounded-xl border border-slate-100 bg-white p-6 shadow-sm dark:bg-slate-900 dark:border-slate-800">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Date personale</h2>
        
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">Nume complet</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
              <input
                type="text"
                placeholder="Nume complet"
                className="w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 py-2 text-sm dark:bg-slate-900 dark:border-slate-750 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-purple-500"
                value={profileForm.name}
                onChange={(event) => setProfileForm((prev) => ({ ...prev, name: event.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">Telefon</label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
              <input
                type="tel"
                placeholder="Ex: 0722123456"
                className="w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 py-2 text-sm dark:bg-slate-900 dark:border-slate-750 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-purple-500"
                value={profileForm.phone}
                onChange={(event) => setProfileForm((prev) => ({ ...prev, phone: event.target.value }))}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">Email (nu se poate modifica)</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-450" />
              <input
                type="email"
                readOnly
                title="Email-ul nu poate fi modificat"
                className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 pl-10 pr-3 py-2 text-sm text-slate-500 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400"
                value={profileForm.email}
              />
            </div>
          </div>
        </div>

        {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}
        
        <button className="rounded-lg bg-pink-500 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-600 transition-colors">
          Salveaza modificarile
        </button>
      </form>

      {/* Password Change Form */}
      <form onSubmit={handlePasswordChange} className="space-y-4 rounded-xl border border-slate-100 bg-white p-6 shadow-sm dark:bg-slate-900 dark:border-slate-800">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Schimba parola</h2>
        
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">Parola curenta</label>
            <input
              type="password"
              placeholder="Parola curenta"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:bg-slate-900 dark:border-slate-750 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-purple-500"
              value={passwordForm.currentPassword}
              onChange={(event) => setPasswordForm((prev) => ({ ...prev, currentPassword: event.target.value }))}
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">Parola noua</label>
            <input
              type="password"
              placeholder="Parola noua"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:bg-slate-900 dark:border-slate-750 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-purple-500"
              value={passwordForm.newPassword}
              onChange={(event) => setPasswordForm((prev) => ({ ...prev, newPassword: event.target.value }))}
              required
            />
            {passwordForm.newPassword && (
              <div className="mt-2 space-y-1">
                <div className="flex h-1.5 gap-1 rounded bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      strength <= 2 ? 'bg-red-500 w-1/3' : strength <= 4 ? 'bg-amber-500 w-2/3' : 'bg-emerald-500 w-full'
                    }`}
                  />
                </div>
                <p className="text-xs text-slate-505 dark:text-slate-400">
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

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">Confirma parola noua</label>
            <input
              type="password"
              placeholder="Confirma parola noua"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:bg-slate-900 dark:border-slate-750 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-purple-500"
              value={passwordForm.confirmPassword}
              onChange={(event) => setPasswordForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
              required
            />
          </div>
        </div>

        {passwordError && <p className="text-sm text-red-500 dark:text-red-400">{passwordError}</p>}
        
        <button className="rounded-lg bg-pink-500 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-600 transition-colors">
          Schimba parola
        </button>
      </form>

      {/* Account Info Recap */}
      <div className="space-y-3 rounded-xl border border-slate-100 bg-white p-6 shadow-sm dark:bg-slate-900 dark:border-slate-800">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Rezumat activitate</h2>
        <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400">
          <p>Numar total de comenzi: <span className="font-semibold text-slate-800 dark:text-slate-200">{ordersCount}</span></p>
          <p>Membru din: <span className="font-semibold text-slate-800 dark:text-slate-200">{formattedDate}</span></p>
        </div>
      </div>

      {/* Validation modal for Password constraints */}
      {showValidationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900 border dark:border-slate-800">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-3">
              <ShieldAlert className="h-5 w-5" />
              <h2 className="text-xl font-bold text-slate-850 dark:text-slate-100">Cerinte parola noua</h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Pentru a-ti securiza contul, te rugam sa respecti urmatoarele reguli de validare:
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
    </div>
  )
}

export default Profile
