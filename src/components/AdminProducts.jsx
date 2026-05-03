import { useState, useEffect } from 'react'
import { supabase } from '../supabase'

const MONO = { fontFamily: "'Share Tech Mono', monospace" }

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', description: '', price: '', image_url: '', buy_url: '', lemon_squeezy_id: '', active: true })

  useEffect(() => {
    checkAdminAndFetch()
  }, [])

  const checkAdminAndFetch = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    // Replace with your email
    if (user?.email !== 'dawsonmsmith@protonmail.com') {
      alert('Admin access only')
      return
    }
    fetchProducts()
  }

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at')
    if (data) setProducts(data)
    setLoading(false)
  }

  const handleSubmit = async () => {
    if (editing) {
      await supabase.from('products').update(form).eq('id', editing.id)
    } else {
      await supabase.from('products').insert(form)
    }
    setEditing(null)
    setForm({ name: '', description: '', price: '', image_url: '', buy_url: '', lemon_squeezy_id: '', active: true })
    fetchProducts()
  }

  const deleteProduct = async (id) => {
    if (confirm('Delete product?')) {
      await supabase.from('products').delete().eq('id', id)
      fetchProducts()
    }
  }

  if (loading) return <div style={{ color: '#444', ...MONO }}>Loading...</div>

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={MONO}>Admin – Products</h2>
      <div style={{ background: '#0a0a0a', padding: '20px', marginBottom: '20px' }}>
        <input placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={{ display: 'block', width: '100%', marginBottom: '10px', background: '#000', border: '1px solid #333', color: '#fff', padding: '8px' }} />
        <textarea placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} style={{ display: 'block', width: '100%', marginBottom: '10px', background: '#000', border: '1px solid #333', color: '#fff', padding: '8px' }} />
        <input placeholder="Price" value={form.price} onChange={e => setForm({...form, price: e.target.value})} style={{ display: 'block', width: '100%', marginBottom: '10px', background: '#000', border: '1px solid #333', color: '#fff', padding: '8px' }} />
        <input placeholder="Image URL" value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} style={{ display: 'block', width: '100%', marginBottom: '10px', background: '#000', border: '1px solid #333', color: '#fff', padding: '8px' }} />
        <input placeholder="Buy URL (affiliate / fallback)" value={form.buy_url} onChange={e => setForm({...form, buy_url: e.target.value})} style={{ display: 'block', width: '100%', marginBottom: '10px', background: '#000', border: '1px solid #333', color: '#fff', padding: '8px' }} />
        <input placeholder="Lemon Squeezy Product ID" value={form.lemon_squeezy_id} onChange={e => setForm({...form, lemon_squeezy_id: e.target.value})} style={{ display: 'block', width: '100%', marginBottom: '10px', background: '#000', border: '1px solid #333', color: '#fff', padding: '8px' }} />
        <label style={{ color: '#fff' }}><input type="checkbox" checked={form.active} onChange={e => setForm({...form, active: e.target.checked})} /> Active</label>
        <button onClick={handleSubmit} style={{ marginTop: '10px', background: '#fff', color: '#000', border: 'none', padding: '8px 16px', cursor: 'pointer', ...MONO }}>{editing ? 'Update' : 'Create'}</button>
        {editing && <button onClick={() => { setEditing(null); setForm({ name: '', description: '', price: '', image_url: '', buy_url: '', lemon_squeezy_id: '', active: true }) }} style={{ marginLeft: '10px', background: '#333', color: '#fff', border: 'none', padding: '8px 16px', cursor: 'pointer', ...MONO }}>Cancel</button>}
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #333', textAlign: 'left' }}>
            <th style={{ padding: '8px' }}>Name</th><th style={{ padding: '8px' }}>Price</th><th style={{ padding: '8px' }}>Active</th><th style={{ padding: '8px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id} style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}>{p.name}</td>
              <td style={{ padding: '8px' }}>${p.price}</td>
              <td style={{ padding: '8px' }}>{p.active ? 'Yes' : 'No'}</td>
              <td style={{ padding: '8px' }}>
                <button onClick={() => { setEditing(p); setForm(p) }} style={{ background: 'transparent', border: '1px solid #fff', color: '#fff', marginRight: '8px', padding: '4px 8px', cursor: 'pointer' }}>Edit</button>
                <button onClick={() => deleteProduct(p.id)} style={{ background: 'transparent', border: '1px solid #ff4444', color: '#ff4444', padding: '4px 8px', cursor: 'pointer' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}