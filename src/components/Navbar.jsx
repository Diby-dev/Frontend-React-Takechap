import { Link, useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/useAuth';

export default function Navbar() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    const activeRole = role || user?.role;
    switch (activeRole) {
      case 'super_admin': return '/super-admin';
      case 'admin': return '/admin';
      case 'vendeur': return '/vendeur';
      case 'client': return '/client';
      default: return '/client';
    }
  };

  return (
    <header className="w-full bg-white border-slate-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 grid grid-cols-3 items-center">
        
        {/* GAUCHE : Logo Takechap en noir */}
        <div className="flex justify-start">
          <Link
            to="/"
            className="group relative inline-block text-2xl font-extrabold tracking-tight text-black transition-transform duration-300 ease-out hover:scale-105 active:scale-95"
          >
            <span>Takechap</span>
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-0.5 bg-black" />
          </Link>
        </div>

        {/* CENTRE : Se connecter en vert -> Se déconnecter en rouge si connecté */}
        <div className="flex justify-center">
          {!user ? (
            <Link
              to="/login"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm px-6 py-2.5 rounded-full shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md hover:shadow-emerald-600/25 active:translate-y-0"
            >
              Se connecter
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-semibold text-sm px-6 py-2.5 rounded-full shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md hover:shadow-red-600/25 active:translate-y-0 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Se déconnecter</span>
            </button>
          )}
        </div>

        {/* DROITE : S'inscrire en noir -> Espace (vers l'espace client/rôle) si connecté */}
        <div className="flex justify-end">
          {!user ? (
            <Link
              to="/register"
              className="bg-black hover:bg-neutral-800 text-white font-semibold text-sm px-6 py-2.5 rounded-full shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/25 active:translate-y-0"
            >
              S'inscrire
            </Link>
          ) : (
            <Link
              to={getDashboardLink()}
              className="flex items-center gap-2 bg-black hover:bg-neutral-800 text-white font-semibold text-sm px-6 py-2.5 rounded-full shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/25 active:translate-y-0"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Espace</span>
            </Link>
          )}
        </div>

      </nav>
    </header>
  );
}