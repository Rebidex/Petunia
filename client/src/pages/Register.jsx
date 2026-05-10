import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Register = () => {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    try {
      await register(name, email, password)
      navigate('/login')
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Inregistrare esuata')
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <h1 className="mb-4 text-2xl font-bold text-slate-800">Creeaza cont</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nume"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
          required
        />
        <input
          type="password"
          placeholder="Parola"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
          required
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button className="w-full rounded-lg bg-pink-500 py-2 font-semibold text-white hover:bg-pink-600">
          Creeaza cont
        </button>
      </form>
      <p className="mt-4 text-sm text-slate-600">
        Ai deja cont?{' '}
        <Link to="/login" className="font-semibold text-pink-600">
          Login
        </Link>
      </p>
    </div>
  )
}

export default Register
