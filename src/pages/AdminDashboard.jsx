import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  ShieldCheck,
  Store,
  Package,
  Users,
  Search,
  LogOut,
  BadgeCheck,
  Home,
  UserPlus,
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/useAuth';

export default function AdminDashboard() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('tout'); // 'tout' | 'superadmins' | 'admins' | 'vendeurs' | 'boutiques' | 'produits'
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [superadmins, setSuperadmins] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [vendeurs, setVendeurs] = useState([]);
  const [boutiques, setBoutiques] = useState([]);
  const [produits, setProduits] = useState([]);

  // Formulaire Ajout Admin
  const [adminForm, setAdminForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    mot_de_passe: '',
  });
  const [adminSubmitting, setAdminSubmitting] = useState(false);
  const [adminFeedback, setAdminFeedback] = useState({ type: '', text: '' });

  // Formulaire Ajout Vendeur
  const [vendeurForm, setVendeurForm] = useState({
    nom: '',
    prenom: '',
    nom_boutique: '',
    email: '',
    telephone: '',
    mot_de_passe: '',
    est_verifie: true,
  });
  const [vendeurSubmitting, setVendeurSubmitting] = useState(false);
  const [vendeurFeedback, setVendeurFeedback] = useState({ type: '', text: '' });

  const applyDashboardPayload = (payload) => {
    const listSuperadmins = Array.isArray(payload.superadmins)
      ? payload.superadmins
      : [];
    const listAdmins = Array.isArray(payload.admins) ? payload.admins : [];
    const listVendeurs = Array.isArray(payload.vendeurs)
      ? payload.vendeurs
      : [];

    const listBoutiques = Array.isArray(payload.boutiques)
      ? payload.boutiques
      : listVendeurs
          .map((v) => ({
            id: v.id,
            nom_boutique: v.nom_boutique || 'Boutique sans nom',
            est_verifie: Boolean(v.est_verifie),
            vendeur_nom:
              `${v.prenom || v['prénom'] || ''} ${v.nom || ''}`.trim() ||
              v.email ||
              'Vendeur',
            vendeur_email: v.email || '',
            telephone: v.telephone || '',
          }))
          .filter((b) => b.nom_boutique);

    const listProduits = Array.isArray(payload.produits)
      ? payload.produits
      : [];

    setSuperadmins(listSuperadmins);
    setAdmins(listAdmins);
    setVendeurs(listVendeurs);
    setBoutiques(listBoutiques);
    setProduits(listProduits);
  };

  const refreshAdminData = async () => {
    try {
      const res = await api.get('/admin/dashboard');
      const payload = res.data?.data || res.data || {};
      applyDashboardPayload(payload);
      setError('');
    } catch (err) {
      const status = err.response?.status;
      setError(
        err.response?.data?.message ||
          `Impossible de charger les données du dashboard (${status || 'réseau'}).`
      );
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadInitialData = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        if (cancelled) return;
        const payload = res.data?.data || res.data || {};
        applyDashboardPayload(payload);
        setError('');
      } catch (err) {
        if (cancelled) return;
        const status = err.response?.status;
        setError(
          err.response?.data?.message ||
            `Impossible de charger les données du dashboard (${status || 'réseau'}).`
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadInitialData();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const handleAdminChange = (e) => {
    const { name, value } = e.target;
    setAdminForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleVendeurChange = (e) => {
    const { name, value, type, checked } = e.target;
    setVendeurForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const extractApiError = (err, fallback) => {
    const validationErrors = err.response?.data?.errors;
    const firstFieldError = validationErrors
      ? Object.values(validationErrors)[0]?.[0]
      : null;
    return firstFieldError || err.response?.data?.message || fallback;
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setAdminFeedback({ type: '', text: '' });
    setAdminSubmitting(true);

    try {
      const payload = {
        nom: adminForm.nom.trim(),
        prenom: adminForm.prenom.trim(),
        email: adminForm.email.trim(),
        mot_de_passe: adminForm.mot_de_passe,
        password: adminForm.mot_de_passe,
      };

      const res = await api.post('/admins', payload);
      const created = res.data?.admin || res.data?.data || res.data;

      if (created && (created.email || created.nom)) {
        setAdmins((prev) => [created, ...prev]);
      } else {
        await refreshAdminData();
      }

      setAdminForm({ nom: '', prenom: '', email: '', mot_de_passe: '' });
      setAdminFeedback({
        type: 'success',
        text: 'Administrateur ajouté avec succès.',
      });
    } catch (err) {
      setAdminFeedback({
        type: 'error',
        text: extractApiError(err, "Erreur lors de l'ajout de l'administrateur."),
      });
    } finally {
      setAdminSubmitting(false);
    }
  };

  const handleCreateVendeur = async (e) => {
    e.preventDefault();
    setVendeurFeedback({ type: '', text: '' });
    setVendeurSubmitting(true);

    try {
      const payload = {
        nom: vendeurForm.nom.trim(),
        prenom: vendeurForm.prenom.trim(),
        nom_boutique: vendeurForm.nom_boutique.trim(),
        email: vendeurForm.email.trim(),
        telephone: vendeurForm.telephone.trim() || null,
        mot_de_passe: vendeurForm.mot_de_passe,
        password: vendeurForm.mot_de_passe,
        est_verifie: vendeurForm.est_verifie,
      };

      const res = await api.post('/vendeurs', payload);
      const created = res.data?.vendeur || res.data?.data || res.data;

      if (created && (created.email || created.nom_boutique)) {
        setVendeurs((prev) => [created, ...prev]);
        setBoutiques((prev) => [
          {
            id: created.id || Date.now(),
            nom_boutique: created.nom_boutique || payload.nom_boutique,
            est_verifie: Boolean(created.est_verifie ?? payload.est_verifie),
            vendeur_nom:
              `${created.prenom || payload.prenom} ${created.nom || payload.nom}`.trim(),
            vendeur_email: created.email || payload.email,
            telephone: created.telephone || payload.telephone || '',
          },
          ...prev,
        ]);
      } else {
        await refreshAdminData();
      }

      setVendeurForm({
        nom: '',
        prenom: '',
        nom_boutique: '',
        email: '',
        telephone: '',
        mot_de_passe: '',
        est_verifie: true,
      });
      setVendeurFeedback({
        type: 'success',
        text: 'Vendeur et boutique ajoutés avec succès.',
      });
    } catch (err) {
      setVendeurFeedback({
        type: 'error',
        text: extractApiError(err, "Erreur lors de l'ajout du vendeur."),
      });
    } finally {
      setVendeurSubmitting(false);
    }
  };

  const query = searchTerm.trim().toLowerCase();

  const filterList = (list, fields) => {
    if (!query) return list;
    return list.filter((item) =>
      fields.some((field) =>
        String(field(item) || '')
          .toLowerCase()
          .includes(query)
      )
    );
  };

  const filteredSuperadmins = useMemo(
    () =>
      filterList(superadmins, [
        (u) => u.nom,
        (u) => u.prenom || u['prénom'],
        (u) => u.email,
      ]),
    [superadmins, query]
  );

  const filteredAdmins = useMemo(
    () =>
      filterList(admins, [
        (u) => u.nom,
        (u) => u.prenom || u['prénom'],
        (u) => u.email,
      ]),
    [admins, query]
  );

  const filteredVendeurs = useMemo(
    () =>
      filterList(vendeurs, [
        (v) => v.nom,
        (v) => v.prenom || v['prénom'],
        (v) => v.email,
        (v) => v.nom_boutique,
      ]),
    [vendeurs, query]
  );

  const filteredBoutiques = useMemo(
    () =>
      filterList(boutiques, [
        (b) => b.nom_boutique,
        (b) => b.vendeur_nom,
        (b) => b.vendeur_email,
      ]),
    [boutiques, query]
  );

  const filteredProduits = useMemo(
    () =>
      filterList(produits, [
        (p) => p.nom,
        (p) => p.statut,
        (p) => p.vendeur?.nom_boutique || p.nom_boutique,
      ]),
    [produits, query]
  );

  const stats = [
    {
      key: 'superadmins',
      label: 'Superadministrateurs',
      count: superadmins.length,
      icon: ShieldAlert,
      badge: 'bg-purple-50 text-purple-700',
    },
    {
      key: 'admins',
      label: 'Administrateurs',
      count: admins.length,
      icon: ShieldCheck,
      badge: 'bg-blue-50 text-blue-700',
    },
    {
      key: 'vendeurs',
      label: 'Vendeurs',
      count: vendeurs.length,
      icon: Users,
      badge: 'bg-amber-50 text-amber-700',
    },
    {
      key: 'boutiques',
      label: 'Boutiques',
      count: boutiques.length,
      icon: Store,
      badge: 'bg-emerald-50 text-emerald-700',
    },
    {
      key: 'produits',
      label: 'Produits',
      count: produits.length,
      icon: Package,
      badge: 'bg-slate-100 text-slate-800',
    },
  ];

  const tabs = [
    { id: 'tout', label: 'Vue globale' },
    { id: 'superadmins', label: `Superadministrateurs (${filteredSuperadmins.length})` },
    { id: 'admins', label: `Administrateurs (${filteredAdmins.length})` },
    { id: 'vendeurs', label: `Vendeurs (${filteredVendeurs.length})` },
    { id: 'boutiques', label: `Boutiques (${filteredBoutiques.length})` },
    { id: 'produits', label: `Produits (${filteredProduits.length})` },
  ];

  const showSection = (sectionKey) => activeTab === 'tout' || activeTab === sectionKey;

  return (
    <div className="min-h-screen bg-slate-50 pb-14">
      {/* Barre supérieure Admin */}
      <header className="bg-slate-950 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Takechap
            </span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase bg-emerald-500/15 text-emerald-400">
              {role || user?.role || 'Admin'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-white transition"
            >
              <Home className="w-4 h-4" />
              <span>Boutique</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold bg-red-600 hover:bg-red-500 text-white transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Se déconnecter</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* En-tête + recherche */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Dashboard Administration
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Bienvenue{' '}
              {user?.prenom || user?.['prénom']
                ? `${user.prenom || user['prénom']} ${user.nom || ''}`.trim()
                : 'Administrateur'}{' '}
              — supervision globale de la plateforme.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un compte, boutique, produit..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-600 transition"
            />
          </div>
        </div>

        {/* Cartes statistiques */}
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {stats.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.key}
                type="button"
                onClick={() => setActiveTab(card.key)}
                className="bg-white border border-slate-200 hover:border-emerald-500 rounded-2xl p-4 text-left transition cursor-pointer shadow-2xs"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-500">
                    {card.label}
                  </span>
                  <span className={`p-2 rounded-xl ${card.badge}`}>
                    <Icon className="w-4 h-4" />
                  </span>
                </div>
                <p className="text-2xl font-extrabold text-slate-900">{card.count}</p>
              </button>
            );
          })}
        </section>

        {/* Onglets */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-black text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-2xl px-4 py-3">
            {error}
          </div>
        )}

        {loading ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-sm text-slate-500">
            Chargement des données d&apos;administration...
          </div>
        ) : (
          <div className="space-y-8">
            {/* 1. SUPERADMINS */}
            {showSection('superadmins') && (
              <section className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4">
                <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-purple-600" />
                  <span>Liste des Superadmins ({filteredSuperadmins.length})</span>
                </h2>

                {filteredSuperadmins.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Aucun superadmin trouvé.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-slate-100 text-xs text-slate-500">
                          <th className="py-2.5 pr-4">Nom &amp; Prénom</th>
                          <th className="py-2.5 pr-4">Email</th>
                          <th className="py-2.5">Rôle</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredSuperadmins.map((u, idx) => (
                          <tr key={u.id || idx}>
                            <td className="py-3 pr-4 font-semibold text-slate-900">
                              {`${u.nom || ''} ${u.prenom || u['prénom'] || ''}`.trim() ||
                                'Superadmin'}
                            </td>
                            <td className="py-3 pr-4 text-slate-600">{u.email || '—'}</td>
                            <td className="py-3">
                              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700">
                                super_admin
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            )}

            {/* 2. ADMINS */}
            {showSection('admins') && (
              <section className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4">
                <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                  <span>Liste des Admins ({filteredAdmins.length})</span>
                </h2>

                {filteredAdmins.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Aucun admin trouvé.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-slate-100 text-xs text-slate-500">
                          <th className="py-2.5 pr-4">Nom &amp; Prénom</th>
                          <th className="py-2.5 pr-4">Email</th>
                          <th className="py-2.5">Rôle</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredAdmins.map((u, idx) => (
                          <tr key={u.id || idx}>
                            <td className="py-3 pr-4 font-semibold text-slate-900">
                              {`${u.nom || ''} ${u.prenom || u['prénom'] || ''}`.trim() ||
                                'Admin'}
                            </td>
                            <td className="py-3 pr-4 text-slate-600">{u.email || '—'}</td>
                            <td className="py-3">
                              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                                admin
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            )}

            {/* 3. VENDEURS */}
            {showSection('vendeurs') && (
              <section className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4">
                <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-600" />
                  <span>Liste des Vendeurs ({filteredVendeurs.length})</span>
                </h2>

                {filteredVendeurs.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Aucun vendeur trouvé.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-slate-100 text-xs text-slate-500">
                          <th className="py-2.5 pr-4">Vendeur</th>
                          <th className="py-2.5 pr-4">Email</th>
                          <th className="py-2.5 pr-4">Téléphone</th>
                          <th className="py-2.5">Boutique associée</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredVendeurs.map((v, idx) => (
                          <tr key={v.id || idx}>
                            <td className="py-3 pr-4 font-semibold text-slate-900">
                              {`${v.nom || ''} ${v.prenom || v['prénom'] || ''}`.trim() ||
                                'Vendeur'}
                            </td>
                            <td className="py-3 pr-4 text-slate-600">{v.email || '—'}</td>
                            <td className="py-3 pr-4 text-slate-600">{v.telephone || '—'}</td>
                            <td className="py-3 font-medium text-emerald-700">
                              {v.nom_boutique || '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            )}

            {/* 4. BOUTIQUES */}
            {showSection('boutiques') && (
              <section className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4">
                <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <Store className="w-5 h-5 text-emerald-600" />
                  <span>Liste des Boutiques ({filteredBoutiques.length})</span>
                </h2>

                {filteredBoutiques.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Aucune boutique trouvée.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredBoutiques.map((b, idx) => (
                      <div
                        key={b.id || idx}
                        className="border border-slate-200 rounded-2xl p-4 space-y-1.5 bg-slate-50/50"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-bold text-slate-900 flex items-center gap-1">
                            <span>{b.nom_boutique}</span>
                            {b.est_verifie && (
                              <BadgeCheck className="w-4 h-4 text-emerald-600" />
                            )}
                          </h3>
                          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600">
                            {b.est_verifie ? 'Vérifiée' : 'Standard'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          Gérant :{' '}
                          <span className="font-medium text-slate-700">
                            {b.vendeur_nom || '—'}
                          </span>
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* 5. PRODUITS */}
            {showSection('produits') && (
              <section className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4">
                <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <Package className="w-5 h-5 text-slate-800" />
                  <span>Liste des Produits ({filteredProduits.length})</span>
                </h2>

                {filteredProduits.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Aucun produit trouvé.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-slate-100 text-xs text-slate-500">
                          <th className="py-2.5 pr-4">Produit</th>
                          <th className="py-2.5 pr-4">Boutique / Vendeur</th>
                          <th className="py-2.5 pr-4">Prix</th>
                          <th className="py-2.5 pr-4">Stock</th>
                          <th className="py-2.5">Statut</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredProduits.map((p, idx) => (
                          <tr key={p.id || idx}>
                            <td className="py-3 pr-4 font-semibold text-slate-900">
                              {p.nom}
                            </td>
                            <td className="py-3 pr-4 text-emerald-700 font-medium">
                              {p.vendeur?.nom_boutique ||
                                p.nom_boutique ||
                                'Boutique Takechap'}
                            </td>
                            <td className="py-3 pr-4 font-bold text-slate-900">
                              {Number(p.prix || 0).toLocaleString()} FCFA
                            </td>
                            <td className="py-3 pr-4 text-slate-600">{p.stock ?? 0}</td>
                            <td className="py-3">
                              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                                {p.statut || 'actif'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            )}
          </div>
        )}

        {/* =====================================================================
            BAS DE PAGE : FORMULAIRES AJOUT ADMIN & AJOUT VENDEUR
        ===================================================================== */}
        <section className="pt-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulaire Ajouter un Admin */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  Ajouter un Administrateur
                </h2>
                <p className="text-xs text-slate-500">
                  Créer un nouveau compte admin (réservé au Superadmin).
                </p>
              </div>
            </div>

            {adminFeedback.text && (
              <div
                className={`rounded-2xl px-4 py-3 text-xs sm:text-sm border ${
                  adminFeedback.type === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    : 'bg-red-50 border-red-200 text-red-700'
                }`}
              >
                {adminFeedback.text}
              </div>
            )}

            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    name="nom"
                    required
                    value={adminForm.nom}
                    onChange={handleAdminChange}
                    placeholder="Nom de l'admin"
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:bg-white focus:border-emerald-600 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Prénom
                  </label>
                  <input
                    type="text"
                    name="prenom"
                    required
                    value={adminForm.prenom}
                    onChange={handleAdminChange}
                    placeholder="Prénom de l'admin"
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:bg-white focus:border-emerald-600 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Adresse email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={adminForm.email}
                  onChange={handleAdminChange}
                  placeholder="admin@takechap.com"
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:bg-white focus:border-emerald-600 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mot de passe
                </label>
                <input
                  type="password"
                  name="mot_de_passe"
                  required
                  minLength={6}
                  value={adminForm.mot_de_passe}
                  onChange={handleAdminChange}
                  placeholder="Minimum 6 caractères"
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:bg-white focus:border-emerald-600 transition"
                />
              </div>

              <button
                type="submit"
                disabled={adminSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-black hover:bg-neutral-800 disabled:bg-slate-400 text-white text-sm font-semibold py-3 rounded-full transition cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>
                  {adminSubmitting ? 'Ajout en cours...' : 'Ajouter un Admin'}
                </span>
              </button>
            </form>
          </div>

          {/* Formulaire Ajouter un Vendeur */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  Ajouter un Vendeur &amp; sa Boutique
                </h2>
                <p className="text-xs text-slate-500">
                  Créer un compte vendeur et attribuer son nom de boutique.
                </p>
              </div>
            </div>

            {vendeurFeedback.text && (
              <div
                className={`rounded-2xl px-4 py-3 text-xs sm:text-sm border ${
                  vendeurFeedback.type === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    : 'bg-red-50 border-red-200 text-red-700'
                }`}
              >
                {vendeurFeedback.text}
              </div>
            )}

            <form onSubmit={handleCreateVendeur} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    name="nom"
                    required
                    value={vendeurForm.nom}
                    onChange={handleVendeurChange}
                    placeholder="Nom du vendeur"
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:bg-white focus:border-emerald-600 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Prénom
                  </label>
                  <input
                    type="text"
                    name="prenom"
                    required
                    value={vendeurForm.prenom}
                    onChange={handleVendeurChange}
                    placeholder="Prénom du vendeur"
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:bg-white focus:border-emerald-600 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nom de la boutique
                  </label>
                  <input
                    type="text"
                    name="nom_boutique"
                    required
                    value={vendeurForm.nom_boutique}
                    onChange={handleVendeurChange}
                    placeholder="Ex: Vice City Shop"
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:bg-white focus:border-emerald-600 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Téléphone
                  </label>
                  <input
                    type="text"
                    name="telephone"
                    value={vendeurForm.telephone}
                    onChange={handleVendeurChange}
                    placeholder="+225 07 00 00 00 00"
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:bg-white focus:border-emerald-600 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Adresse email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={vendeurForm.email}
                    onChange={handleVendeurChange}
                    placeholder="vendeur@takechap.com"
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:bg-white focus:border-emerald-600 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    name="mot_de_passe"
                    required
                    minLength={6}
                    value={vendeurForm.mot_de_passe}
                    onChange={handleVendeurChange}
                    placeholder="Minimum 6 caractères"
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:bg-white focus:border-emerald-600 transition"
                  />
                </div>
              </div>

              <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  name="est_verifie"
                  checked={vendeurForm.est_verifie}
                  onChange={handleVendeurChange}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-600"
                />
                <span>Boutique vérifiée (badge activé)</span>
              </label>

              <button
                type="submit"
                disabled={vendeurSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-400 text-white text-sm font-semibold py-3 rounded-full transition cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>
                  {vendeurSubmitting ? 'Ajout en cours...' : 'Ajouter un Vendeur'}
                </span>
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}