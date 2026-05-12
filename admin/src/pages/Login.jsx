import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Toast from '../components/Toast'
import { useToast } from '../hooks/useToast'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { toast, showToast, hideToast } = useToast()
  const [email, setEmail] = useState('admin@florishop.me')
  const [password, setPassword] = useState('Admin123!')
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    try {
      await login(email, password)
      showToast('Bun venit in panoul de administrare!')
      setTimeout(() => navigate('/'), 2000)
    } catch (requestError) {
      setError(requestError.response?.data?.error || requestError.message || 'Autentificare esuata')
    }
  }

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h1 className="mb-4 text-2xl font-extrabold text-slate-800">Petunia Admin Login</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email"
              required
            />
            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Parola"
              required
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button className="w-full rounded-lg bg-pink-500 py-2 font-semibold text-white hover:bg-pink-600">
              Login admin
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default Login
