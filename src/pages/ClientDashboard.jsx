import { useState, useEffect } from 'react';
import { ShoppingBag, Heart, History } from 'lucide-react';
import api from '../api/axios';

export default function ClientDashboard() {
  const [achats, setAchats] = useState([]);
  const [favoris, setFavoris] = useState([]);
  const [historique, setHistorique] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get('/client/achats'),
      api.get('/client/favoris'),
      api.get('/client/historique'),
    ]).then(([resAchats, resFavoris, resHist]) => {
      setAchats(resAchats.data);
      setFavoris(resFavoris.data);
      setHistorique(resHist.data);
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-2xl font-bold text-slate-900">Mon Espace Client</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mes Achats */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
            <ShoppingBag className="w-4 h-4 text-emerald-600" /> Mes Achats ({achats.length})
          </h2>
          <div className="space-y-3 text-sm">
            {achats.length === 0 ? <p className="text-slate-400">Aucun achat.</p> : achats.map((a) => (
              <div key={a.id} className="border-b pb-2">
                <p className="font-semibold">{a.produit?.nom}</p>
                <p className="text-xs text-slate-500">Qté : {a.quantite} • {Number(a.prix_unitaire).toLocaleString()} FCFA ({a.statut_paiement})</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mes Favoris */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
            <Heart className="w-4 h-4 text-rose-500" /> Mes Favoris ({favoris.length})
          </h2>
          <div className="space-y-3 text-sm">
            {favoris.length === 0 ? <p className="text-slate-400">Aucun favori.</p> : favoris.map((f) => (
              <div key={f.id} className="border-b pb-2">
                <p className="font-semibold">{f.nom}</p>
                <p className="text-xs text-slate-500">{Number(f.prix).toLocaleString()} FCFA</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mon Historique */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
            <History className="w-4 h-4 text-slate-600" /> Produits consultés ({historique.length})
          </h2>
          <div className="space-y-3 text-sm">
            {historique.length === 0 ? <p className="text-slate-400">Aucun historique.</p> : historique.map((h) => (
              <div key={h.id} className="border-b pb-2">
                <p className="font-semibold">{h.produit?.nom}</p>
                <p className="text-xs text-slate-400">Vu le {new Date(h.consulte_le).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}