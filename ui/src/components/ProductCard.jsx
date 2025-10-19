import './ProductCard.css'

const ProductCard = ({ product, selectedOptions, onOptionChange, onAddToCart }) => {
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
        
        <div className="product-options">
          <label className="option-item">
            <input
              type="checkbox"
              checked={selectedOptions.shot}
              onChange={(e) => onOptionChange('shot', e.target.checked)}
            />
            <span>샷 추가 (+500원)</span>
          </label>
          
          <label className="option-item">
            <input
              type="checkbox"
              checked={selectedOptions.syrup}
              onChange={(e) => onOptionChange('syrup', e.target.checked)}
            />
            <span>시럽 추가 (+0원)</span>
          </label>
        </div>
        
        <button className="add-to-cart-btn" onClick={onAddToCart}>
          담기
        </button>
      </div>
    </div>
  )
}

export default ProductCard
