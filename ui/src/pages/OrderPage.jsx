import { useState } from 'react'
import ProductCard from '../components/ProductCard'
import Cart from '../components/Cart'
import { useCart } from '../context/CartContext'
import { useInventory } from '../context/InventoryContext'
import './OrderPage.css'

const OrderPage = () => {
  const { addToCart } = useCart()
  const { inventory, getInventoryStatus } = useInventory()
  const [selectedOptions, setSelectedOptions] = useState({
    'americano-ice': { shot: false, syrup: false },
    'americano-hot': { shot: false, syrup: false },
    'cafe-latte': { shot: false, syrup: false },
    'cappuccino': { shot: false, syrup: false },
    'mocha': { shot: false, syrup: false },
    'vanilla-latte': { shot: false, syrup: false }
  })

  const products = [
    {
      id: 'americano-ice',
      name: '아메리카노(ICE)',
      price: 4000,
      description: '깔끔하고 시원한 아이스 아메리카노',
      image: '🧊☕'
    },
    {
      id: 'americano-hot',
      name: '아메리카노(HOT)',
      price: 4000,
      description: '따뜻하고 진한 핫 아메리카노',
      image: '☕'
    },
    {
      id: 'cafe-latte',
      name: '카페라떼',
      price: 5000,
      description: '부드러운 우유와 에스프레소의 조화',
      image: '🥛☕'
    },
    {
      id: 'cappuccino',
      name: '카푸치노',
      price: 5000,
      description: '진한 에스프레소와 벨벳같은 우유 거품',
      image: '☕💨'
    },
    {
      id: 'mocha',
      name: '모카',
      price: 5500,
      description: '달콤한 초콜릿과 커피의 만남',
      image: '🍫☕'
    },
    {
      id: 'vanilla-latte',
      name: '바닐라 라떼',
      price: 5500,
      description: '달콤한 바닐라 시럽이 들어간 라떼',
      image: '🌿☕'
    }
  ]

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
    
    if (stockStatus === '품절') {
      alert(`${product.name}은(는) 품절되었습니다.`)
      return
    }

    const options = selectedOptions[product.id]
    const optionsText = []
    let additionalPrice = 0

    if (options.shot) {
      optionsText.push('샷 추가')
      additionalPrice += 500
    }
    if (options.syrup) {
      optionsText.push('시럽 추가')
    }

    const cartItem = {
      ...product,
      options: optionsText,
      additionalPrice,
      totalPrice: product.price + additionalPrice,
      quantity: 1
    }

    addToCart(cartItem)
  }

  return (
    <div className="order-page">
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
