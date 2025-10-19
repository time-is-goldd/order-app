import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import OrderPage from './pages/OrderPage'
import AdminPage from './pages/AdminPage'
import { CartProvider } from './context/CartContext'
import { OrderProvider } from './context/OrderContext'
import { InventoryProvider } from './context/InventoryContext'
import './App.css'

function App() {
  return (
    <InventoryProvider>
      <CartProvider>
        <OrderProvider>
          <Router>
            <div className="app">
              <Header />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<OrderPage />} />
                  <Route path="/admin" element={<AdminPage />} />
                </Routes>
              </main>
            </div>
          </Router>
        </OrderProvider>
      </CartProvider>
    </InventoryProvider>
  )
}

export default App