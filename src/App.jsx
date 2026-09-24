import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Login from "./pages/Login"
import Products from './pages/Products'
import ProtectedRoute from './components/ProtectedRoute'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/products" replace />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
