import { useState, useEffect } from 'react'
import { useInventory } from '../context/InventoryContext'
import { adminAPI } from '../services/api'
import './Inventory.css'

const Inventory = () => {
  const { inventory, updateInventory, getInventoryStatus } = useInventory()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  
  // 서버에서 메뉴 데이터 로드
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        const response = await adminAPI.getInventory()
        if (response.success) {
          setProducts(response.data)
        }
      } catch (error) {
        console.error('메뉴 데이터 로드 실패:', error)
        // 기본값으로 폴백
        setProducts([
          { id: 1, name: '아메리카노(ICE)', stock_quantity: 0 },
          { id: 2, name: '아메리카노(HOT)', stock_quantity: 0 },
          { id: 3, name: '카페라떼', stock_quantity: 0 }
        ])
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case '품절': return '#f44336'
      case '주의': return '#ff9800'
      case '정상': return '#4caf50'
      default: return '#666'
    }
  }

  const handleUpdateInventory = async (productId, change) => {
    try {
      await updateInventory(productId, change)
      // 재고 업데이트 후 메뉴 목록 새로고침
      const response = await adminAPI.getInventory()
      if (response.success) {
        setProducts(response.data)
      }
    } catch (error) {
      console.error('재고 업데이트 실패:', error)
      alert('재고 업데이트에 실패했습니다.')
    }
  }

  const handleSetStock = async (productId, stockQuantity) => {
    try {
      await adminAPI.updateInventory(productId, stockQuantity)
      // 재고 업데이트 후 메뉴 목록 새로고침
      const response = await adminAPI.getInventory()
      if (response.success) {
        setProducts(response.data)
      }
    } catch (error) {
      console.error('재고 설정 실패:', error)
      alert('재고 설정에 실패했습니다.')
    }
  }

  if (loading) {
    return (
      <div className="admin-section inventory">
        <h2>재고 현황</h2>
        <p>로딩 중...</p>
      </div>
    )
  }

  return (
    <div className="admin-section inventory">
      <h2>재고 현황</h2>
      <div className="inventory-grid">
        {products.map(product => {
          const status = getInventoryStatus(product.id)
          return (
            <div key={product.id} className="inventory-item">
              <h3 className="product-name">{product.name}</h3>
              <div className="inventory-info">
                <span className="inventory-count">{product.stock_quantity}개</span>
                <span 
                  className="inventory-status" 
                  style={{ color: getStatusColor(status) }}
                >
                  {status}
                </span>
              </div>
              <div className="inventory-controls">
                <button 
                  onClick={() => handleUpdateInventory(product.id, -1)}
                  className="inventory-btn minus"
                >
                  -
                </button>
                <button 
                  onClick={() => handleUpdateInventory(product.id, 1)}
                  className="inventory-btn plus"
                >
                  +
                </button>
                <button 
                  onClick={() => handleSetStock(product.id, 10)}
                  className="inventory-btn set-stock"
                  title="재고를 10개로 설정"
                >
                  10개
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Inventory
