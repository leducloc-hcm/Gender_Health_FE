import { fetcher } from '@/app/apis/fetcher'
import { notificationApi } from '@/app/apis/notification.api'
import { Button } from '@/app/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/app/components/ui/dropdown-menu'
import { Bell } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'

type Notification = {
  id: number
  title: string
  message: string
  status: 'UNREAD' | 'READ'
  createdAt: string
}

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [connected, setConnected] = useState(false)
  console.log('connected: ', connected)
  const [isLoading, setIsLoading] = useState(false)
  const socketRef = useRef<Socket | null>(null)
  console.log(connected)
  const fetchNotifications = (token: string) =>
    fetcher
      .get('/notifications', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        const data = Array.isArray(res?.data) ? res.data : Array.isArray(res?.data?.data) ? res.data.data : []
        setNotifications(data)
      })
      .catch((e) => {
        console.error('Error fetching notifications:', e)
        setNotifications([])
      })

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) return
    setIsLoading(true)
    fetchNotifications(token).finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) return
    const socket = io(import.meta.env.VITE_API_BASE_URL, { auth: { token } })
    socketRef.current = socket

    socket.on('connect', () => setConnected(true))
    socket.on('disconnect', () => setConnected(false))
    socket.on('notification', () => fetchNotifications(token))
    socket.on('connect_error', () => setConnected(false))

    return () => {
      socket.disconnect()
    }
  }, [])

  const handleMarkAsRead = async (notif: Notification) => {
    if (notif.status === 'READ') return
    try {
      await notificationApi.markAsRead(notif.id)
      setNotifications((prev) => prev.map((n) => (n.id === notif.id ? { ...n, status: 'READ' } : n)))
    } catch (e) {
      console.error('Error marking notification as read:', e)
    }
  }
  const handleMarkAsReadAll = async () => {
    try {
      await notificationApi.markAsReadAll()
      setNotifications((prev) => prev.map((n) => ({ ...n, status: 'READ' })))
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='relative h-8 w-8 sm:h-9 sm:w-9 rounded-xl hover:bg-pink-50 transition-colors duration-200'
        >
          <Bell className='h-4 w-4 text-pink-600' />
          {notifications.filter((n) => n.status === 'UNREAD').length > 0 && (
            <span className='absolute -top-1 -right-1 h-6 w-6 sm:h-5 sm:w-5 bg-red-500 rounded-full text-[9px] sm:text-[8px] text-white flex items-center justify-center font-medium min-w-[20px] sm:min-w-[20px]'>
              {notifications.filter((n) => n.status === 'UNREAD').length > 99
                ? '99+'
                : notifications.filter((n) => n.status === 'UNREAD').length}
            </span>
          )}
          <span className='sr-only'>Notifications</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className='w-80 sm:w-96 max-w-[calc(100vw-2rem)] rounded-xl border-pink-100 shadow-xl bg-white'
        align='end'
        forceMount
        sideOffset={8}
      >
        <div className='p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-t-xl'>
          <div className='flex items-center justify-between'>
            <h3 className='font-semibold text-gray-900 text-base'>Notifications</h3>
            {connected && (
              <div className='flex items-center gap-1'>
                <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
                <span className='text-xs text-gray-600 hidden sm:inline'>Live</span>
              </div>
            )}
          </div>
          {notifications.filter((n) => n.status === 'UNREAD').length > 0 && (
            <p className='text-xs text-pink-600 mt-1'>
              {notifications.filter((n) => n.status === 'UNREAD').length} new notification
              {notifications.filter((n) => n.status === 'UNREAD').length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        <DropdownMenuSeparator className='bg-pink-100' />

        {/* Content */}
        {isLoading ? (
          <div className='p-6 text-center'>
            <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-pink-600 mx-auto mb-2'></div>
            <p className='text-gray-500 text-sm'>Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className='p-6 text-center'>
            <Bell className='h-8 w-8 text-gray-300 mx-auto mb-2' />
            <p className='text-gray-500 text-sm font-medium'>No notifications</p>
            <p className='text-gray-400 text-xs mt-1'>You're all caught up!</p>
          </div>
        ) : (
          <div className='max-h-80 sm:max-h-96 overflow-y-auto'>
            {notifications.map((n) => (
              <DropdownMenuItem
                key={n.id}
                className={`
                p-0 focus:bg-pink-50 cursor-pointer transition-colors duration-150
                ${n.status === 'UNREAD' ? 'bg-pink-25' : 'bg-white hover:bg-gray-50'}
              `}
                onClick={() => handleMarkAsRead(n)}
              >
                <div className='w-full p-3 sm:p-4'>
                  <div className='flex items-start gap-3'>
                    {/* Status indicator */}
                    <div className='flex-shrink-0 mt-1'>
                      {n.status === 'UNREAD' ? (
                        <div className='w-2 h-2 bg-pink-500 rounded-full'></div>
                      ) : (
                        <div className='w-2 h-2 bg-gray-300 rounded-full'></div>
                      )}
                    </div>

                    {/* Content */}
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-start justify-between gap-2 mb-1'>
                        <h4
                          className={`
                          text-sm font-medium leading-tight truncate
                          ${n.status === 'UNREAD' ? 'text-pink-700' : 'text-gray-900'}
                        `}
                        >
                          {n.title}
                        </h4>
                        <span className='text-xs text-gray-500 whitespace-nowrap flex-shrink-0'>
                          {new Date(n.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </span>
                      </div>

                      <p className='text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-2 mb-2'>{n.message}</p>

                      {n.status === 'UNREAD' && (
                        <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-700'>
                          New
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        )}

        <DropdownMenuSeparator className='bg-pink-100' />

        <DropdownMenuItem
          onClick={() => {
            handleMarkAsReadAll()
          }}
          className='p-3 sm:p-4 hover:bg-pink-50 text-pink-600 font-medium text-sm justify-center cursor-pointer transition-colors duration-150'
        >
          <span>Mark as read all</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default NotificationDropdown
