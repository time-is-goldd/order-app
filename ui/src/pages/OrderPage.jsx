import { useState } from 'react'
import ProductCard from '../components/ProductCard'
import Cart from '../components/Cart'
import Notification from '../components/Notification'
import { useCart } from '../context/CartContext'
import { useInventory } from '../context/InventoryContext'
import { PRODUCTS, OPTIONS } from '../utils/constants'
import { formatPrice } from '../utils/helpers'
import './OrderPage.css'

const OrderPage = () => {
  const { addToCart, getCartItemQuantity } = useCart()
  const { inventory, getInventoryStatus } = useInventory()
  const [notification, setNotification] = useState(null)
  const [selectedOptions, setSelectedOptions] = useState({
    'americano-ice': { shot: false, syrup: false },
    'americano-hot': { shot: false, syrup: false },
    'cafe-latte': { shot: false, syrup: false },
    'cappuccino': { shot: false, syrup: false },
    'mocha': { shot: false, syrup: false },
    'vanilla-latte': { shot: false, syrup: false }
  })

  const products = PRODUCTS

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type })
  }

  const handleOptionChange = (productId, optionType, checked) => {
    setSelectedOptions(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [optionType]: checked
      }
    }))
  }

  const handleAddToCart = (product) => {
    const stockStatus = getInventoryStatus(product.id)
    const currentStock = inventory[product.id] || 0
    
    if (stockStatus === '품절') {
      showNotification(`${product.name}은(는) 품절되었습니다.`, 'error')
      return
    }

    // 현재 장바구니에 있는 해당 상품의 총 수량 계산
    const cartQuantity = getCartItemQuantity(product.id)
    
    // 재고 부족 체크
    if (cartQuantity >= currentStock) {
      showNotification(`${product.name}의 재고가 부족합니다. (재고: ${currentStock}개)`, 'error')
      return
    }

    const options = selectedOptions[product.id]
    const optionsText = []
    let additionalPrice = 0

    if (options.shot) {
      optionsText.push(OPTIONS.SHOT.name)
      additionalPrice += OPTIONS.SHOT.price
    }
    if (options.syrup) {
      optionsText.push(OPTIONS.SYRUP.name)
      additionalPrice += OPTIONS.SYRUP.price
    }

    const cartItem = {
      ...product,
      options: optionsText,
      additionalPrice,
      totalPrice: product.price + additionalPrice,
      quantity: 1
    }

    addToCart(cartItem)
    showNotification(`${product.name}이(가) 장바구니에 추가되었습니다.`, 'success')
  }

  return (
    <div className="order-page">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      
      <div className="products-section">
        <div className="products-grid">
          {products.map(product => {
            const stockStatus = getInventoryStatus(product.id)
            const isOutOfStock = stockStatus === '품절'
            
            return (
              <ProductCard
                key={product.id}
                product={product}
                selectedOptions={selectedOptions[product.id]}
                onOptionChange={(optionType, checked) => 
                  handleOptionChange(product.id, optionType, checked)
                }
                onAddToCart={() => handleAddToCart(product)}
                isOutOfStock={isOutOfStock}
                stockStatus={stockStatus}
                stockCount={inventory[product.id]}
              />
            )
          })}
        </div>
      </div>
      <Cart />
    </div>
  )
}

export default OrderPage
