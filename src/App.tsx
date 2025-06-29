import { SocketProvider } from './app/contexts/SocketContext'
import MainRoutes from './app/routes/MainRoutes'

function App() {
  return (
    <>
      <SocketProvider>
        <MainRoutes />
      </SocketProvider>
    </>
  )
}

export default App
