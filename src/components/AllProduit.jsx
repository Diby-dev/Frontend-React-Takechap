import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Eye, BadgeCheck, Circle } from 'lucide-react';

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

const normalizeCategory = (value = '') =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

export default function AllProduit({
  produits = [],
  loading = false,
  onAcheter = () => {},
  onSelectProduit = () => {},
}) {
  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-end mb-6">
          <h2 className="inline-flex items-center gap-2.5 text-3xl sm:text-4xl font-extrabold text-slate-900 text-right">
            <Link
              to="/admin/login"
              className="text-white hover:text-emerald-600 transition-colors duration-200"
            >
              <Circle className="w-5 h-5" />
            </Link>
            <span>Tous les produits</span>
          </h2>
        </div>
        <div className="py-12 text-center text-sm text-slate-500">
          Chargement des produits...
        </div>
      </section>
    );
  }

  const grouped = CATEGORIES.reduce((acc, cat) => {
    acc[normalizeCategory(cat)] = [];
    return acc;
  }, {});

  produits.forEach((produit) => {
    const rawCat = produit.categorie || produit.type || '';
    const normCat = normalizeCategory(rawCat);

    if (grouped[normCat]) {
      grouped[normCat].push(produit);
    } else {
      const haystack = normalizeCategory(`${produit.nom || ''} ${produit.description || ''}`);
      const matched = CATEGORIES.find((cat) => haystack.includes(normalizeCategory(cat)));
      const targetKey = matched ? normalizeCategory(matched) : normalizeCategory('Autres');
      grouped[targetKey].push(produit);
    }
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Titre aligné à droite avec l'icône cliquable vers l'admin devant */}
      <div className="flex justify-end">
        <h2 className="inline-flex items-center gap-2.5 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-right">
          <Link
            to="/admin/login"
            className="text-slate-600 transition-colors duration-200"
          >
            <Circle className="w-5 h-5" />
          </Link>
          <span>Tous les produits</span>
        </h2>
      </div>

      {/* Sections alignées par catégorie */}
      <div className="space-y-10">
        {CATEGORIES.map((category) => {
          const items = grouped[normalizeCategory(category)] || [];

          return (
            <div key={category} className="space-y-4">
              <div className="flex items-center gap-4">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 shrink-0">
                  {category}
                </h3>
                <div className="flex-1 border-b-2 border-dotted border-slate-300" />
                <span className="text-xs font-medium text-slate-500 shrink-0">
                  {items.length} produit{items.length > 1 ? 's' : ''}
                </span>
              </div>

              {items.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-2">
                  Aucun produit dans {category} pour le moment.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {items.map((produit) => (
                    <article
                      key={produit.id}
                      className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
                    >
                      <div>
                        <div className="h-44 bg-slate-100 flex items-center justify-center overflow-hidden">
                          {produit.image_url ? (
                            <img
                              src={produit.image_url}
                              alt={produit.nom}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-xs text-slate-400">Aucune image</span>
                          )}
                        </div>

                        <div className="p-4 space-y-1.5">
                          <div className="flex items-center gap-1 text-xs font-medium text-emerald-700">
                            <span>{produit.vendeur?.nom_boutique || 'Boutique Takechap'}</span>
                            {produit.vendeur?.est_verifie && <BadgeCheck className="w-3.5 h-3.5" />}
                          </div>

                          <h4 className="font-bold text-slate-900 line-clamp-1">{produit.nom}</h4>

                          {produit.description && (
                            <p className="text-xs text-slate-500 line-clamp-2">
                              {produit.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="px-4 pb-4 pt-2 space-y-3">
                        <div className="flex items-baseline justify-between">
                          <span className="text-sm sm:text-base font-extrabold text-slate-900">
                            {Number(produit.prix).toLocaleString()} FCFA
                          </span>
                          <span className="text-xs text-slate-500">Stock : {produit.stock}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onAcheter(produit.id)}
                            disabled={produit.stock <= 0}
                            className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 text-white text-xs font-semibold py-2 px-3 rounded-xl transition cursor-pointer"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>{produit.stock > 0 ? 'Acheter' : 'Épuisé'}</span>
                          </button>

                          <button
                            type="button"
                            aria-label="Ajouter aux favoris"
                            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition cursor-pointer"
                          >
                            <Heart className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onSelectProduit(produit)}
                            aria-label="Voir le détail"
                            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}