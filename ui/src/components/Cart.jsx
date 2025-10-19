import { useCart } from '../context/CartContext'
import { useOrders } from '../context/OrderContext'
import { useInventory } from '../context/InventoryContext'
import { validateOrder, calculateTotalPrice } from '../utils/helpers'
import './Cart.css'

const Cart = () => {
  const { items, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart()
  const { addOrder } = useOrders()
  const { inventory } = useInventory()

  const handleQuantityChange = (index, newQuantity) => {
    const item = items[index]
    const currentStock = inventory[item.id] || 0
    
    if (newQuantity > currentStock) {
      alert(`${item.name}의 재고가 부족합니다. (재고: ${currentStock}개)`)
      return
    }
    
    updateQuantity(index, newQuantity)
  }

  const handleOrder = async () => {
    const validation = validateOrder(items)
    if (!validation.isValid) {
      alert(validation.message)
      return
    }

    try {
      // API 형식에 맞게 주문 데이터 변환
      const orderItems = items.map(item => ({
        menu_id: item.id,
        menu_name: item.name,
        quantity: item.quantity,
        options: item.options,
        item_price: item.totalPrice,
        total_price: item.totalPrice * item.quantity
      }))

      const orderData = {
        order_items: orderItems,
        total_amount: getTotalPrice()
      }

      await addOrder(orderData)
      clearCart()
      alert('주문이 완료되었습니다!')
    } catch (error) {
      console.error('주문 실패:', error)
      alert('주문 처리 중 오류가 발생했습니다. 다시 시도해주세요.')
    }
  }

  if (items.length === 0) {
    return (
      <div className="cart">
        <h3>장바구니</h3>
        <p className="empty-cart">장바구니가 비어있습니다.</p>
      </div>
    )
  }

  return (
    <div className="cart">
      <h3>장바구니</h3>
      
      <div className="cart-content">
        <div className="cart-items-section">
          <div className="cart-items">
            {items.map((item, index) => (
              <div key={index} className="cart-item">
                <div className="item-info">
                  <span className="item-name">
                    {item.name} {item.options.length > 0 && `(${item.options.join(', ')})`} X {item.quantity}
                  </span>
                  <span className="item-price">
                    {(item.totalPrice * item.quantity).toLocaleString()}원
                  </span>
                </div>
                <div className="item-controls">
                  <button 
                    onClick={() => handleQuantityChange(index, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="quantity-btn"
                  >
                    -
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(index, item.quantity + 1)}
                    className="quantity-btn"
                  >
                    +
                  </button>
                  <button 
                    onClick={() => removeFromCart(index)}
                    className="remove-btn"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="cart-summary-section">
          <div className="total-price">
            총 금액: <strong>{getTotalPrice().toLocaleString()}원</strong>
          </div>
          <button className="order-btn" onClick={handleOrder}>
            주문하기
          </button>
        </div>
      </div>
    </div>
  )
}

export default Cart
