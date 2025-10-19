import { useInventory } from '../context/InventoryContext'
import './Inventory.css'

const Inventory = () => {
  const { inventory, updateInventory, getInventoryStatus } = useInventory()
  
  // 모든 메뉴 표시
  const products = [
    { id: 'americano-ice', name: '아메리카노 (ICE)' },
    { id: 'americano-hot', name: '아메리카노 (HOT)' },
    { id: 'cafe-latte', name: '카페라떼' },
    { id: 'cappuccino', name: '카푸치노' },
    { id: 'mocha', name: '모카' },
    { id: 'vanilla-latte', name: '바닐라 라떼' }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case '품절': return '#f44336'
      case '주의': return '#ff9800'
      case '정상': return '#4caf50'
      default: return '#666'
    }
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
                <span className="inventory-count">{inventory[product.id]}개</span>
                <span 
                  className="inventory-status" 
                  style={{ color: getStatusColor(status) }}
                >
                  {status}
                </span>
              </div>
              <div className="inventory-controls">
                <button 
                  onClick={() => updateInventory(product.id, -1)}
                  className="inventory-btn minus"
                >
                  -
                </button>
                <button 
                  onClick={() => updateInventory(product.id, 1)}
                  className="inventory-btn plus"
                >
                  +
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
