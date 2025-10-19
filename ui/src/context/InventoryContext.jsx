import { createContext, useContext, useReducer, useEffect, useState } from 'react'
import { adminAPI } from '../services/api'

const InventoryContext = createContext()

const inventoryReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_INVENTORY':
      return {
        ...state,
        [action.payload.productId]: Math.max(0, state[action.payload.productId] + action.payload.change)
      }
    
    case 'REDUCE_INVENTORY_FOR_ORDER':
      const updated = { ...state }
      action.payload.items.forEach(item => {
        if (updated[item.id] !== undefined) {
          updated[item.id] = Math.max(0, updated[item.id] - item.quantity)
        }
      })
      return updated
    
    case 'SET_INVENTORY':
      return action.payload
    
    default:
      return state
  }
}

export const InventoryProvider = ({ children }) => {
  const [inventory, dispatch] = useReducer(inventoryReducer, {})
  const [loading, setLoading] = useState(false)

  // 서버에서 재고 데이터 로드
  useEffect(() => {
    const loadInventory = async () => {
      try {
        setLoading(true)
        const response = await adminAPI.getInventory()
        if (response.success) {
          const inventoryData = {}
          response.data.forEach(item => {
            inventoryData[item.id] = item.stock_quantity
          })
          setInventory(inventoryData)
        }
      } catch (error) {
        console.error('재고 데이터 로드 실패:', error)
        // 기본값으로 폴백
        setInventory({
          'americano-ice': 10,
          'americano-hot': 10,
          'cafe-latte': 10,
          'cappuccino': 10,
          'mocha': 10,
          'vanilla-latte': 10
        })
      } finally {
        setLoading(false)
      }
    }

    loadInventory()
  }, [])

  const updateInventory = async (productId, change) => {
    try {
      // 서버에 재고 업데이트 요청
      const newQuantity = inventory[productId] + change
      await adminAPI.updateInventory(productId, newQuantity)
      
      // 로컬 상태 업데이트
      dispatch({ type: 'UPDATE_INVENTORY', payload: { productId, change } })
    } catch (error) {
      console.error('재고 업데이트 실패:', error)
      throw error
    }
  }

  const reduceInventoryForOrder = (items) => {
    dispatch({ type: 'REDUCE_INVENTORY_FOR_ORDER', payload: { items } })
  }

  const setInventory = (newInventory) => {
    dispatch({ type: 'SET_INVENTORY', payload: newInventory })
  }

  const getInventoryStatus = (productId) => {
    const count = inventory[productId] || 0
    if (count === 0) return '품절'
    if (count < 5) return '주의'
    return '정상'
  }

  const value = {
    inventory,
    loading,
    updateInventory,
    reduceInventoryForOrder,
    setInventory,
    getInventoryStatus
  }

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  )
}

export const useInventory = () => {
  const context = useContext(InventoryContext)
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider')
  }
  return context
}