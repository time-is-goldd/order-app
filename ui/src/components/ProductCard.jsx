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
  // 이미지 파일명 생성 (메뉴명을 기반으로)
  const getImageName = (productName) => {
    const nameMap = {
      '아메리카노(ICE)': 'americano-ice - 복사본',
      '아메리카노(HOT)': 'americano-hot - 복사본',
      '카페라떼': 'caffe-latte - 복사본'
    }
    return nameMap[productName] || 'default'
  }

  const imageName = getImageName(product.name)
  const imagePath = `/images/${imageName}.jpg`

  return (
    <div className="product-card">
      <div className="product-image">
        <img 
          src={imagePath} 
          alt={product.name}
          className="product-image-display"
          onError={(e) => {
            // 이미지 로드 실패 시 기본 이미지 또는 이모지 표시
            e.target.style.display = 'none'
            e.target.nextSibling.style.display = 'block'
          }}
        />
        <div className="product-image-fallback" style={{ display: 'none' }}>
          ☕
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
