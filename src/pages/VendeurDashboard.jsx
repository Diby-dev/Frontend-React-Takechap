import { useState, useEffect, useCallback, useRef } from 'react';
import { PlusCircle, Trash2, ImagePlus, Pencil } from 'lucide-react';
import api from '../api/axios';
import EditProduitModal from '../components/EditProduitModal';

export default function VendeurDashboard() {
  const [produits, setProduits] = useState([]);
  const [form, setForm] = useState({ nom: '', description: '', prix: '', stock: '' });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');
  const [editingProduit, setEditingProduit] = useState(null);
  const fileInputRef = useRef(null);

  const loadMesProduits = useCallback(async () => {
    const res = await api.get('/vendeur/produits');
    setProduits(res.data);
  }, []);

  useEffect(() => {
    api.get('/vendeur/produits').then((res) => setProduits(res.data));
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleAddProduit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg('');

    try {
      const formData = new FormData();
      formData.append('nom', form.nom);
      formData.append('description', form.description);
      formData.append('prix', form.prix);
      formData.append('stock', form.stock);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      await api.post('/produits', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setForm({ nom: '', description: '', prix: '', stock: '' });
      setImageFile(null);
      setPreviewUrl('');
      if (fileInputRef.current) fileInputRef.current.value = '';

      setMsg('Produit publié avec succès !');
      loadMesProduits();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Erreur lors de la publication du produit.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer définitivement ce produit ?')) return;
    await api.delete(`/produits/${id}`);
    setMsg('Produit supprimé.');
    loadMesProduits();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Espace Vendeur — Ma Boutique</h1>

      {msg && <div className="bg-emerald-50 text-emerald-800 p-3 rounded-lg text-sm font-medium">{msg}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleAddProduit} className="bg-white p-6 rounded-xl border border-slate-200 space-y-3 h-fit">
          <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-emerald-600" /> Publier un Produit
          </h2>

          <input
            type="text"
            placeholder="Nom du produit"
            required
            value={form.nom}
            onChange={(e) => setForm({ ...form, nom: e.target.value })}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
          />

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
            rows={3}
          />

          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Prix (FCFA)"
              required
              min={0}
              value={form.prix}
              onChange={(e) => setForm({ ...form, prix: e.target.value })}
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
            />
            <input
              type="number"
              placeholder="Stock"
              required
              min={0}
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Photo du produit (JPG, PNG, WEBP — max 4 Mo)
            </label>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-lg p-3 cursor-pointer transition bg-slate-50">
              {previewUrl ? (
                <img src={previewUrl} alt="Aperçu" className="h-32 w-full object-cover rounded-md" />
              ) : (
                <div className="flex flex-col items-center text-slate-500 py-2">
                  <ImagePlus className="w-6 h-6 text-emerald-600 mb-1" />
                  <span className="text-xs">Cliquez pour choisir une image</span>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white py-2 rounded-lg text-sm font-semibold cursor-pointer transition"
          >
            {submitting ? 'Publication...' : 'Publier le produit'}
          </button>
        </form>

        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200">
          <h2 className="font-bold text-slate-800 mb-4">Mes Produits en vente ({produits.length})</h2>
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
                    <p className="font-semibold text-slate-900">{p.nom}</p>
                    <p className="text-xs text-slate-500">
                      {Number(p.prix).toLocaleString()} FCFA • Stock : {p.stock} • Statut : {p.statut}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setEditingProduit(p)}
                    className="text-amber-600 hover:text-amber-700 cursor-pointer"
                    title="Modifier"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-rose-500 hover:text-rose-700 cursor-pointer"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {editingProduit && (
        <EditProduitModal
          produit={editingProduit}
          onClose={() => setEditingProduit(null)}
          onSaved={() => {
            setMsg('Produit modifié avec succès.');
            loadMesProduits();
          }}
        />
      )}
    </div>
  );
}