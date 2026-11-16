import { useState, useEffect, useCallback } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';
import api from '../api/axios';

export default function VendeurDashboard() {
  const [produits, setProduits] = useState([]);
  const [form, setForm] = useState({ nom: '', description: '', prix: '', stock: '', image_url: '' });
  const [msg, setMsg] = useState('');

  const loadMesProduits = useCallback(async () => {
    const res = await api.get('/vendeur/produits');
    setProduits(res.data);
  }, []);

  useEffect(() => {
    api.get('/vendeur/produits').then((res) => setProduits(res.data));
  }, []);

  const handleAddProduit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/produits', form);
      setForm({ nom: '', description: '', prix: '', stock: '', image_url: '' });
      setMsg('Produit publié avec succès.');
      loadMesProduits();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Erreur ajout produit.');
    }
  };

  const handleDelete = async (id) => {
    await api.delete(`/produits/${id}`);
    loadMesProduits();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Espace Vendeur — Ma Boutique</h1>

      {msg && <div className="bg-emerald-50 text-emerald-800 p-3 rounded-lg text-sm">{msg}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleAddProduit} className="bg-white p-6 rounded-xl border border-slate-200 space-y-3">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-emerald-600" /> Publier un Produit
          </h2>
          <input type="text" placeholder="Nom du produit" required value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" rows={3} />
          <div className="grid grid-cols-2 gap-2">
            <input type="number" placeholder="Prix (FCFA)" required min={0} value={form.prix} onChange={(e) => setForm({ ...form, prix: e.target.value })} className="border rounded-lg px-3 py-2 text-sm" />
            <input type="number" placeholder="Stock" required min={0} value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="border rounded-lg px-3 py-2 text-sm" />
          </div>
          <input type="url" placeholder="Lien image (URL)" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
          <button type="submit" className="w-full bg-emerald-600 text-white py-2 rounded-lg text-sm font-semibold cursor-pointer">Publier</button>
        </form>

        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200">
          <h2 className="font-bold text-slate-800 mb-4">Mes Produits en vente ({produits.length})</h2>
          <div className="divide-y">
            {produits.map((p) => (
              <div key={p.id} className="py-3 flex items-center justify-between text-sm">
                <div>
                  <p className="font-semibold">{p.nom}</p>
                  <p className="text-xs text-slate-500">{Number(p.prix).toLocaleString()} FCFA • Stock : {p.stock} • Statut : {p.statut}</p>
                </div>
                <button onClick={() => handleDelete(p.id)} className="text-rose-500 hover:text-rose-700 cursor-pointer">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}