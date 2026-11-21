import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft, UserPlus } from 'lucide-react';
import { useAuth } from '../context/useAuth';

export default function Register() {
  const navigate = useNavigate();
  const { registerClient } = useAuth();

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    mot_de_passe: '',
    mot_de_passe_confirmation: '',
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

    if (formData.mot_de_passe.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    if (formData.mot_de_passe !== formData.mot_de_passe_confirmation) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);
    try {
      await registerClient({
        nom: formData.nom.trim(),
        prenom: formData.prenom.trim(),
        email: formData.email.trim(),
        mot_de_passe: formData.mot_de_passe,
        mot_de_passe_confirmation: formData.mot_de_passe_confirmation,
        password: formData.mot_de_passe,
        password_confirmation: formData.mot_de_passe_confirmation,
        role: 'client',
      });

      navigate('/client');
    } catch (err) {
      const validationErrors = err.response?.data?.errors;
      const firstFieldError = validationErrors
        ? Object.values(validationErrors)[0]?.[0]
        : null;

      setError(
        firstFieldError ||
          err.response?.data?.message ||
          'Une erreur est survenue lors de l’inscription.'
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
            Créer un compte client
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Inscrivez-vous pour commander vos produits facilement.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-2xl px-4 py-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nom */}
          <div>
            <label
              htmlFor="nom"
              className="block text-xs font-bold text-slate-700 mb-1.5"
            >
              Nom
            </label>
            <input
              id="nom"
              name="nom"
              type="text"
              required
              value={formData.nom}
              onChange={handleChange}
              placeholder="Entrez votre nom"
              className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:bg-white focus:border-emerald-600 transition"
            />
          </div>

          {/* Prénom */}
          <div>
            <label
              htmlFor="prenom"
              className="block text-xs font-bold text-slate-700 mb-1.5"
            >
              Prénom
            </label>
            <input
              id="prenom"
              name="prenom"
              type="text"
              required
              value={formData.prenom}
              onChange={handleChange}
              placeholder="Entrez votre prénom"
              className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:bg-white focus:border-emerald-600 transition"
            />
          </div>

          {/* Email */}
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
                placeholder="Minimum 6 caractères"
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

          {/* Confirmer le mot de passe */}
          <div>
            <label
              htmlFor="mot_de_passe_confirmation"
              className="block text-xs font-bold text-slate-700 mb-1.5"
            >
              Confirmer le mot de passe
            </label>
            <input
              id="mot_de_passe_confirmation"
              name="mot_de_passe_confirmation"
              type={showPassword ? 'text' : 'password'}
              required
              value={formData.mot_de_passe_confirmation}
              onChange={handleChange}
              placeholder="Répétez votre mot de passe"
              className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:bg-white focus:border-emerald-600 transition"
            />
          </div>

          {/* Bouton de validation */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 flex items-center justify-center gap-2 bg-black hover:bg-neutral-800 disabled:bg-slate-400 text-white font-semibold text-sm py-3.5 rounded-full shadow-sm transition-all duration-300 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>{loading ? 'Inscription en cours...' : "S'inscrire"}</span>
          </button>
        </form>

        {/* Lien vers la connexion */}
        <p className="text-center text-xs sm:text-sm text-slate-500">
          Vous avez déjà un compte ?{' '}
          <Link
            to="/login"
            className="font-bold text-emerald-600 hover:text-emerald-500 transition"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}