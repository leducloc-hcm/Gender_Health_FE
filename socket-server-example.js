// Example Socket.IO server implementation for your backend
// This is just an example - integrate this into your existing Express server

const express = require('express')
const http = require('http')
const socketIo = require('socket.io')
const cors = require('cors')

const app = express()
const server = http.createServer(app)

// Configure Socket.IO with CORS
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000', // Your React app URL
    methods: ['GET', 'POST'],
    credentials: true
  }
})

// Middleware for Socket.IO authentication
io.use((socket, next) => {
  const token = socket.handshake.auth.token
  if (token) {
    // Verify your JWT token here
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // socket.userId = decoded.userId;
    // socket.userRole = decoded.role;
    next()
  } else {
    next(new Error('Authentication error'))
  }
})

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  // Join conversation room
  socket.on('joinConversation', (conversationId) => {
    socket.join(`conversation_${conversationId}`)
    console.log(`User ${socket.id} joined conversation ${conversationId}`)
  })

  // Handle sending messages
  socket.on('sendMessage', async (data) => {
    try {
      const { conversation_id, message } = data

      // Save message to database here
      const newMessage = {
        id: Date.now(), // Use proper ID generation
        sender: socket.userRole || 'user',
        message: message,
        created_at: new Date().toISOString(),
        conversation_id: conversation_id
      }

      // Broadcast message to all users in the conversation room
      io.to(`conversation_${conversation_id}`).emit('newMessage', newMessage)
    } catch (error) {
      console.error('Error sending message:', error)
      socket.emit('error', { message: 'Failed to send message' })
    }
  })

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

// Your existing Express routes here
app.use(cors())
app.use(express.json())

// Example API routes
app.get('/api/conversations', (req, res) => {
  // Your existing conversation logic
})

app.post('/api/messages', (req, res) => {
  // Your existing message posting logic
})

const PORT = process.env.PORT || 4000
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
