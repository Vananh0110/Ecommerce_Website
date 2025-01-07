import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/user/HomePage';
import ProductDetailPage from './pages/user/ProductDetailPage';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route index element={<HomePage/>}/>
      <Route path="/product/:productId" element={<ProductDetailPage/>} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
