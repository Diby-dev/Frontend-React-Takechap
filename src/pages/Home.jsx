import { useState, useEffect, useCallback } from 'react';
import { Search, Heart, ShoppingCart, Eye, Store } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/useAuth';

export default function Home() {
  const { role } = useAuth();
  const [produits, setProduits] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedProduit, setSelectedProduit] = useState(null);
  const [feedback, setFeedback] = useState('');

  const fetchProduits = useCallback(async (query = '') => {
    setLoading(true);
    try {
      const res = await api.get('/produits', { params: query ? { search: query } : {} });
      setProduits(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    api.get('/produits')
      .then((res) => {
        if (active) setProduits(res.data);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProduits(search);
  };

  const showMessage = (msg) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(''), 3000);
  };

  const handleConsulter = async (produit) => {
    setSelectedProduit(produit);
    if (role === 'client') {
      try {
        await api.post(`/client/historique/${produit.id}`);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleToggleFavori = async (produitId) => {
    if (role !== 'client') return showMessage('Connectez-vous en tant que client pour ajouter aux favoris.');
    try {
      const res = await api.post(`/client/favoris/${produitId}`);
      showMessage(res.data.message);
    } catch {
      showMessage('Erreur lors de la mise à jour des favoris.');
    }
  };

  const handleAcheter = async (produitId) => {
    if (role !== 'client') return showMessage('Connectez-vous en tant que client pour acheter.');
    try {
      const res = await api.post('/client/achats', { produit_id: produitId, quantite: 1 });
      showMessage(res.data.message);
      fetchProduits(search);
    } catch (err) {
      showMessage(err.response?.data?.message || 'Erreur lors de l’achat.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Marketplace Takechap</h1>
          <p className="text-slate-500 text-sm mt-1">Découvrez les produits vérifiés de nos vendeurs</p>
        </div>

        <form onSubmit={handleSearch} className="flex w-full md:w-96">
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-slate-300 rounded-l-lg px-4 py-2 text-sm focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            className="bg-slate-900 text-white px-4 py-2 rounded-r-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>
      </div>

      {feedback && (
        <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg text-sm font-medium">
          {feedback}
        </div>
      )}

      {loading ? (
        <p className="text-center text-slate-500 py-12">Chargement du catalogue...</p>
      ) : produits.length === 0 ? (
        <p className="text-center text-slate-500 py-12">Aucun produit disponible pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {produits.map((p) => (
            <div key={p.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col">
              <div className="h-48 bg-slate-100 flex items-center justify-center overflow-hidden">
                {p.image_url ? (
                  <img src={p.image_url} alt={p.nom} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-slate-400 text-xs">Aucune image</span>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium mb-1">
                    <Store className="w-3.5 h-3.5" />
                    <span>{p.vendeur?.nom_boutique || 'Boutique'}</span>
                  </div>
                  <h2 className="font-semibold text-slate-900 line-clamp-1">{p.nom}</h2>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">{p.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-slate-900">{Number(p.prix).toLocaleString()} FCFA</span>
                    <span className="text-xs text-slate-500">Stock : {p.stock}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAcheter(p.id)}
                      disabled={p.stock <= 0}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white text-xs font-semibold py-2 px-3 rounded-lg transition cursor-pointer"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Acheter</span>
                    </button>

                    <button
                      onClick={() => handleToggleFavori(p.id)}
                      className="p-2 border border-slate-200 rounded-lg text-rose-500 hover:bg-rose-50 transition cursor-pointer"
                      title="Ajouter aux favoris"
                    >
                      <Heart className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleConsulter(p)}
                      className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                      title="Voir détails"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedProduit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl">
            <h3 className="text-xl font-bold text-slate-900">{selectedProduit.nom}</h3>
            <p className="text-xs text-emerald-600 font-medium mt-1">
              Vendu par : {selectedProduit.vendeur?.nom_boutique}
            </p>
            <p className="text-sm text-slate-600 mt-4">{selectedProduit.description || 'Pas de description.'}</p>
            <div className="mt-6 flex items-center justify-between">
              <span className="text-xl font-bold text-slate-900">
                {Number(selectedProduit.prix).toLocaleString()} FCFA
              </span>
              <button
                onClick={() => setSelectedProduit(null)}
                className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}