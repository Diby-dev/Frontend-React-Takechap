import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Store,
  Package,
  PlusCircle,
  Trash2,
  LogOut,
  Home,
  BadgeCheck,
  Search,
  Image as ImageIcon,
  Layers,
  AlertCircle,
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/useAuth';

const CATEGORIES = [
  'Vêtements',
  'Appareils',
  'Aliments',
  'Meubles',
  'Services',
  'Maisons',
  'Transport',
  'Autres',
];

export default function VendeurDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Formulaire d'ajout de produit
  const [formData, setFormData] = useState({
    nom: '',
    type: 'Vêtements',
    prix: '',
    stock: '1',
    description: '',
    image_url: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  const extractList = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.produits)) return data.produits;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  };

  const refreshProduits = async () => {
    try {
      const res = await api.get('/vendeur/produits');
      setProduits(extractList(res.data));
      setError('');
    } catch (err) {
      const status = err.response?.status;
      setError(
        err.response?.data?.message ||
          `Impossible de charger vos produits (${status || 'réseau'}).`
      );
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadProduits = async () => {
      try {
        const res = await api.get('/vendeur/produits');
        if (cancelled) return;
        setProduits(extractList(res.data));
        setError('');
      } catch (err) {
        if (cancelled) return;
        const status = err.response?.status;
        setError(
          err.response?.data?.message ||
            `Impossible de charger vos produits (${status || 'réseau'}).`
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProduits();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setImageFile(null);
      setImagePreview('');
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: '', text: '' });
    setSubmitting(true);

    try {
      let res;

      if (imageFile) {
        // Envoi multipart si le vendeur sélectionne un fichier image local
        const multipart = new FormData();
        multipart.append('nom', formData.nom.trim());
        multipart.append('type', formData.type);
        multipart.append('prix', String(Number(formData.prix)));
        multipart.append('stock', String(Number(formData.stock)));
        multipart.append('description', formData.description.trim());
        multipart.append('image', imageFile);
        if (formData.image_url.trim()) {
          multipart.append('image_url', formData.image_url.trim());
        }

        res = await api.post('/produits', multipart, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        // Envoi JSON classique avec image_url
        res = await api.post('/produits', {
          nom: formData.nom.trim(),
          type: formData.type,
          prix: Number(formData.prix),
          stock: Number(formData.stock),
          description: formData.description.trim() || null,
          image_url: formData.image_url.trim() || null,
        });
      }

      const created = res.data?.produit || res.data?.data || res.data;
      if (created && created.id) {
        setProduits((prev) => [created, ...prev]);
      } else {
        await refreshProduits();
      }

      setFormData({
        nom: '',
        type: 'Vêtements',
        prix: '',
        stock: '1',
        description: '',
        image_url: '',
      });
      setImageFile(null);
      setImagePreview('');
      setFeedback({
        type: 'success',
        text: 'Produit ajouté à votre boutique avec succès.',
      });
    } catch (err) {
      const validationErrors = err.response?.data?.errors;
      const firstFieldError = validationErrors
        ? Object.values(validationErrors)[0]?.[0]
        : null;

      setFeedback({
        type: 'error',
        text:
          firstFieldError ||
          err.response?.data?.message ||
          "Erreur lors de l'ajout du produit.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduit = async (id) => {
    try {
      await api.delete(`/produits/${id}`);
      setProduits((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setFeedback({
        type: 'error',
        text:
          err.response?.data?.message ||
          'Impossible de supprimer ce produit.',
      });
    }
  };

  const filteredProduits = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return produits;
    return produits.filter((p) =>
      [p.nom, p.type, p.description]
        .filter(Boolean)
        .some((val) => String(val).toLowerCase().includes(q))
    );
  }, [produits, searchTerm]);

  const totalStock = useMemo(
    () => produits.reduce((sum, p) => sum + Number(p.stock || 0), 0),
    [produits]
  );

  const nomBoutique = user?.nom_boutique || 'Ma Boutique Takechap';
  const nomVendeur =
    `${user?.prenom || user?.['prénom'] || ''} ${user?.nom || ''}`.trim() ||
    'Vendeur';

  return (
    <div className="min-h-screen bg-slate-50 pb-14">
      {/* Barre supérieure Espace Vendeur */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-2xl font-extrabold tracking-tight text-black"
            >
              Takechap
            </Link>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">
              Espace Vendeur
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition"
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
        {/* Carte d'en-tête de la boutique */}
        <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-2xs">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Store className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {nomBoutique}
                </h1>
                {user?.est_verifie && (
                  <BadgeCheck className="w-5 h-5 text-emerald-600" />
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Bienvenue <strong className="text-slate-800">{nomVendeur}</strong> — gérez votre catalogue et publiez vos nouveaux produits.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-center min-w-[110px]">
              <p className="text-xs text-slate-500 font-medium">Produits</p>
              <p className="text-xl font-extrabold text-slate-900">
                {produits.length}
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-center min-w-[110px]">
              <p className="text-xs text-slate-500 font-medium">Stock total</p>
              <p className="text-xl font-extrabold text-emerald-600">
                {totalStock}
              </p>
            </div>
          </div>
        </section>

        {/* Grille principale : Formulaire à gauche / Catalogue à droite */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* FORMULAIRE D'AJOUT DE PRODUIT */}
          <section className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  Ajouter un produit
                </h2>
                <p className="text-xs text-slate-500">
                  Remplissez les informations pour le mettre en vente.
                </p>
              </div>
            </div>

            {feedback.text && (
              <div
                className={`rounded-2xl px-4 py-3 text-xs sm:text-sm border ${
                  feedback.type === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    : 'bg-red-50 border-red-200 text-red-700'
                }`}
              >
                {feedback.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nom du produit */}
              <div>
                <label
                  htmlFor="nom"
                  className="block text-xs font-bold text-slate-700 mb-1.5"
                >
                  Nom du produit
                </label>
                <input
                  id="nom"
                  name="nom"
                  type="text"
                  required
                  value={formData.nom}
                  onChange={handleChange}
                  placeholder="Ex: T-shirt Oversize Noir"
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:bg-white focus:border-emerald-600 transition"
                />
              </div>

              {/* Type (Catégorie) */}
              <div>
                <label
                  htmlFor="type"
                  className="block text-xs font-bold text-slate-700 mb-1.5"
                >
                  Type / Catégorie
                </label>
                <div className="relative">
                  <select
                    id="type"
                    name="type"
                    required
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:bg-white focus:border-emerald-600 transition"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Prix & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="prix"
                    className="block text-xs font-bold text-slate-700 mb-1.5"
                  >
                    Prix (FCFA)
                  </label>
                  <input
                    id="prix"
                    name="prix"
                    type="number"
                    min="0"
                    step="1"
                    required
                    value={formData.prix}
                    onChange={handleChange}
                    placeholder="Ex: 15000"
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:bg-white focus:border-emerald-600 transition"
                  />
                </div>

                <div>
                  <label
                    htmlFor="stock"
                    className="block text-xs font-bold text-slate-700 mb-1.5"
                  >
                    Stock disponible
                  </label>
                  <input
                    id="stock"
                    name="stock"
                    type="number"
                    min="0"
                    step="1"
                    required
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="Ex: 10"
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:bg-white focus:border-emerald-600 transition"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-xs font-bold text-slate-700 mb-1.5"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Décrivez votre produit (taille, matière, état, livraison...)"
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:bg-white focus:border-emerald-600 transition resize-none"
                />
              </div>

              {/* Image : URL + Fichier local */}
              <div className="space-y-2.5">
                <label
                  htmlFor="image_url"
                  className="block text-xs font-bold text-slate-700"
                >
                  Image du produit (Lien URL ou fichier)
                </label>
                <input
                  id="image_url"
                  name="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={handleChange}
                  placeholder="https://exemple.com/photo-produit.jpg"
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:bg-white focus:border-emerald-600 transition"
                />

                <label className="flex items-center justify-center gap-2 w-full py-2.5 px-4 border border-dashed border-slate-300 hover:border-emerald-600 rounded-2xl text-xs font-semibold text-slate-600 hover:text-emerald-700 bg-slate-50/70 cursor-pointer transition">
                  <ImageIcon className="w-4 h-4" />
                  <span>
                    {imageFile
                      ? imageFile.name
                      : 'Ou choisir une image depuis votre appareil'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                {(imagePreview || formData.image_url) && (
                  <div className="h-36 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                    <img
                      src={imagePreview || formData.image_url}
                      alt="Aperçu du produit"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-400 text-white font-semibold text-sm py-3.5 rounded-full shadow-sm transition cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>
                  {submitting ? 'Publication en cours...' : 'Publier le produit'}
                </span>
              </button>
            </form>
          </section>

          {/* LISTE DES PRODUITS DU VENDEUR */}
          <section className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Package className="w-5 h-5 text-slate-900" />
                <h2 className="text-lg font-extrabold text-slate-900">
                  Mes produits ({filteredProduits.length})
                </h2>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher un produit..."
                  className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:bg-white focus:border-emerald-600 transition"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-2xl px-4 py-3">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {loading ? (
              <div className="py-12 text-center text-sm text-slate-500">
                Chargement de vos produits...
              </div>
            ) : filteredProduits.length === 0 ? (
              <div className="py-12 text-center space-y-2 border border-dashed border-slate-200 rounded-2xl">
                <Layers className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-sm font-semibold text-slate-700">
                  Aucun produit publié pour le moment
                </p>
                <p className="text-xs text-slate-400">
                  Utilisez le formulaire à gauche pour ajouter votre premier produit.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredProduits.map((produit) => (
                  <article
                    key={produit.id}
                    className="border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between bg-slate-50/40"
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
                          <span className="text-xs text-slate-400">
                            Aucune image
                          </span>
                        )}
                      </div>

                      <div className="p-4 space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700">
                            {produit.type || 'Autres'}
                          </span>
                          <span className="text-xs text-slate-500">
                            Stock : <strong>{produit.stock ?? 0}</strong>
                          </span>
                        </div>

                        <h3 className="font-bold text-slate-900 line-clamp-1">
                          {produit.nom}
                        </h3>

                        {produit.description && (
                          <p className="text-xs text-slate-500 line-clamp-2">
                            {produit.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="px-4 pb-4 pt-2 flex items-center justify-between border-t border-slate-100">
                      <span className="text-sm font-extrabold text-slate-900">
                        {Number(produit.prix || 0).toLocaleString()} FCFA
                      </span>

                      <button
                        type="button"
                        onClick={() => handleDeleteProduit(produit.id)}
                        aria-label="Supprimer le produit"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 px-2.5 py-1.5 rounded-xl hover:bg-red-50 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Supprimer</span>
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}