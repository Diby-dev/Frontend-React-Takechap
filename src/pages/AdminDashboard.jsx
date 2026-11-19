import { useState, useEffect, useCallback } from 'react';
import { Store, Trash2, Pencil, Package } from 'lucide-react';
import api from '../api/axios';
import EditProduitModal from '../components/EditProduitModal';

export default function AdminDashboard() {
  const [vendeurs, setVendeurs] = useState([]);
  const [produits, setProduits] = useState([]);
  const [form, setForm] = useState({
    nom: '', prenom: '', nom_boutique: '', email: '', telephone: '', mot_de_passe: '',
  });
  const [msg, setMsg] = useState('');
  const [editingProduit, setEditingProduit] = useState(null);

  const loadData = useCallback(async () => {
    const [resVendeurs, resProduits] = await Promise.all([
      api.get('/vendeurs'),
      api.get('/admin/produits'),
    ]);
    setVendeurs(resVendeurs.data);
    setProduits(resProduits.data);
  }, []);

  useEffect(() => {
    Promise.all([api.get('/vendeurs'), api.get('/admin/produits')]).then(([resV, resP]) => {
      setVendeurs(resV.data);
      setProduits(resP.data);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/vendeurs', form);
      setForm({ nom: '', prenom: '', nom_boutique: '', email: '', telephone: '', mot_de_passe: '' });
      setMsg('Vendeur créé avec succès.');
      loadData();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Erreur lors de la création.');
    }
  };

  const handleDeleteVendeur = async (id) => {
    if (!window.confirm('Supprimer ce vendeur et tous ses produits ?')) return;
    await api.delete(`/vendeurs/${id}`);
    setMsg('Vendeur supprimé.');
    loadData();
  };

  const handleDeleteProduit = async (id) => {
    if (!window.confirm('Supprimer ce produit ?')) return;
    await api.delete(`/produits/${id}`);
    setMsg('Produit supprimé.');
    loadData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      <h1 className="text-2xl font-bold text-slate-900">Espace Admin — Vendeurs & Catalogue</h1>

      {msg && <div className="bg-emerald-50 text-emerald-800 p-3 rounded-lg text-sm font-medium">{msg}</div>}

      {/* SECTION VENDEURS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 space-y-3 h-fit">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <Store className="w-4 h-4 text-emerald-600" /> Ajouter un Vendeur
          </h2>
          <input type="text" placeholder="Nom" required value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
          <input type="text" placeholder="Prénom" required value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
          <input type="text" placeholder="Nom de la boutique" required value={form.nom_boutique} onChange={(e) => setForm({ ...form, nom_boutique: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
          <input type="email" placeholder="Email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
          <input type="text" placeholder="Téléphone" value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
          <input type="password" placeholder="Mot de passe" required value={form.mot_de_passe} onChange={(e) => setForm({ ...form, mot_de_passe: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
          <button type="submit" className="w-full bg-emerald-600 text-white py-2 rounded-lg text-sm font-semibold cursor-pointer">Enregistrer le Vendeur</button>
        </form>

        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200">
          <h2 className="font-bold text-slate-800 mb-4">Tous les Vendeurs ({vendeurs.length})</h2>
          <div className="divide-y">
            {vendeurs.map((v) => (
              <div key={v.id} className="py-3 flex items-center justify-between text-sm">
                <div>
                  <p className="font-semibold">{v.nom_boutique} ({v.prenom} {v.nom})</p>
                  <p className="text-xs text-slate-500">{v.email} • {v.telephone || 'Sans téléphone'}</p>
                </div>
                <button
                  onClick={() => handleDeleteVendeur(v.id)}
                  className="text-rose-500 hover:text-rose-700 cursor-pointer"
                  title="Supprimer le vendeur"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION PRODUITS DES VENDEURS */}
      <div className="bg-white p-6 rounded-xl border border-slate-200">
        <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
          <Package className="w-4 h-4 text-emerald-600" /> Tous les Produits des Vendeurs ({produits.length})
        </h2>
        <div className="divide-y">
          {produits.map((p) => (
            <div key={p.id} className="py-3 flex items-center justify-between text-sm gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.nom} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[10px] text-slate-400">Sans img</span>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">
                    {p.nom} <span className="text-xs font-normal text-emerald-600">({p.vendeur?.nom_boutique})</span>
                  </p>
                  <p className="text-xs text-slate-500">
                    {Number(p.prix).toLocaleString()} FCFA • Stock : {p.stock} • Statut : {p.statut}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setEditingProduit(p)}
                  className="text-amber-600 hover:text-amber-700 cursor-pointer"
                  title="Modifier le produit"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteProduit(p.id)}
                  className="text-rose-500 hover:text-rose-700 cursor-pointer"
                  title="Supprimer le produit"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {editingProduit && (
        <EditProduitModal
          produit={editingProduit}
          onClose={() => setEditingProduit(null)}
          onSaved={() => {
            setMsg('Produit modifié avec succès.');
            loadData();
          }}
        />
      )}
    </div>
  );
}