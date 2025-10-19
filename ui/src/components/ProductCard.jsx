import './ProductCard.css'

const ProductCard = ({ 
  product, 
  selectedOptions, 
  onOptionChange, 
  onAddToCart, 
  isOutOfStock, 
  stockStatus, 
  stockCount 
}) => {
  return (
    <div className="product-card">
      <div className="product-image">
        <div className="product-image-display">
          {product.image}
        </div>
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">{product.price.toLocaleString()}원</p>
        <p className="product-description">{product.description}</p>
        
        <div className="stock-info">
          <span className="stock-count">재고: {stockCount}개</span>
          <span className={`stock-status ${stockStatus === '품절' ? 'out-of-stock' : stockStatus === '주의' ? 'low-stock' : 'normal-stock'}`}>
            {stockStatus}
          </span>
        </div>
        
        <div className={`product-options ${isOutOfStock ? 'disabled' : ''}`}>
          <label className="option-item">
            <input
              type="checkbox"
              checked={selectedOptions.shot}
              onChange={(e) => onOptionChange('shot', e.target.checked)}
              disabled={isOutOfStock}
            />
            <span>샷 추가 (+500원)</span>
          </label>
          
          <label className="option-item">
            <input
              type="checkbox"
              checked={selectedOptions.syrup}
              onChange={(e) => onOptionChange('syrup', e.target.checked)}
              disabled={isOutOfStock}
            />
            <span>시럽 추가 (+0원)</span>
          </label>
        </div>
        
        <button 
          className={`add-to-cart-btn ${isOutOfStock ? 'disabled' : ''}`} 
          onClick={onAddToCart}
          disabled={isOutOfStock}
        >
          {isOutOfStock ? '품절' : '담기'}
        </button>
      </div>
    </div>
  )
}

export default ProductCard
