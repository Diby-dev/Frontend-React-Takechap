export default function ProduitModal({ produit, onClose, onAcheter }) {
  if (!produit) return null;

  const stock = Number(produit.stock ?? 0);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200"
      >
        {produit.image_url && (
          <img
            src={produit.image_url}
            alt={produit.nom}
            className="w-full h-52 object-cover rounded-2xl bg-slate-100"
          />
        )}

        <div className="flex items-center justify-between gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
            {produit.type || 'Autres'}
          </span>
          <span className="text-xs text-slate-500">
            Boutique :{' '}
            <strong className="text-slate-800">
              {produit.vendeur?.nom_boutique || 'Boutique Takechap'}
            </strong>
          </span>
        </div>

        <h3 className="text-xl font-extrabold text-slate-900">{produit.nom}</h3>

        {produit.description && (
          <p className="text-sm text-slate-600 leading-relaxed">
            {produit.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <span className="text-lg font-extrabold text-slate-900">
            {Number(produit.prix || 0).toLocaleString()} FCFA
          </span>
          <span className="text-xs text-slate-500">
            Stock : <strong>{stock}</strong>
          </span>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              onClose();
              onAcheter(produit.id);
            }}
            disabled={stock <= 0}
            className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 text-white text-sm font-semibold py-2.5 rounded-full transition cursor-pointer"
          >
            {stock > 0 ? 'Acheter maintenant' : 'Épuisé'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}