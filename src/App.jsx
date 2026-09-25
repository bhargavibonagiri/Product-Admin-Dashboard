import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Login from "./pages/Login"
import Products from './pages/Products'
import ProductDetails from './pages/ProductDetails'
import ProtectedRoute from './components/ProtectedRoute'
import AddProduct from './pages/AddProduct'
import EditProduct from './pages/EditProduct'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
        <Route path="/products/add" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
        <Route path="/products/:id/edit" element={<ProtectedRoute><EditProduct /></ProtectedRoute>} />
        <Route path="/products/:id" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/products" replace />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
