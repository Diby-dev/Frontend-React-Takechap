import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  BadgeCheck,
  Store,
  Phone,
  ImageOff,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/useAuth';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function WhatsAppIcon({ className = 'w-4 h-4' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.82 14.02c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.13.11-1.82-.11-.42-.13-.96-.31-1.65-.61-2.9-1.25-4.79-4.18-4.94-4.37-.15-.19-1.18-1.57-1.18-3 0-1.43.75-2.13 1.01-2.42.27-.29.59-.36.79-.36.2 0 .39 0 .56.01.18.01.42-.07.66.5.24.57.82 2 .89 2.14.07.14.12.31.02.5-.1.19-.15.31-.29.48-.15.17-.31.38-.44.51-.15.15-.3.31-.13.61.17.29.76 1.25 1.63 2.02 1.12 1 2.07 1.31 2.36 1.46.29.15.46.12.63-.07.17-.19.73-.85.92-1.14.19-.29.39-.24.66-.14.27.1 1.7.8 1.99.95.29.15.49.22.56.34.07.12.07.7-.17 1.38z" />
    </svg>
  );
}

function formatWhatsAppPhone(rawPhone = '') {
  const digits = rawPhone.toString().replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('225') && digits.length >= 12) return digits;
  if (digits.length === 10 && digits.startsWith('0')) return `225${digits}`;
  return digits;
}

