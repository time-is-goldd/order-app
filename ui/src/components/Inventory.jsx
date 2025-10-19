import './Inventory.css'

const Inventory = ({ inventory, onUpdateInventory }) => {
  const products = [
    { id: 'americano-ice', name: '아메리카노 (ICE)' },
    { id: 'americano-hot', name: '아메리카노 (HOT)' },
    { id: 'cafe-latte', name: '카페라떼' },
    { id: 'cappuccino', name: '카푸치노' },
    { id: 'mocha', name: '모카' },
    { id: 'vanilla-latte', name: '바닐라 라떼' }
  ]

  return (
    <div className="admin-section inventory">
      <h2>재고 현황</h2>
      <div className="inventory-grid">
        {products.map(product => (
          <div key={product.id} className="inventory-item">
            <h3 className="product-name">{product.name}</h3>
            <div className="inventory-controls">
              <button 
                onClick={() => onUpdateInventory(product.id, -1)}
                className="inventory-btn minus"
              >
                -
              </button>
              <span className="inventory-count">{inventory[product.id]}개</span>
              <button 
                onClick={() => onUpdateInventory(product.id, 1)}
                className="inventory-btn plus"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Inventory
