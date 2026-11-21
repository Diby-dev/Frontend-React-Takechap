import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, LogIn } from 'lucide-react';
import { useAuth } from '../context/useAuth';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    mot_de_passe: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getRedirectByRole = (userRole) => {
    switch (userRole) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(formData.email.trim(), formData.mot_de_passe);
      const activeRole = data?.role || data?.user?.role || 'client';
      navigate(getRedirectByRole(activeRole));
    } catch (err) {
      const validationErrors = err.response?.data?.errors;
      const firstFieldError = validationErrors
        ? Object.values(validationErrors)[0]?.[0]
        : null;

      setError(
        firstFieldError ||
          err.response?.data?.message ||
          'Adresse email ou mot de passe incorrect.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Retour à l'accueil */}
      <div className="max-w-md w-full mx-auto mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-black transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à l&apos;accueil</span>
        </Link>
      </div>

      {/* Carte du formulaire */}
      <div className="max-w-md w-full mx-auto bg-white border border-slate-200 rounded-3xl shadow-sm p-8 space-y-6">
        <div className="text-center space-y-2">
          <Link
            to="/"
            className="inline-block text-2xl font-extrabold tracking-tight text-black"
          >
            Takechap
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Se connecter
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Connectez-vous pour accéder à votre espace Takechap.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-2xl px-4 py-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Adresse email */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-bold text-slate-700 mb-1.5"
            >
              Adresse email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="exemple@email.com"
              className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:bg-white focus:border-emerald-600 transition"
            />
          </div>

          {/* Mot de passe */}
          <div>
            <label
              htmlFor="mot_de_passe"
              className="block text-xs font-bold text-slate-700 mb-1.5"
            >
              Mot de passe
            </label>
            <div className="relative">
              <input
                id="mot_de_passe"
                name="mot_de_passe"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.mot_de_passe}
                onChange={handleChange}
                placeholder="Entrez votre mot de passe"
                className="w-full px-4 py-3 pr-11 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:bg-white focus:border-emerald-600 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label="Afficher ou masquer le mot de passe"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Bouton Se connecter en vert émeraude */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-400 text-white font-semibold text-sm py-3.5 rounded-full shadow-sm transition-all duration-300 cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'Connexion en cours...' : 'Se connecter'}</span>
          </button>
        </form>

        {/* Lien vers l'inscription */}
        <p className="text-center text-xs sm:text-sm text-slate-500">
          Pas encore de compte ?{' '}
          <Link
            to="/register"
            className="font-bold text-black hover:text-emerald-600 transition"
          >
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
}