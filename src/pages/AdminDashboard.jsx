import { useState, useEffect, useCallback } from 'react';
import { Store } from 'lucide-react';
import api from '../api/axios';

export default function AdminDashboard() {
  const [vendeurs, setVendeurs] = useState([]);
  const [form, setForm] = useState({
    nom: '', prenom: '', nom_boutique: '', email: '', telephone: '', mot_de_passe: '',
  });
  const [msg, setMsg] = useState('');

  const loadVendeurs = useCallback(async () => {
    const res = await api.get('/vendeurs');
    setVendeurs(res.data);
  }, []);

  useEffect(() => {
    api.get('/vendeurs').then((res) => setVendeurs(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/vendeurs', form);
      setForm({ nom: '', prenom: '', nom_boutique: '', email: '', telephone: '', mot_de_passe: '' });
      setMsg('Vendeur créé avec succès.');
      loadVendeurs();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Erreur lors de la création.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Espace Admin — Gestion des Vendeurs</h1>

      {msg && <div className="bg-emerald-50 text-emerald-800 p-3 rounded-lg text-sm">{msg}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 space-y-3">
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
              <div key={v.id} className="py-3 text-sm">
                <p className="font-semibold">{v.nom_boutique} ({v.prenom} {v.nom})</p>
                <p className="text-xs text-slate-500">{v.email} • {v.telephone || 'Sans téléphone'}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}