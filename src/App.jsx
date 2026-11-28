import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Register from './pages/Register';
import ClientDashboard from './pages/ClientDashboard';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import VendeurInscrip from './pages/VendeurInscrip';
import VendeurDashboard from './pages/VendeurDashboard';
import ProduitDetail from './pages/ProduitDetail';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/client" element={<ClientDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/super-admin" element={<AdminDashboard />} />
          <Route path="/VendeurInscrip" element={<VendeurInscrip />} />
          <Route path="/vendeur-inscription" element={<VendeurInscrip />} />
          <Route path="/vendeur" element={<VendeurDashboard />} />
          <Route path="/produit/:id" element={<ProduitDetail />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}