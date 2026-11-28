import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LogOut,
  LogIn,
  UserPlus,
  LayoutDashboard,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../context/useAuth';

export default function Navbar() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    const activeRole = role || user?.role;
    switch (activeRole) {
      case 'super_admin':
        return '/super-admin';
      case 'admin':
        return '/admin';
      case 'vendeur':
        return '/vendeur';
      case 'client':
        return '/client';
      default:
        return '/client';
    }
  };

  const displayName =
    [user?.prenom, user?.nom].filter(Boolean).join(' ') || user?.email || '';

  return (
    <>
      <header className="relative w-full bg-white border-b border-slate-100 z-40">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between md:grid md:grid-cols-3">
          {/* GAUCHE : Logo Takechap en noir */}
          <div className="flex justify-start">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="group relative inline-block text-2xl font-extrabold tracking-tight text-black transition-transform duration-300 ease-out hover:scale-105 active:scale-95"
            >
              <span>Takechap</span>
              <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-0.5 bg-black" />
            </Link>
          </div>

          {/* CENTRE (Desktop) : Se connecter en vert -> Se déconnecter en rouge si connecté */}
          <div className="hidden md:flex justify-center">
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

          {/* DROITE (Desktop) : S'inscrire en noir -> Espace (vers l'espace client/rôle) si connecté */}
          <div className="hidden md:flex justify-end">
            {!user ? (
              <Link
                to="/register"
                className="bg-black hover:bg-neutral-800 text-white font-semibold text-sm px-6 py-2.5 rounded-full shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/25 active:translate-y-0"
              >
                S&apos;inscrire
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

          {/* DROITE (Mobile / Tablette) : Bouton Burger */}
          <div className="flex md:hidden justify-end">
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={menuOpen}
              className={`w-11 h-11 rounded-2xl border flex items-center justify-center transition-all duration-200 cursor-pointer ${
                menuOpen
                  ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
              }`}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* MENU DÉROULANT ANIMÉ VERS LE BAS (MOBILE / TABLETTE) */}
        <div
          className={`md:hidden absolute left-0 right-0 top-full px-4 sm:px-6 pt-2 pb-4 z-50 transition-all duration-300 ease-out origin-top ${
            menuOpen
              ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
              : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'
          }`}
        >
          <div className="max-w-7xl mx-auto bg-white border border-slate-200/90 rounded-3xl shadow-2xl p-4 space-y-3">
            {user && displayName && (
              <div className="px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-slate-500">
                  Connecté en tant que
                </span>
                <span className="text-xs font-bold text-slate-900 truncate max-w-[180px]">
                  {displayName}
                </span>
              </div>
            )}

            {!user ? (
              <div className="flex flex-col gap-2.5">
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm px-5 py-3 rounded-2xl shadow-xs transition"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Se connecter</span>
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-black hover:bg-neutral-800 text-white font-semibold text-sm px-5 py-3 rounded-2xl shadow-xs transition"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>S&apos;inscrire</span>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                <Link
                  to={getDashboardLink()}
                  onClick={() => setMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-black hover:bg-neutral-800 text-white font-semibold text-sm px-5 py-3 rounded-2xl shadow-xs transition"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Espace</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-semibold text-sm px-5 py-3 rounded-2xl shadow-xs transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Se déconnecter</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* VOILE FLOUTÉ EN ARRIÈRE-PLAN (MOBILE / TABLETTE) */}
      <div
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
        className={`md:hidden fixed inset-x-0 bottom-0 top-20 z-30 backdrop-blur-md bg-slate-900/25 transition-opacity duration-300 ${
          menuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      />
    </>
  );
}