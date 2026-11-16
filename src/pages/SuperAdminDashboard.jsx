import { useState, useEffect, useCallback } from 'react';
import { Trash2, UserPlus, Store } from 'lucide-react';
import api from '../api/axios';

export default function SuperAdminDashboard() {
  const [admins, setAdmins] = useState([]);
  const [vendeurs, setVendeurs] = useState([]);
  const [adminForm, setAdminForm] = useState({ nom: '', prenom: '', email: '', mot_de_passe: '' });
  const [vendeurForm, setVendeurForm] = useState({
    nom: '', prenom: '', nom_boutique: '', email: '', telephone: '', mot_de_passe: '',
  });
  const [msg, setMsg] = useState('');

  const loadData = useCallback(async () => {
    const [resAdmins, resVendeurs] = await Promise.all([
      api.get('/admins'),
      api.get('/vendeurs'),
    ]);
    setAdmins(resAdmins.data);
    setVendeurs(resVendeurs.data);
  }, []);

  useEffect(() => {
    Promise.all([api.get('/admins'), api.get('/vendeurs')]).then(([resAdmins, resVendeurs]) => {
      setAdmins(resAdmins.data);
      setVendeurs(resVendeurs.data);
    });
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
    await api.delete(`/admins/${id}`);
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      <h1 className="text-2xl font-bold text-slate-900">Espace Super Admin</h1>

      {msg && <div className="bg-emerald-50 text-emerald-800 p-3 rounded-lg text-sm">{msg}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleAddAdmin} className="bg-white p-6 rounded-xl border border-slate-200 space-y-3">
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
                <button onClick={() => handleDeleteAdmin(a.id)} className="text-rose-500 hover:text-rose-700 cursor-pointer">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleAddVendeur} className="bg-white p-6 rounded-xl border border-slate-200 space-y-3">
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}