import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import TypewriterText from './TypewriterText'

const MONO = { fontFamily: "'Share Tech Mono', monospace" }

export default function Shop() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Get logged-in user for pre-filled email
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .order('created_at')

    if (data) setProducts(data)
    setLoading(false)
  }

  const handleBuy = (product) => {
    if (product.lemon_squeezy_id) {
      // Lemon Squeezy checkout overlay
      if (window.LemonSqueezy) {
        window.LemonSqueezy.Setup({
          productId: product.lemon_squeezy_id,
          checkout: {
            prefilled: { email: user?.email || '' }
          }
        })
      } else {
        // fallback: open direct URL if available
        if (product.buy_url) window.open(product.buy_url, '_blank')
        else alert('Checkout not ready')
      }
    } else if (product.buy_url) {
      // fallback to external link (affiliate / Spocket)
      window.open(product.buy_url, '_blank')
    } else {
      alert('Product not yet available')
    }
  }

  if (loading) return <div style={{ color: '#444', ...MONO, textAlign: 'center', padding: '40px' }}>LOADING PRODUCTS...</div>

  return (
    <div className="tool-container">
      <div className="tool-header">
        <TypewriterText text="PRIVACY SHOP" style={MONO} />
        <p className="tool-sub">Tools to protect your digital life</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '20px',
        marginTop: '20px'
      }}>
        {products.map(product => (
          <div key={product.id} style={{
            background: '#0a0a0a',
            border: '1px solid #1a1a1a',
            padding: '20px',
            transition: '0.2s'
          }}>
            {product.image_url && (
              <img src={product.image_url} alt={product.name} style={{
                width: '100%',
                height: 'auto',
                marginBottom: '15px',
                border: '1px solid #222'
              }} />
            )}
            <h3 style={{ ...MONO, color: '#fff', marginBottom: '8px' }}>{product.name}</h3>
            <p style={{ ...MONO, color: '#666', fontSize: '0.75rem', minHeight: '60px' }}>
              {product.description}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
              <span style={{ ...MONO, color: '#fff', fontWeight: 'bold' }}>${product.price}</span>
              <button
                onClick={() => handleBuy(product)}
                style={{
                  background: 'transparent',
                  border: '1px solid #fff',
                  color: '#fff',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  ...MONO,
                  fontSize: '0.7rem',
                  letterSpacing: '1px'
                }}
              >
                BUY →
              </button>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px', color: '#333', ...MONO }}>
          Products coming soon.
        </div>
      )}
    </div>
  )
}