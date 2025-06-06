import MainRoutes from './app/routes/MainRoutes'
import { SocketProvider } from './app/contexts/SocketContext'

function App() {
  return (
    <SocketProvider>
      <MainRoutes />
    </SocketProvider>
  )
}

export default App
