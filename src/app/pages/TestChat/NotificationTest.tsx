import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'

const SOCKET_URL = 'http://localhost:4000'
const API_URL = 'http://localhost:4000'

type Notification = {
  id: number
  title: string
  message: string
  status: 'UNREAD' | 'READ'
  createdAt: string
}

export default function NotificationTest() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [connected, setConnected] = useState(false)
  const socketRef = useRef<Socket | null>(null)

  // Initial fetch of notifications
  useEffect(() => {
    const accessToken = localStorage.getItem('access_token')
    if (!accessToken) return
    axios
      .get(`${API_URL}/notifications`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      .then((response) => {
        const notificationsArray: Notification[] = Array.isArray(response.data.data)
          ? response.data.data
          : response.data.data || []
        setNotifications(notificationsArray)
      })
      .catch((error) => {
        console.error('Error fetching notifications:', error)
      })
  }, [])

  // Socket connection and notification updates
  useEffect(() => {
    const accessToken = localStorage.getItem('access_token')
    if (!accessToken) return

    const socket = io(SOCKET_URL, {
      auth: { token: accessToken }
    })
    socketRef.current = socket

    socket.on('connect', () => {
      setConnected(true)
    })
    socket.on('disconnect', () => {
      setConnected(false)
    })

    socket.on('notification', () => {
      axios
        .get(`${API_URL}/notifications`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        })
        .then((response) => {
          const notificationsArray: Notification[] = Array.isArray(response.data.data)
            ? response.data.data
            : response.data.data || []
          setNotifications(notificationsArray)
        })
        .catch((error) => {
          console.error('Error fetching notifications:', error)
        })
    })

    socket.on('connect_error', () => {
      setConnected(false)
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  // Mark notification as read
  const handleMarkAsRead = async (notif: Notification) => {
    if (notif.status === 'READ') return
    const accessToken = localStorage.getItem('access_token')
    try {
      await axios.put(
        `${API_URL}/notifications/mark-as-read/${notif.id}`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      )
      setNotifications((prev) => prev.map((n) => (n.id === notif.id ? { ...n, status: 'READ' } : n)))
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <div className='bg-white shadow-md rounded p-8 w-full max-w-lg'>
        <h2 className='text-2xl font-bold mb-4 text-center'>Notification Test</h2>
        <div className='mb-2 text-center'>
          Socket status:{' '}
          {connected ? (
            <span className='text-green-600 font-semibold'>Connected</span>
          ) : (
            <span className='text-red-600 font-semibold'>Disconnected</span>
          )}
        </div>
        <div className='mt-6'>
          <h3 className='text-lg font-semibold mb-2'>Received Notifications: {notifications.length}</h3>
          {notifications.length === 0 ? (
            <div className='text-gray-500'>No notifications received yet.</div>
          ) : (
            <ul className='space-y-2 max-h-64 overflow-y-auto'>
              {notifications.map((notif) => (
                <li
                  key={notif.id}
                  className={`rounded px-3 py-2 cursor-pointer transition-colors ${notif.status === 'READ' ? 'bg-gray-200 text-gray-500' : 'bg-blue-100 text-blue-800 hover:bg-blue-200'}`}
                  onClick={() => handleMarkAsRead(notif)}
                  title={notif.status === 'READ' ? 'Read' : 'Click to mark as read'}
                >
                  <div className='font-semibold'>{notif.title}</div>
                  <div>{notif.message}</div>
                  <div className='text-xs text-gray-400'>{new Date(notif.createdAt).toLocaleString()}</div>
                  {notif.status === 'READ' && <span className='ml-2 text-xs'>(Read)</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
