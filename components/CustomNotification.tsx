import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

type NotificationType = 'success' | 'error' | 'info'

interface CustomNotificationProps {
  type: NotificationType
  message: string
  onClose: () => void
}

export const CustomNotification: React.FC<CustomNotificationProps> = ({ type, message, onClose }) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onClose()
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  if (!isVisible) return null

  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'

  return (
    <div
      className={`fixed bottom-4 right-4 p-4 rounded-md shadow-lg ${bgColor} text-white`}
    >
      <div className="flex items-center">
        <p>{message}</p>
        <button onClick={onClose} className="ml-4">
          <X size={16} />
        </button>
      </div>
    </div>
  )
}

