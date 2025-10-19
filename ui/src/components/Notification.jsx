import { useState, useEffect } from 'react'
import './Notification.css'

const Notification = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => onClose?.(), 300) // CSS 애니메이션 완료 후 제거
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  if (!isVisible) return null

  return (
    <div className={`notification ${type} ${isVisible ? 'show' : 'hide'}`}>
      <span className="notification-message">{message}</span>
      <button className="notification-close" onClick={() => setIsVisible(false)}>
        ×
      </button>
    </div>
  )
}

export default Notification
