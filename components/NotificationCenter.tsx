import { X } from 'lucide-react'
import { useState } from 'react'

type Notification = {
  id: string
  title: string
  message: string
  date: string
}

export const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', title: 'Application Update', message: 'Your application status has changed.', date: '2023-05-01' },
    { id: '2', title: 'New Message', message: 'You have a new message from the admissions team.', date: '2023-05-02' },
    { id: '3', title: 'Deadline Reminder', message: 'Application deadline is approaching.', date: '2023-05-03' },
  ])

  const removeNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-20 max-h-96 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Notifications</h2>
        {notifications.length === 0 ? (
          <p className="text-gray-500">No new notifications</p>
        ) : (
          notifications.map((notification) => (
            <div key={notification.id} className="mb-4 p-3 bg-gray-100 rounded-md relative">
              <h3 className="font-semibold">{notification.title}</h3>
              <p className="text-sm text-gray-600">{notification.message}</p>
              <p className="text-xs text-gray-400 mt-1">{notification.date}</p>
              <button
                onClick={() => removeNotification(notification.id)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

