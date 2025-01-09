import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/user/HomePage';
import ProductDetailPage from './pages/user/ProductDetailPage';
import LoginPage from './pages/user/LoginPage'; 
import RegisterPage from './pages/user/RegisterPage';
import CartPage from './pages/user/CartPage';
import ProfilePage from './pages/user/ProfilePage';
import OrderPage from './pages/user/OrderPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCategory from './pages/admin/AdminCategory';
import AdminProduct from './pages/admin/AdminProduct';
import AdminOrder from './pages/admin/AdminOrder';  
import AdminUser from './pages/admin/AdminUser'; 
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route index element={<HomePage/>}/>
      <Route path="/product/:productId" element={<ProductDetailPage/>} />
      <Route path="/login" element={<LoginPage/>} />
      <Route path="/register" element={<RegisterPage/>} />
      <Route path="/user/cart" element={<CartPage/>} />
      <Route path="/user/profile" element={<ProfilePage/>}/>
      <Route path="/user/order" element={<OrderPage/>} />

      <Route path="/admin/dashboard" element={<AdminDashboard/>} />
      <Route path="/admin/categories" element={<AdminCategory/>}/>
      <Route path="/admin/products" element={<AdminProduct/>}/>
      <Route path="/admin/orders" element={<AdminOrder/>}/>
      <Route path="/admin/users" element={<AdminUser/>}/>


    </Routes>
    </BrowserRouter>
  );
}

export default App;
