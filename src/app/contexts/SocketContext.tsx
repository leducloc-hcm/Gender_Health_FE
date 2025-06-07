import { createContext, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { io, Socket } from 'socket.io-client'

interface SocketContextType {
  socket: Socket | null
  connected: boolean
  reinitializeSocket: () => void
}

export const SocketContext = createContext<SocketContextType>({
  socket: null,
  connected: false,
  reinitializeSocket: () => {}
})

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [connected, setConnected] = useState(false)
  const socketRef = useRef<Socket | null>(null)

  const initializeSocket = (token: string) => {
    if (socketRef.current) {
      socketRef.current.disconnect()
      socketRef.current = null
    }

    if (!token) {
      setConnected(false)
      return
    }

    const socket = io(import.meta.env.VITE_API_BASE_URL, {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    })

    socketRef.current = socket

    socket.on('connect', () => {
      console.log('Socket connected')
      setConnected(true)
    })

    socket.on('disconnect', () => {
      console.log('Socket disconnected')
      setConnected(false)
    })

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error)
      setConnected(false)
    })

    return socket
  }

  const reinitializeSocket = () => {
    console.log('Reinitializing socket connection')
    const token = localStorage.getItem('access_token')
    initializeSocket(token || '')
  }

  useEffect(() => {
    // Initial socket setup
    const token = localStorage.getItem('access_token')
    if (token) {
      initializeSocket(token)
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [])

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, connected, reinitializeSocket }}>
      {children}
    </SocketContext.Provider>
  )
}
