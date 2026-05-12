import { useEffect, useState } from 'react'
import api from '../api/axios'
import Toast from '../components/Toast'
import { useToast } from '../hooks/useToast'
import { useAuth } from '../context/AuthContext'

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

  useEffect(() => {
    let active = true

    const loadProfile = async () => {
      try {
        const [userResponse, ordersResponse] = await Promise.all([api.get('/auth/me'), api.get('/orders/my')])
        const apiUser = userResponse.data.user || userResponse.data
        const orders = Array.isArray(ordersResponse.data) ? ordersResponse.data : ordersResponse.data.orders || []

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
          setError('Nu am putut incarca profilul.')
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
      showToast('Profil actualizat cu succes!')
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Nu s-a putut actualiza profilul.')
    }
  }

  const handlePasswordChange = async (event) => {
    event.preventDefault()
    setPasswordError('')

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('Parola noua trebuie sa aiba minim 6 caractere.')
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Parolele noi nu se potrivesc.')
      return
    }

    try {
      await api.put('/users/me/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      })
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      showToast('Parola a fost schimbata cu succes!')
    } catch (requestError) {
      setPasswordError(requestError.response?.data?.error || 'Nu s-a putut schimba parola.')
    }
  }

  if (loading) {
    return <p className="text-slate-600">Se incarca profilul...</p>
  }

  if (error && !profileForm.email) {
    return <p className="text-red-500">{error}</p>
  }

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' })
    : '-'

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-10">
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
      <h1 className="text-2xl font-bold text-slate-800">Profilul meu</h1>

      <form onSubmit={handleProfileSave} className="space-y-4 rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">Date personale</h2>
        <input
          type="text"
          placeholder="Nume complet"
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
          value={profileForm.name}
          onChange={(event) => setProfileForm((prev) => ({ ...prev, name: event.target.value }))}
          required
        />
        <input
          type="tel"
          placeholder="Telefon"
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
          value={profileForm.phone}
          onChange={(event) => setProfileForm((prev) => ({ ...prev, phone: event.target.value }))}
        />
        <input
          type="email"
          readOnly
          title="Email-ul nu poate fi modificat"
          className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-slate-500"
          value={profileForm.email}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button className="rounded-lg bg-pink-500 px-4 py-2 font-semibold text-white hover:bg-pink-600">
          Salveaza modificarile
        </button>
      </form>

      <form onSubmit={handlePasswordChange} className="space-y-4 rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">Schimba parola</h2>
        <input
          type="password"
          placeholder="Parola curenta"
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
          value={passwordForm.currentPassword}
          onChange={(event) => setPasswordForm((prev) => ({ ...prev, currentPassword: event.target.value }))}
          required
        />
        <input
          type="password"
          placeholder="Parola noua"
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
          value={passwordForm.newPassword}
          onChange={(event) => setPasswordForm((prev) => ({ ...prev, newPassword: event.target.value }))}
          required
        />
        <input
          type="password"
          placeholder="Confirma parola noua"
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
          value={passwordForm.confirmPassword}
          onChange={(event) => setPasswordForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
          required
        />
        {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
        <button className="rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-800">
          Schimba parola
        </button>
      </form>

      <div className="space-y-3 rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">Rezumat activitate</h2>
        <p className="text-sm text-slate-600">Numar total de comenzi: {ordersCount}</p>
        <p className="text-sm text-slate-600">Cont creat la: {formattedDate}</p>
      </div>
    </div>
  )
}

export default Profile
