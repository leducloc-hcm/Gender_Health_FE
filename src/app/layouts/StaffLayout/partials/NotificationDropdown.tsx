import { useEffect, useRef, useState } from 'react'
import { Button } from '@/app/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/app/components/ui/dropdown-menu'
import { Bell } from 'lucide-react'
import { io, Socket } from 'socket.io-client'
import { fetcher } from '@/app/apis/fetcher'

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
  const [isLoading, setIsLoading] = useState(false)
  const socketRef = useRef<Socket | null>(null)

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
      await fetcher.put(`/notifications/mark-as-read/${notif.id}`)
      setNotifications((prev) => prev.map((n) => (n.id === notif.id ? { ...n, status: 'READ' } : n)))
    } catch (e) {
      console.error('Error marking notification as read:', e)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='h-9 w-9 rounded-xl hover:bg-pink-50 relative'>
          <Bell className='h-4 w-4 text-pink-600' />
          <span className='absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center'>
            {notifications.filter((n) => n.status === 'UNREAD').length}
          </span>
          <span className='sr-only'>Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-72 rounded-xl border-pink-100 shadow-lg' align='end' forceMount>
        <div className='p-3 bg-gradient-to-r from-pink-50 to-rose-50'>
          <p className='font-semibold text-gray-900'>Notifications</p>
        </div>
        <DropdownMenuSeparator className='bg-pink-100' />
        {isLoading ? (
          <div className='p-4 text-center text-gray-500 text-sm'>Loading...</div>
        ) : notifications.length === 0 ? (
          <div className='p-4 text-center text-gray-500 text-sm'>No notifications</div>
        ) : (
          <div className='max-h-64 overflow-y-auto'>
            {notifications.map((n) => (
              <DropdownMenuItem
                key={n.id}
                className={`rounded-lg mx-1 my-1 hover:bg-pink-50 cursor-pointer ${n.status === 'UNREAD' ? 'bg-pink-50' : 'bg-white'}`}
                onClick={() => handleMarkAsRead(n)}
              >
                <div className='flex flex-col space-y-1 py-1'>
                  <div className='flex justify-between items-start'>
                    <p className={`text-sm font-medium ${n.status === 'UNREAD' ? 'text-pink-600' : 'text-gray-900'}`}>
                      {n.title}
                    </p>
                    <span className='text-xs text-gray-400'>
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className='text-xs text-gray-500 line-clamp-2'>{n.message}</p>
                  {n.status === 'UNREAD' && <span className='text-xs text-pink-500 font-medium'>New</span>}
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        )}
        <DropdownMenuSeparator className='bg-pink-100' />
        <DropdownMenuItem className='rounded-lg mx-1 my-1 hover:bg-pink-50 text-pink-600'>
          <span>View All Notifications</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default NotificationDropdown
