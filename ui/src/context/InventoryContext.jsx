import { createContext, useContext, useReducer } from 'react'

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
  const [inventory, dispatch] = useReducer(inventoryReducer, {
    'americano-ice': 10,
    'americano-hot': 10,
    'cafe-latte': 10,
    'cappuccino': 10,
    'mocha': 10,
    'vanilla-latte': 10
  })

  const updateInventory = (productId, change) => {
    dispatch({ type: 'UPDATE_INVENTORY', payload: { productId, change } })
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