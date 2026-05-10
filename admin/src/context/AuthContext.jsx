import { createContext, useContext, useMemo, useState } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('admin_user')
    return raw ? JSON.parse(raw) : null
  })
  const [token, setToken] = useState(() => localStorage.getItem('admin_token'))

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    const { user: loggedUser, token: loggedToken } = response.data

    if (loggedUser.role !== 'admin') {
      throw new Error('Acces permis doar pentru administratori')
    }

    setUser(loggedUser)
    setToken(loggedToken)
    localStorage.setItem('admin_user', JSON.stringify(loggedUser))
    localStorage.setItem('admin_token', loggedToken)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('admin_user')
    localStorage.removeItem('admin_token')
  }

  const value = useMemo(
    () => ({ user, token, isAuthenticated: Boolean(token), login, logout }),
    [user, token]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth trebuie folosit in AuthProvider')
  }
  return context
}