export default function ProduitDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [produit, setProduit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imgError, setImgError] = useState(false);

  const [quantite, setQuantite] = useState(1);
  const [buying, setBuying] = useState(false);
  const [isFavori, setIsFavori] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  useEffect(() => {
    let cancelled = false;

    const loadProduit = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get(`/produits/${id}`);
        if (cancelled) return;
        const data = res.data?.produit || res.data?.data || res.data;
        setProduit(data);
      } catch (err) {
        if (cancelled) return;
        setError(
          err.response?.data?.message || 'Produit introuvable ou indisponible.'
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadProduit();
    return () => {
      cancelled = true;
    };
  }, [id]);

  // Enregistre la consultation dans l'historique client si connecté
  useEffect(() => {
    if (!user || !id) return;
    api.post(`/client/historique/${id}`).catch(() => {});
  }, [user, id]);

  // Vérifie si le produit est déjà dans les favoris du client
  useEffect(() => {
    let cancelled = false;
    if (!user || !id) return undefined;

    api
      .get('/client/favoris')
      .then((res) => {
        if (cancelled) return;
        const raw = res.data;
        const list = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.favoris)
            ? raw.favoris
            : Array.isArray(raw?.data)
              ? raw.data
              : [];
        const found = list.some(
          (item) => String(item.id ?? item.produit_id) === String(id)
        );
        setIsFavori(found);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [user, id]);

  const handleToggleFavori = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await api.post(`/client/favoris/${id}`);
      setIsFavori((prev) => !prev);
    } catch (err) {
      console.error('Erreur favori:', err);
    }
  };

  const handleAcheterWhatsApp = async () => {
    if (!produit) return;

    const qte = Math.max(1, Number(quantite) || 1);
    const phone = formatWhatsAppPhone(
      produit.vendeur?.telephone || produit.telephone || ''
    );

    if (!phone) {
      setFeedback({
        type: 'error',
        text: "Le numéro WhatsApp de ce vendeur n'est pas disponible.",
      });
      return;
    }

    const message = `Bonjours, je veux acheter le produit ${produit.nom} je veux ${qte} examplaire`;
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    setBuying(true);
    setFeedback({ type: '', text: '' });

    if (user) {
      try {
        await api.post('/client/achats', {
          produit_id: produit.id,
          quantite: qte,
        });
      } catch {
        // On ouvre quand même WhatsApp pour que le client puisse commander directement
      }
    }

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setFeedback({
      type: 'success',
      text: 'Redirection vers WhatsApp avec les détails de votre commande.',
    });
    setBuying(false);
  };

  const stock = Number(produit?.stock ?? 0);
  const prix = Number(produit?.prix ?? 0);
  const boutique = produit?.vendeur || {};
  const qteCourante = Math.max(1, Number(quantite) || 1);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        <Navbar />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* Fil de retour */}
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-emerald-700 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour</span>
            </button>

            <Link
              to="/"
              className="text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-900 transition"
            >
              Accueil catalogue
            </Link>
          </div>

          {loading ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-sm text-slate-500">
              Chargement des détails du produit...
            </div>
          ) : error || !produit ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center space-y-4">
              <p className="text-sm font-semibold text-red-600">
                {error || 'Produit introuvable.'}
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold transition"
              >
                Retourner à la boutique
              </Link>
            </div>
          ) : (
            <section className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xs grid grid-cols-1 lg:grid-cols-12">
              {/* Colonne gauche : Visuel produit */}
              <div className="lg:col-span-6 bg-slate-100 flex items-center justify-center min-h-[300px] sm:min-h-[420px] p-4">
                {produit.image_url && !imgError ? (
                  <img
                    src={produit.image_url}
                    alt={produit.nom}
                    onError={() => setImgError(true)}
                    className="w-full h-full max-h-[440px] object-cover rounded-2xl"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <ImageOff className="w-8 h-8" />
                    <span className="text-xs font-medium">
                      Aucune image disponible
                    </span>
                  </div>
                )}
              </div>

              {/* Colonne droite : Informations & Achat */}
              <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  {/* Badge type + statut stock */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">
                      {produit.type || 'Autres'}
                    </span>

                    <span
                      className={`text-xs font-semibold ${
                        stock > 0 ? 'text-slate-600' : 'text-red-600'
                      }`}
                    >
                      {stock > 0
                        ? `En stock (${stock} disponible${stock > 1 ? 's' : ''})`
                        : 'Rupture de stock'}
                    </span>
                  </div>

                  {/* Titre & Prix */}
                  <div className="space-y-2">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                      {produit.nom}
                    </h1>
                    <p className="text-2xl font-extrabold text-emerald-700">
                      {prix.toLocaleString()} FCFA
                    </p>
                  </div>

                  {/* Infos boutique vendeur */}
                  <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-800">
                      <Store className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>
                        {boutique.nom_boutique || 'Boutique Takechap'}
                      </span>
                      {boutique.est_verifie && (
                        <BadgeCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </div>

                    {boutique.telephone && (
                      <a
                        href={`tel:${boutique.telephone}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-700 transition"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>{boutique.telephone}</span>
                      </a>
                    )}
                  </div>

                  {/* Description complète */}
                  <div className="space-y-1.5 pt-1">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Description
                    </h2>
                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                      {produit.description ||
                        'Aucune description détaillée fournie pour ce produit.'}
                    </p>
                  </div>
                </div>

                {/* Messages de retour */}
                {feedback.text && (
                  <div
                    className={`rounded-2xl px-4 py-3 text-xs sm:text-sm flex items-center gap-2 border ${
                      feedback.type === 'success'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-red-50 border-red-200 text-red-700'
                    }`}
                  >
                    {feedback.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 shrink-0" />
                    )}
                    <span>{feedback.text}</span>
                  </div>
                )}

                {/* Quantité + Bouton Acheter WhatsApp + Favori */}
                <div className="pt-4 border-t border-slate-100 space-y-4">
                  {stock > 0 && (
                    <div className="flex items-center justify-between gap-4">
                      <label
                        htmlFor="quantite"
                        className="text-xs sm:text-sm font-bold text-slate-700"
                      >
                        Quantité
                      </label>
                      <input
                        id="quantite"
                        type="number"
                        min="1"
                        max={stock}
                        value={quantite}
                        onChange={(e) => {
                          const val = Math.max(
                            1,
                            Math.min(stock, Number(e.target.value) || 1)
                          );
                          setQuantite(val);
                        }}
                        className="w-24 px-3 py-2 text-sm font-bold text-center bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:border-emerald-600"
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleAcheterWhatsApp}
                      disabled={stock <= 0 || buying}
                      className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 text-white text-sm font-bold py-3.5 px-6 rounded-full shadow-xs transition cursor-pointer"
                    >
                      <WhatsAppIcon className="w-4 h-4" />
                      <span>
                        {stock <= 0
                          ? 'Épuisé'
                          : buying
                            ? 'Ouverture WhatsApp...'
                            : `Acheter (${(prix * qteCourante).toLocaleString()} FCFA)`}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={handleToggleFavori}
                      aria-label="Ajouter aux favoris"
                      className={`p-3.5 rounded-full border transition cursor-pointer ${
                        isFavori
                          ? 'border-red-200 bg-red-50 text-red-600'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <Heart
                        className={`w-4 h-4 ${isFavori ? 'fill-current' : ''}`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}