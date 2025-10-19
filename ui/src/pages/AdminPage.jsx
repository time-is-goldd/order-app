import Dashboard from '../components/Dashboard'
import Inventory from '../components/Inventory'
import OrderList from '../components/OrderList'
import { useOrders } from '../context/OrderContext'
import { useInventory } from '../context/InventoryContext'
import './AdminPage.css'

const AdminPage = () => {
  const { orders, updateOrderStatus } = useOrders()
  const { reduceInventoryForOrder } = useInventory()

  const handleOrderStatusUpdate = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus)
    
    // 주문 처리 시 해당 제품의 재고만 감소
    if (newStatus === 'accepted') {
      const order = orders.find(order => order.id === orderId)
      if (order && order.items) {
        reduceInventoryForOrder(order.items)
      }
    }
  }

  return (
    <div className="admin-page">
      <Dashboard orders={orders} />
      <Inventory />
      <OrderList 
        orders={orders}
        onUpdateOrderStatus={handleOrderStatusUpdate}
      />
    </div>
  )
}

export default AdminPage
