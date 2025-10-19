import { useCart } from '../context/CartContext'
import { useOrders } from '../context/OrderContext'
import './Cart.css'

const Cart = () => {
  const { items, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart()
  const { addOrder } = useOrders()

  const handleOrder = () => {
    if (items.length === 0) return

    const orderData = {
      items: [...items],
      totalPrice: getTotalPrice(),
      status: 'pending'
    }

    addOrder(orderData)
    clearCart()
    alert('주문이 완료되었습니다!')
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
                    onClick={() => updateQuantity(index, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="quantity-btn"
                  >
                    -
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(index, item.quantity + 1)}
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
