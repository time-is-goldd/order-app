import { Link, useLocation } from 'react-router-dom'
import './Header.css'

const Header = () => {
  const location = useLocation()

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <h1>COZY</h1>
        </div>
        <nav className="navigation">
          <Link 
            to="/" 
            className={`nav-button ${location.pathname === '/' ? 'active' : ''}`}
          >
            주문하기
          </Link>
          <Link 
            to="/admin" 
            className={`nav-button ${location.pathname === '/admin' ? 'active' : ''}`}
          >
            관리자
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Header
