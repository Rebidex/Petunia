import { useEffect, useState } from 'react'
import api from '../api/axios'
import Modal from '../components/Modal'

const initialForm = {
  name: '',
  description: '',
  price: '',
  category: '',
  imageUrl: '',
  stock: '',
  isAvailable: true
}

const Products = () => {
  const [products, setProducts] = useState([])
  const [open, setOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(initialForm)

  const loadProducts = async () => {
    const response = await api.get('/products')
    setProducts(response.data.products)
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const openCreate = () => {
    setEditingId(null)
    setForm(initialForm)
    setOpen(true)
  }

  const openEdit = (product) => {
    setEditingId(product.id)
    setForm({ ...product })
    setOpen(true)
  }

  const saveProduct = async () => {
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      isAvailable: Boolean(form.isAvailable)
    }

    if (editingId) {
      await api.put(`/products/${editingId}`, payload)
    } else {
      await api.post('/products', payload)
    }

    setOpen(false)
    await loadProducts()
  }

  const deleteProduct = async (id) => {
    if (!window.confirm('Sigur stergi produsul?')) return
    await api.delete(`/products/${id}`)
    await loadProducts()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Produse</h1>
        <button onClick={openCreate} className="rounded-lg bg-pink-500 px-4 py-2 font-semibold text-white">
          Adauga produs
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-3 py-2">Nume</th>
              <th className="px-3 py-2">Categorie</th>
              <th className="px-3 py-2">Pret</th>
              <th className="px-3 py-2">Stoc</th>
              <th className="px-3 py-2">Disponibil</th>
              <th className="px-3 py-2">Actiuni</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t">
                <td className="px-3 py-2">{product.name}</td>
                <td className="px-3 py-2">{product.category}</td>
                <td className="px-3 py-2">{product.price}</td>
                <td className="px-3 py-2">{product.stock}</td>
                <td className="px-3 py-2">{product.isAvailable ? 'Da' : 'Nu'}</td>
                <td className="px-3 py-2">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(product)} className="rounded border px-2 py-1">
                      Edit
                    </button>
                    <button onClick={() => deleteProduct(product.id)} className="rounded border px-2 py-1">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <Modal title={editingId ? 'Editeaza produs' : 'Adauga produs'} onClose={() => setOpen(false)} onSubmit={saveProduct}>
          <input
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            placeholder="Nume"
            className="w-full rounded-lg border px-3 py-2"
            required
          />
          <textarea
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            placeholder="Descriere"
            className="w-full rounded-lg border px-3 py-2"
            required
          />
          <input
            value={form.category}
            onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
            placeholder="Categorie"
            className="w-full rounded-lg border px-3 py-2"
            required
          />
          <input
            type="number"
            step="0.01"
            value={form.price}
            onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
            placeholder="Pret"
            className="w-full rounded-lg border px-3 py-2"
            required
          />
          <input
            type="number"
            value={form.stock}
            onChange={(event) => setForm((prev) => ({ ...prev, stock: event.target.value }))}
            placeholder="Stoc"
            className="w-full rounded-lg border px-3 py-2"
            required
          />
          <input
            value={form.imageUrl}
            onChange={(event) => setForm((prev) => ({ ...prev, imageUrl: event.target.value }))}
            placeholder="Image URL"
            className="w-full rounded-lg border px-3 py-2"
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={Boolean(form.isAvailable)}
              onChange={(event) => setForm((prev) => ({ ...prev, isAvailable: event.target.checked }))}
            />
            Disponibil
          </label>
        </Modal>
      )}
    </div>
  )
}

export default Products
