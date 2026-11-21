import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  History,
  ShoppingBag,
  User,
  Trash2,
  PackageCheck,
  Store,
} from 'lucide-react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/useAuth';

export default function ClientDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('likes'); // 'likes' | 'historique'
  const [likedProduits, setLikedProduits] = useState([]);
  const [historique, setHistorique] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        // Récupération des favoris et de l'historique depuis Laravel (quand l'API est prête)
        const [likesRes, histoRes] = await Promise.allSettled([
          axios.get('http://127.0.0.1:8000/api/client/likes', { headers }),
          axios.get('http://127.0.0.1:8000/api/client/historique', { headers }),
        ]);

        if (likesRes.status === 'fulfilled') {
          setLikedProduits(likesRes.value.data.data || likesRes.value.data || []);
        }
        if (histoRes.status === 'fulfilled') {
          setHistorique(histoRes.value.data.data || histoRes.value.data || []);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, []);

  const handleUnlike = async (produitId) => {
    setLikedProduits((prev) => prev.filter((item) => item.id !== produitId));
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://127.0.0.1:8000/api/client/likes/${produitId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    } catch {
      // L'UI reste fluide même si l'API n'est pas encore branchée
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Bannière de bienvenue du client */}
          <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-extrabold text-xl shrink-0">
                {user?.prenom ? user.prenom.charAt(0).toUpperCase() : <User className="w-6 h-6" />}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                  Espace Client
                </p>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Bonjour, {user?.prenom || 'Client'} {user?.nom || ''}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Retrouvez ici vos produits favoris et l&apos;historique de vos achats.
                </p>
              </div>
            </div>

            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 bg-black hover:bg-neutral-800 text-white text-sm font-semibold px-6 py-3 rounded-full transition self-start sm:self-auto"
            >
              <Store className="w-4 h-4" />
              <span>Continuer mes achats</span>
            </Link>
          </section>

          {/* Résumé chiffré */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Produits likés</p>
                <p className="text-2xl font-extrabold text-slate-900">{likedProduits.length}</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <History className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Historique d&apos;achats</p>
                <p className="text-2xl font-extrabold text-slate-900">{historique.length}</p>
              </div>
            </div>
          </section>

          {/* Onglets de navigation */}
          <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
            <button
              type="button"
              onClick={() => setActiveTab('likes')}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition cursor-pointer ${
                activeTab === 'likes'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>Produits likés ({likedProduits.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('historique')}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition cursor-pointer ${
                activeTab === 'historique'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Historique ({historique.length})</span>
            </button>
          </div>

          {/* Contenu selon l'onglet actif */}
          {loading ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center text-sm text-slate-500">
              Chargement de votre espace...
            </div>
          ) : activeTab === 'likes' ? (
            <section>
              {likedProduits.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center space-y-3">
                  <Heart className="w-10 h-10 text-slate-300 mx-auto" />
                  <h2 className="text-base font-bold text-slate-900">
                    Aucun produit liké pour le moment
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                    Cliquez sur le cœur d&apos;un produit dans le catalogue pour le sauvegarder ici.
                  </p>
                  <Link
                    to="/"
                    className="inline-block mt-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-5 py-2.5 rounded-full transition"
                  >
                    Découvrir les produits
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {likedProduits.map((produit) => (
                    <article
                      key={produit.id}
                      className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between"
                    >
                      <div>
                        <div className="h-40 bg-slate-100 flex items-center justify-center overflow-hidden">
                          {produit.image_url ? (
                            <img
                              src={produit.image_url}
                              alt={produit.nom}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-xs text-slate-400">Aucune image</span>
                          )}
                        </div>
                        <div className="p-4 space-y-1">
                          <h3 className="font-bold text-slate-900 line-clamp-1">{produit.nom}</h3>
                          <p className="text-sm font-extrabold text-emerald-700">
                            {Number(produit.prix).toLocaleString()} FCFA
                          </p>
                        </div>
                      </div>

                      <div className="px-4 pb-4 flex items-center gap-2">
                        <Link
                          to="/"
                          className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold py-2 px-3 rounded-xl transition"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Voir</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleUnlike(produit.id)}
                          aria-label="Retirer des favoris"
                          className="p-2 rounded-xl border border-slate-200 hover:bg-rose-50 hover:text-rose-600 text-slate-500 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          ) : (
            <section>
              {historique.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center space-y-3">
                  <PackageCheck className="w-10 h-10 text-slate-300 mx-auto" />
                  <h2 className="text-base font-bold text-slate-900">
                    Aucun historique d&apos;achat pour le moment
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                    Vos commandes et produits consultés ou achetés apparaîtront automatiquement ici.
                  </p>
                </div>
              ) : (
                <div className="bg-white border border-slate-200 rounded-3xl divide-y divide-slate-100 overflow-hidden">
                  {historique.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.nom}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ShoppingBag className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                            {item.nom}
                          </h3>
                          <p className="text-xs text-slate-500">
                            {item.date_achat || 'Récemment'} • Quantité : {item.quantite || 1}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4">
                        <span className="text-sm font-extrabold text-slate-900">
                          {Number(item.prix_total || item.prix).toLocaleString()} FCFA
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                          {item.statut || 'Validé'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}