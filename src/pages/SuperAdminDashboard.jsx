import { useState, useEffect, useCallback } from 'react';
import { Trash2, UserPlus, Store, Pencil, Package } from 'lucide-react';
import api from '../api/axios';
import EditProduitModal from '../components/EditProduitModal';

export default function SuperAdminDashboard() {
  const [admins, setAdmins] = useState([]);
  const [vendeurs, setVendeurs] = useState([]);
  const [produits, setProduits] = useState([]);
  const [adminForm, setAdminForm] = useState({ nom: '', prenom: '', email: '', mot_de_passe: '' });
  const [vendeurForm, setVendeurForm] = useState({
    nom: '', prenom: '', nom_boutique: '', email: '', telephone: '', mot_de_passe: '',
  });
  const [msg, setMsg] = useState('');
  const [editingProduit, setEditingProduit] = useState(null);

  const loadData = useCallback(async () => {
    const [resAdmins, resVendeurs, resProduits] = await Promise.all([
      api.get('/admins'),
      api.get('/vendeurs'),
      api.get('/admin/produits'),
    ]);
    setAdmins(resAdmins.data);
    setVendeurs(resVendeurs.data);
    setProduits(resProduits.data);
  }, []);

  useEffect(() => {
    Promise.all([api.get('/admins'), api.get('/vendeurs'), api.get('/admin/produits')]).then(
      ([resAdmins, resVendeurs, resProduits]) => {
        setAdmins(resAdmins.data);
        setVendeurs(resVendeurs.data);
        setProduits(resProduits.data);
      }
    );
  }, []);

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admins', adminForm);
      setAdminForm({ nom: '', prenom: '', email: '', mot_de_passe: '' });
      setMsg('Admin ajouté avec succès.');
      loadData();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Erreur création admin.');
    }
  };

  const handleDeleteAdmin = async (id) => {
    if (!window.confirm('Supprimer cet admin ?')) return;
    await api.delete(`/admins/${id}`);
    setMsg('Admin supprimé.');
    loadData();
  };

  const handleAddVendeur = async (e) => {
    e.preventDefault();
    try {
      await api.post('/vendeurs', vendeurForm);
      setVendeurForm({ nom: '', prenom: '', nom_boutique: '', email: '', telephone: '', mot_de_passe: '' });
      setMsg('Vendeur ajouté avec succès.');
      loadData();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Erreur création vendeur.');
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
      <h1 className="text-2xl font-bold text-slate-900">Espace Super Admin</h1>

      {msg && <div className="bg-emerald-50 text-emerald-800 p-3 rounded-lg text-sm font-medium">{msg}</div>}

      {/* SECTION ADMINS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleAddAdmin} className="bg-white p-6 rounded-xl border border-slate-200 space-y-3 h-fit">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-emerald-600" /> Ajouter un Admin
          </h2>
          <input type="text" placeholder="Nom" required value={adminForm.nom} onChange={(e) => setAdminForm({ ...adminForm, nom: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
          <input type="text" placeholder="Prénom" required value={adminForm.prenom} onChange={(e) => setAdminForm({ ...adminForm, prenom: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
          <input type="email" placeholder="Email" required value={adminForm.email} onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
          <input type="password" placeholder="Mot de passe" required value={adminForm.mot_de_passe} onChange={(e) => setAdminForm({ ...adminForm, mot_de_passe: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
          <button type="submit" className="w-full bg-slate-900 text-white py-2 rounded-lg text-sm font-semibold cursor-pointer">Créer l'Admin</button>
        </form>

        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200">
          <h2 className="font-bold text-slate-800 mb-4">Liste des Admins ({admins.length})</h2>
          <div className="divide-y">
            {admins.map((a) => (
              <div key={a.id} className="py-3 flex items-center justify-between text-sm">
                <div>
                  <p className="font-semibold">{a.prenom} {a.nom}</p>
                  <p className="text-slate-500 text-xs">{a.email}</p>
                </div>
                <button onClick={() => handleDeleteAdmin(a.id)} className="text-rose-500 hover:text-rose-700 cursor-pointer" title="Supprimer l'admin">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION VENDEURS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleAddVendeur} className="bg-white p-6 rounded-xl border border-slate-200 space-y-3 h-fit">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <Store className="w-4 h-4 text-emerald-600" /> Ajouter un Vendeur
          </h2>
          <input type="text" placeholder="Nom" required value={vendeurForm.nom} onChange={(e) => setVendeurForm({ ...vendeurForm, nom: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
          <input type="text" placeholder="Prénom" required value={vendeurForm.prenom} onChange={(e) => setVendeurForm({ ...vendeurForm, prenom: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
          <input type="text" placeholder="Nom de la boutique" required value={vendeurForm.nom_boutique} onChange={(e) => setVendeurForm({ ...vendeurForm, nom_boutique: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
          <input type="email" placeholder="Email" required value={vendeurForm.email} onChange={(e) => setVendeurForm({ ...vendeurForm, email: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
          <input type="text" placeholder="Téléphone" value={vendeurForm.telephone} onChange={(e) => setVendeurForm({ ...vendeurForm, telephone: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
          <input type="password" placeholder="Mot de passe" required value={vendeurForm.mot_de_passe} onChange={(e) => setVendeurForm({ ...vendeurForm, mot_de_passe: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
          <button type="submit" className="w-full bg-emerald-600 text-white py-2 rounded-lg text-sm font-semibold cursor-pointer">Créer le Vendeur</button>
        </form>

        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200">
          <h2 className="font-bold text-slate-800 mb-4">Vendeurs enregistrés ({vendeurs.length})</h2>
          <div className="divide-y">
            {vendeurs.map((v) => (
              <div key={v.id} className="py-3 flex items-center justify-between text-sm">
                <div>
                  <p className="font-semibold">{v.nom_boutique} — <span className="font-normal">{v.prenom} {v.nom}</span></p>
                  <p className="text-slate-500 text-xs">{v.email} • Ajouté par : {v.super_admin ? `SuperAdmin ${v.super_admin.prenom}` : v.admin ? `Admin ${v.admin.prenom}` : 'N/A'}</p>
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