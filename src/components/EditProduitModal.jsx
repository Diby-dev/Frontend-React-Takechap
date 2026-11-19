import { useState } from 'react';
import { X, ImagePlus } from 'lucide-react';
import api from '../api/axios';

export default function EditProduitModal({ produit, onClose, onSaved }) {
  const [form, setForm] = useState({
    nom: produit.nom || '',
    description: produit.description || '',
    prix: produit.prix ?? '',
    stock: produit.stock ?? '',
    statut: produit.statut || 'actif',
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(produit.image_url || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const formData = new FormData();
      // Astuce Laravel : envoyer POST avec _method=PUT pour supporter les fichiers en multipart/form-data
      formData.append('_method', 'PUT');
      formData.append('nom', form.nom);
      formData.append('description', form.description);
      formData.append('prix', form.prix);
      formData.append('stock', form.stock);
      formData.append('statut', form.statut);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      await api.post(`/produits/${produit.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la modification.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900">Modifier le produit</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-3 bg-rose-50 text-rose-700 text-xs p-2.5 rounded-lg">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Nom</label>
            <input
              type="text"
              required
              value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Description</label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Prix (FCFA)</label>
              <input
                type="number"
                required
                min={0}
                value={form.prix}
                onChange={(e) => setForm({ ...form, prix: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Stock</label>
              <input
                type="number"
                required
                min={0}
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Statut</label>
              <select
                value={form.statut}
                onChange={(e) => setForm({ ...form, statut: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-2 py-2 text-sm"
              >
                <option value="actif">Actif</option>
                <option value="rupture">Rupture</option>
                <option value="archive">Archivé</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Changer l'image</label>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-lg p-2 cursor-pointer bg-slate-50">
              {previewUrl ? (
                <img src={previewUrl} alt="Aperçu" className="h-28 w-full object-cover rounded" />
              ) : (
                <div className="flex items-center gap-2 text-xs text-slate-500 py-3">
                  <ImagePlus className="w-4 h-4 text-emerald-600" />
                  <span>Choisir une image</span>
                </div>
              )}
              <input
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg cursor-pointer"
            >
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}