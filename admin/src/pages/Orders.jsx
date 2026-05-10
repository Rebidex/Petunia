import { useEffect, useState } from 'react'
import api from '../api/axios'

const statusClasses = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700'
}

const statuses = ['pending', 'confirmed', 'delivered', 'cancelled']

const Orders = () => {
  const [orders, setOrders] = useState([])

  const loadOrders = async () => {
    const response = await api.get('/orders')
    setOrders(response.data.orders)
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const updateStatus = async (id, status) => {
    await api.patch(`/orders/${id}/status`, { status })
    await loadOrders()
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-800">Comenzi</h1>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-3 py-2">ID</th>
              <th className="px-3 py-2">Client</th>
              <th className="px-3 py-2">Data</th>
              <th className="px-3 py-2">Total</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Actiuni</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t">
                <td className="px-3 py-2">{order.id.slice(0, 8)}...</td>
                <td className="px-3 py-2">{order.customerName}</td>
                <td className="px-3 py-2">{order.deliveryDate}</td>
                <td className="px-3 py-2">{order.totalPrice}</td>
                <td className="px-3 py-2">
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusClasses[order.status]}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <select
                    value={order.status}
                    onChange={(event) => updateStatus(order.id, event.target.value)}
                    className="rounded border border-slate-300 px-2 py-1"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Orders
