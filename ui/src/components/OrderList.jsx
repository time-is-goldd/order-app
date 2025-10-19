import './OrderList.css'

const OrderList = ({ orders, onUpdateOrderStatus }) => {
  const pendingOrders = orders.filter(order => order.status === 'pending')
  const acceptedOrders = orders.filter(order => order.status === 'accepted')

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusButton = (order) => {
    switch (order.status) {
      case 'pending':
        return (
          <button 
            className="status-btn accept"
            onClick={() => onUpdateOrderStatus(order.id, 'accepted')}
          >
            주문 접수
          </button>
        )
      case 'accepted':
        return (
          <button 
            className="status-btn complete"
            onClick={() => onUpdateOrderStatus(order.id, 'completed')}
          >
            제조 완료
          </button>
        )
      default:
        return <span className="status-text">완료</span>
    }
  }

  if (orders.length === 0) {
    return (
      <div className="admin-section order-list">
        <h2>주문 현황</h2>
        <p className="no-orders">대기 중인 주문이 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="admin-section order-list">
      <h2>주문 현황</h2>
      
      {pendingOrders.length > 0 && (
        <div className="order-section">
          <h3>대기 중인 주문</h3>
          {pendingOrders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-info">
                <div className="order-time">{formatDate(order.createdAt)}</div>
                <div className="order-items">
                  {order.items.map((item, index) => (
                    <div key={index} className="order-item">
                      {item.name} {item.options.length > 0 && `(${item.options.join(', ')})`} x {item.quantity}
                    </div>
                  ))}
                </div>
                <div className="order-total">{order.totalPrice.toLocaleString()}원</div>
              </div>
              <div className="order-actions">
                {getStatusButton(order)}
              </div>
            </div>
          ))}
        </div>
      )}

      {acceptedOrders.length > 0 && (
        <div className="order-section">
          <h3>제조 중인 주문</h3>
          {acceptedOrders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-info">
                <div className="order-time">{formatDate(order.createdAt)}</div>
                <div className="order-items">
                  {order.items.map((item, index) => (
                    <div key={index} className="order-item">
                      {item.name} {item.options.length > 0 && `(${item.options.join(', ')})`} x {item.quantity}
                    </div>
                  ))}
                </div>
                <div className="order-total">{order.totalPrice.toLocaleString()}원</div>
              </div>
              <div className="order-actions">
                {getStatusButton(order)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default OrderList
