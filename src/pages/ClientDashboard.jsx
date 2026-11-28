import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Eye,
  User,
  Trash2,
  Store,
} from 'lucide-react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/useAuth';

export default function ClientDashboard() {
  const { user } = useAuth();
  const [likedProduits, setLikedProduits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchClientData = async () => {
      try {
        const res = await api.get('/client/favoris');
        if (cancelled) return;
        const raw = res.data;
        const list = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.favoris)
            ? raw.favoris
            : Array.isArray(raw?.data)
              ? raw.data
              : [];
        setLikedProduits(list);
      } catch {
        if (!cancelled) setLikedProduits([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchClientData();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleUnlike = async (produitId) => {
    setLikedProduits((prev) => prev.filter((item) => item.id !== produitId));
    try {
      await api.post(`/client/favoris/${produitId}`);
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
                  Retrouvez ici tous les produits que vous avez mis en favoris.
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
          </section>

          {/* Liste des produits likés */}
          {loading ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center text-sm text-slate-500">
              Chargement de votre espace...
            </div>
          ) : (
            <section className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900">
                Produits likés ({likedProduits.length})
              </h2>

              {likedProduits.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center space-y-3">
                  <Heart className="w-10 h-10 text-slate-300 mx-auto" />
                  <h3 className="text-base font-bold text-slate-900">
                    Aucun produit liké pour le moment
                  </h3>
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
                  {likedProduits.map((produit) => {
                    const produitId = produit.id ?? produit.produit_id;
                    return (
                      <article
                        key={produitId}
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
                            to={`/produit/${produitId}`}
                            className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold py-2 px-3 rounded-xl transition"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Voir</span>
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleUnlike(produitId)}
                            aria-label="Retirer des favoris"
                            className="p-2 rounded-xl border border-slate-200 hover:bg-rose-50 hover:text-rose-600 text-slate-500 transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </article>
                    );
                  })}
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