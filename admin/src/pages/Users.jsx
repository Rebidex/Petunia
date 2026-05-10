import { useEffect, useState } from 'react'
import api from '../api/axios'

const Users = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    const loadUsers = async () => {
      const response = await api.get('/users')
      setUsers(response.data.users)
    }

    loadUsers()
  }, [])

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-800">Utilizatori</h1>
      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-3 py-2">Nume</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Rol</th>
              <th className="px-3 py-2">Creat la</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="px-3 py-2">{user.name}</td>
                <td className="px-3 py-2">{user.email}</td>
                <td className="px-3 py-2">{user.role}</td>
                <td className="px-3 py-2">{new Date(user.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Users
