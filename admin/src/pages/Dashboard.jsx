import { useEffect, useState } from 'react'
import api from '../api/axios'
import StatCard from '../components/StatCard'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalProducts: 0,
    totalUsers: 0
  })

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [ordersRes, productsRes, usersRes] = await Promise.all([
          api.get('/orders'),
          api.get('/products'),
          api.get('/users')
        ])

        const orders = ordersRes.data.orders
        setStats({
          totalOrders: orders.length,
          pendingOrders: orders.filter((order) => order.status === 'pending').length,
          totalProducts: productsRes.data.products.length,
          totalUsers: usersRes.data.users.length
        })
      } catch {
        setStats({ totalOrders: 0, pendingOrders: 0, totalProducts: 0, totalUsers: 0 })
      }
    }

    loadStats()
  }, [])

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-slate-800">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total comenzi" value={stats.totalOrders} />
        <StatCard title="Comenzi pending" value={stats.pendingOrders} />
        <StatCard title="Total produse" value={stats.totalProducts} />
        <StatCard title="Total utilizatori" value={stats.totalUsers} />
      </div>
    </div>
  )
}

export default Dashboard
