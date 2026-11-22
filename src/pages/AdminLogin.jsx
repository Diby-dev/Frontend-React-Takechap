import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/useAuth';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    mot_de_passe: '',
    selectedRole: 'admin', // 'admin' | 'super_admin'
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(
        formData.email.trim(),
        formData.mot_de_passe,
        formData.selectedRole
      );

      const resolvedRole = data?.role || data?.user?.role || formData.selectedRole;

      if (resolvedRole !== 'admin' && resolvedRole !== 'super_admin') {
        setError("Ce compte n'a pas les droits d'administration.");
        return;
      }

      navigate('/admin');
    } catch (err) {
      const validationErrors = err.response?.data?.errors;
      const firstFieldError = validationErrors
        ? Object.values(validationErrors)[0]?.[0]
        : null;

      setError(
        firstFieldError ||
          err.response?.data?.message ||
          'Identifiants administrateur invalides.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-md w-full mx-auto mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à la boutique</span>
        </Link>
      </div>

      <div className="max-w-md w-full mx-auto bg-slate-900 border border-slate-800 rounded-3xl shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            Takechap • Accès réservé
          </p>
          <h1 className="text-2xl font-extrabold text-white">
            Connexion Admin &amp; Superadmin
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Connectez-vous pour superviser les comptes, boutiques et produits.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-xs sm:text-sm rounded-2xl px-4 py-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type de compte */}
          <div>
            <label
              htmlFor="selectedRole"
              className="block text-xs font-bold text-slate-300 mb-1.5"
            >
              Rôle de connexion
            </label>
            <select
              id="selectedRole"
              name="selectedRole"
              value={formData.selectedRole}
              onChange={handleChange}
              className="w-full px-4 py-3 text-sm bg-slate-800 border border-slate-700 text-white rounded-2xl focus:outline-none focus:border-emerald-500 transition"
            >
              <option value="admin">Administrateur (Admin)</option>
              <option value="super_admin">Super Administrateur (Superadmin)</option>
            </select>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-bold text-slate-300 mb-1.5"
            >
              Adresse email professionnelle
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@takechap.com"
              className="w-full px-4 py-3 text-sm bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-2xl focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          {/* Mot de passe */}
          <div>
            <label
              htmlFor="mot_de_passe"
              className="block text-xs font-bold text-slate-300 mb-1.5"
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
                className="w-full px-4 py-3 pr-11 text-sm bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-2xl focus:outline-none focus:border-emerald-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label="Afficher ou masquer le mot de passe"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white font-semibold text-sm py-3.5 rounded-full shadow-md transition cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{loading ? 'Vérification...' : 'Accéder au Dashboard'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}