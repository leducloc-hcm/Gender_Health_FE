import React, { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import axios from 'axios'

type UserProfile = { name: string; avatar?: string }
type User = { id: number; role: string; customerProfiles?: UserProfile[]; staffProfiles?: UserProfile[] }
type Conversation = {
  id: number
  customer: User
  staff: User
  status: string
  messages?: Message[]
}
type Message = {
  id: number
  sender: User
  message: string
  message_type: string
  created_at: string
  is_read: boolean
}

const API_URL = 'http://localhost:4000/api'
const SOCKET_URL = 'http://localhost:4000'

export default function ChatFlow() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [availableStaff, setAvailableStaff] = useState<User[]>([])
  const [newStaffId, setNewStaffId] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const accessToken = localStorage.getItem('access_token')
  const userRole = localStorage.getItem('user_role')

  // Create axios instance with default config
  const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { Authorization: `Bearer ${accessToken}` })
    }
  })

  // Axios response interceptor for consistent error handling
  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 403) {
        throw new Error('Forbidden: Invalid or expired token')
      }
      if (error.response?.status === 400) {
        throw new Error(`Bad Request: ${error.response?.data?.message || 'Invalid request'}`)
      }
      if (error.response?.status === 401) {
        throw new Error('Unauthorized: Please login again')
      }
      throw new Error(error.response?.data?.message || error.message || 'Network error')
    }
  )

  // Fetch conversations
  useEffect(() => {
    if (!accessToken) return

    const fetchConversations = async () => {
      setLoading(true)
      setError(null)
      try {
        console.log('Access Token:', accessToken)
        const response = await apiClient.get('/conversations')
        console.log('Fetched conversations:', response.data)
        // Handle different possible response structures
        const conversationsData = response.data.result?.conversations || response.data.result || []
        setConversations(conversationsData)
      } catch (err: any) {
        console.error('Error fetching conversations:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchConversations()
  }, [accessToken])

  // Fetch messages when a conversation is selected
  useEffect(() => {
    if (!selectedConversation || !accessToken) return

    const fetchMessages = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await apiClient.get(`/conversations/${selectedConversation.id}/messages`)
        console.log('Fetched messages:', response.data)

        // Handle different possible response structures
        const messagesData = response.data.result?.messages || response.data.result || []
        setMessages(messagesData)
      } catch (err: any) {
        console.error('Error fetching messages:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [selectedConversation, accessToken])

  // Setup socket connection
  useEffect(() => {
    if (!accessToken) return

    const s = io(SOCKET_URL, {
      auth: { token: accessToken }
    })
    setSocket(s)

    s.on('joined_conversation', () => {
      console.log('Joined conversation successfully')
    })

    s.on('new_message', (msg: Message) => {
      console.log('New message received:', msg)
      setMessages((prev) => [...prev, msg])
    })

    s.on('user_typing', (data) => {
      setTyping(data.is_typing)
    })

    s.on('connect_error', (error) => {
      console.error('Socket connection error:', error)
      setError('Socket connection failed')
    })

    return () => {
      s.disconnect()
    }
  }, [accessToken])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Join conversation room via socket
  const handleSelectConversation = (conv: Conversation) => {
    console.log('Selected conversation:', conv)
    setSelectedConversation(conv)
    setMessages([])
    if (socket) {
      socket.emit('join_conversation', { conversation_id: conv.id.toString() })
    }
  }

  // Send message via socket
  const handleSend = () => {
    if (!socket || !input.trim() || !selectedConversation) return

    const messageData = {
      conversation_id: selectedConversation.id.toString(),
      message: input.trim(),
      message_type: 'TEXT'
    }

    console.log('Sending message:', messageData)
    socket.emit('send_message', messageData)
    setInput('')
  }

  // Typing indicator with debounce
  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
    if (socket && selectedConversation) {
      socket.emit('typing', {
        conversation_id: selectedConversation.id.toString(),
        is_typing: true
      })

      // Debounce typing indicator
      setTimeout(() => {
        socket.emit('typing', {
          conversation_id: selectedConversation.id.toString(),
          is_typing: false
        })
      }, 1000)
    }
  }

  // Helper to get user display name
  const getUserName = (user: User) => {
    if (!user) return 'Unknown User'
    if (user.role === 'CUSTOMER') return user.customerProfiles?.[0]?.name || `Customer#${user.id}`
    if (user.role === 'STAFF') return user.staffProfiles?.[0]?.name || `Staff#${user.id}`
    return `User#${user.id}`
  }

  // Check if message should be displayed on the right (customer messages when logged in as customer)
  const isRightSideMessage = (sender: User) => {
    const isLoggedInAsCustomer = userRole === 'customer' || userRole === 'CUSTOMER'
    const isCustomerMessage = sender.role === 'CUSTOMER'

    if (isLoggedInAsCustomer) {
      // If logged in as customer, show customer messages on right
      return isCustomerMessage
    } else {
      // If logged in as staff, show staff messages on right
      return !isCustomerMessage
    }
  }

  // Fetch available staff for new conversation (if customer)
  useEffect(() => {
    if (!userRole || (userRole !== 'customer' && userRole !== 'CUSTOMER')) return
    if (!accessToken) return

    const fetchAvailableStaff = async () => {
      try {
        const response = await apiClient.get('/staff/available')
        console.log('Fetched available staff:', response.data)

        const staffData = response.data.result || []
        setAvailableStaff(staffData)
      } catch (err: any) {
        console.error('Error fetching available staff:', err)
        setAvailableStaff([])
      }
    }

    fetchAvailableStaff()
  }, [userRole, accessToken])

  // Create new conversation
  const handleCreateConversation = async () => {
    if (!newStaffId || !accessToken) return

    setLoading(true)
    setError(null)
    console.log('Creating conversation with staff ID:', newStaffId)

    try {
      const response = await apiClient.post('/conversations', {
        staff_id: Number(newStaffId)
      })

      console.log('Created conversation:', response.data)
      const newConversation = response.data.result

      if (newConversation) {
        setConversations((prev) => [newConversation, ...prev])
        setNewStaffId('')
      }
    } catch (err: any) {
      console.error('Error creating conversation:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Show auth error if no access token
  if (!accessToken) {
    return (
      <div className='flex h-screen bg-gray-100 items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-xl font-bold text-red-500'>Authentication Required</h2>
          <p className='text-gray-600'>Please login to access the chat.</p>
        </div>
      </div>
    )
  }

  return (
    <div className='flex h-screen bg-gray-100'>
      {/* Conversations List */}
      <div className='w-1/4 bg-white border-r overflow-y-auto'>
        <h2 className='text-xl font-bold p-4'>Conversations</h2>
        {error && (
          <div className='p-4 text-red-500 bg-red-50 border-l-4 border-red-500 mx-4 mb-4'>
            <p className='font-semibold'>Error:</p>
            <p className='text-sm'>{error}</p>
          </div>
        )}
        {loading && <div className='p-4 text-gray-500'>Loading...</div>}

        {(userRole === 'customer' || userRole === 'CUSTOMER') && (
          <div className='p-4 border-b'>
            <div className='flex flex-col space-y-2'>
              <select
                className='border px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-green-500'
                value={newStaffId}
                onChange={(e) => setNewStaffId(e.target.value)}
              >
                <option value=''>Select staff member</option>
                {availableStaff.map((staff) => (
                  <option key={staff.id} value={staff.id}>
                    {getUserName(staff)}
                  </option>
                ))}
              </select>
              <button
                className='bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed'
                onClick={handleCreateConversation}
                disabled={!newStaffId || loading}
              >
                {loading ? 'Creating...' : 'New Chat'}
              </button>
            </div>
          </div>
        )}

        <ul>
          {conversations.length === 0 && !loading ? (
            <li className='p-4 text-gray-500 text-center'>No conversations yet</li>
          ) : (
            conversations.map((conv) => (
              <li
                key={conv.id}
                className={`p-4 cursor-pointer hover:bg-gray-200 transition-colors ${
                  selectedConversation?.id === conv.id ? 'bg-blue-100 border-r-4 border-blue-500' : ''
                }`}
                onClick={() => handleSelectConversation(conv)}
              >
                <div>
                  <span className='font-semibold'>{getUserName(conv.staff)}</span>
                  <span className='ml-2 text-xs text-gray-500 capitalize'>({conv.status})</span>
                </div>
                <div className='text-xs text-gray-500 truncate mt-1'>
                  {conv.messages?.[0]?.message || 'No messages yet'}
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Chat Window */}
      <div className='flex-1 flex flex-col'>
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className='p-4 border-b bg-white'>
              <h3 className='font-semibold text-lg'>{getUserName(selectedConversation.staff)}</h3>
              <p className='text-sm text-gray-500 capitalize'>Status: {selectedConversation.status}</p>
            </div>

            {/* Messages */}
            <div className='flex-1 overflow-y-auto p-4 space-y-3'>
              {messages.length === 0 ? (
                <div className='text-gray-500 text-center'>No messages yet. Start the conversation!</div>
              ) : (
                messages.map((msg) => {
                  const isMyMessage = isRightSideMessage(msg.sender)
                  return (
                    <div key={msg.id} className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          isMyMessage ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                        }`}
                      >
                        <div className='font-semibold text-sm mb-1'>{getUserName(msg.sender)}</div>
                        <div>{msg.message}</div>
                        <div className={`text-xs mt-1 ${isMyMessage ? 'text-blue-100' : 'text-gray-500'}`}>
                          {new Date(msg.created_at).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
              <div ref={messagesEndRef} />
              {typing && <div className='text-sm text-gray-500 italic'>Someone is typing...</div>}
            </div>

            {/* Input */}
            <div className='p-4 border-t bg-white'>
              <div className='flex space-x-2'>
                <input
                  className='flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  value={input}
                  onChange={handleTyping}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder='Type your message...'
                />
                <button
                  className='bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed'
                  onClick={handleSend}
                  disabled={!input.trim()}
                >
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className='flex-1 flex items-center justify-center'>
            <div className='text-center text-gray-500'>
              <h3 className='text-xl font-semibold mb-2'>Welcome to Chat</h3>
              <p>Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
