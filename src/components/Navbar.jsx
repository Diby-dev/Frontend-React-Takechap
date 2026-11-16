import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, LogOut, LayoutDashboard, User } from 'lucide-react';
import { useAuth } from '../context/useAuth';

export default function Navbar() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    switch (role) {
      case 'super_admin': return '/super-admin';
      case 'admin': return '/admin';
      case 'vendeur': return '/vendeur';
      case 'client': return '/client';
      default: return '/';
    }
  };

  return (
    <nav className="bg-slate-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-emerald-400">
          <ShoppingBag className="w-6 h-6" />
          <span>Takechap</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/" className="text-sm text-slate-300 hover:text-white transition">
            Catalogue
          </Link>

          {!user ? (
            <>
              <Link to="/login" className="text-sm text-slate-300 hover:text-white transition">
                Connexion
              </Link>
              <Link
                to="/register"
                className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold text-sm px-4 py-2 rounded-lg transition"
              >
                Inscription Client
              </Link>
            </>
          ) : (
            <>
              <Link
                to={getDashboardLink()}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 text-sm px-3 py-2 rounded-lg transition"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Mon Espace ({role})</span>
              </Link>

              <span className="hidden sm:flex items-center gap-1 text-xs text-slate-400">
                <User className="w-3.5 h-3.5" />
                {user.prenom}
              </span>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-sm text-rose-400 hover:text-rose-300 transition cursor-pointer"
                title="Déconnexion"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}