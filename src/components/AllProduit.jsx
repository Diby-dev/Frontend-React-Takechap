import { Link, useNavigate } from 'react-router-dom';
import { Heart, Eye, BadgeCheck, Circle, RotateCcw } from 'lucide-react';

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

const normalizeText = (value = '') =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const resolveCategoryKey = (produit) => {
  const rawCat = produit.categorie || produit.type || '';
  const normCat = normalizeText(rawCat);
  const directMatch = CATEGORIES.find((cat) => normalizeText(cat) === normCat);
  if (directMatch) return normalizeText(directMatch);

  const haystack = normalizeText(`${produit.nom || ''} ${produit.description || ''}`);
  const matched = CATEGORIES.find((cat) => haystack.includes(normalizeText(cat)));
  return matched ? normalizeText(matched) : normalizeText('Autres');
};

export default function AllProduit({
  produits = [],
  loading = false,
  searchQuery = '',
  selectedCategory = '',
  onSelectProduit = () => {},
  onResetFiltres = () => {},
}) {
  const navigate = useNavigate();

  const trimmedSearch = searchQuery.trim();
  const normSearch = normalizeText(trimmedSearch);
  const normSelectedCat = normalizeText(selectedCategory);

  const titrePrincipal = (() => {
    if (trimmedSearch && selectedCategory) {
      return `Résultats pour « ${trimmedSearch} » — ${selectedCategory}`;
    }
    if (trimmedSearch) {
      return `Résultats pour « ${trimmedSearch} »`;
    }
    if (selectedCategory) {
      return selectedCategory;
    }
    return 'Tous les produits';
  })();

  const handleOpenProduit = (produit) => {
    onSelectProduit(produit);
    navigate(`/produit/${produit.id}`);
  };

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-end mb-6">
          <h2 className="inline-flex items-center gap-2.5 text-2xl sm:text-4xl font-extrabold text-slate-900 text-right">
            <Link
              to="/admin/login"
              className="text-slate-600 hover:text-emerald-600 transition-colors duration-200"
            >
              <Circle className="w-5 h-5" />
            </Link>
            <span>{titrePrincipal}</span>
          </h2>
        </div>
        <div className="py-12 text-center text-sm text-slate-500">
          Chargement des produits...
        </div>
      </section>
    );
  }

  // Filtre par nom / description / boutique si une recherche est saisie
  const filteredProduits = produits.filter((produit) => {
    if (!normSearch) return true;
    const nom = normalizeText(produit.nom || '');
    const desc = normalizeText(produit.description || '');
    const boutique = normalizeText(produit.vendeur?.nom_boutique || '');
    return (
      nom.includes(normSearch) ||
      desc.includes(normSearch) ||
      boutique.includes(normSearch)
    );
  });

  const grouped = CATEGORIES.reduce((acc, cat) => {
    acc[normalizeText(cat)] = [];
    return acc;
  }, {});

  filteredProduits.forEach((produit) => {
    const key = resolveCategoryKey(produit);
    grouped[key].push(produit);
  });

  const categoriesToDisplay = selectedCategory
    ? CATEGORIES.filter((cat) => normalizeText(cat) === normSelectedCat)
    : CATEGORIES;

  const hasFilter = Boolean(trimmedSearch || selectedCategory);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Titre dynamique aligné à droite + réinitialisation si filtre actif */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          {hasFilter && (
            <button
              type="button"
              onClick={onResetFiltres}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-700 hover:text-emerald-600 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Voir tous les produits</span>
            </button>
          )}
        </div>

        <h2 className="inline-flex items-center gap-2.5 text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-right ml-auto">
          <Link
            to="/admin/login"
            className="text-slate-600 transition-colors duration-200"
          >
            <Circle className="w-5 h-5" />
          </Link>
          <span>{titrePrincipal}</span>
        </h2>
      </div>

      {/* Sections par catégorie */}
      <div className="space-y-10">
        {categoriesToDisplay.map((category) => {
          const items = grouped[normalizeText(category)] || [];

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
                  {trimmedSearch
                    ? `Aucun produit correspondant à « ${trimmedSearch} » dans ${category}.`
                    : `Aucun produit dans ${category} pour le moment.`}
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {items.map((produit) => (
                    <article
                      key={produit.id}
                      className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
                    >
                      <div>
                        <div
                          onClick={() => handleOpenProduit(produit)}
                          className="h-44 bg-slate-100 flex items-center justify-center overflow-hidden cursor-pointer"
                        >
                          {produit.image_url ? (
                            <img
                              src={produit.image_url}
                              alt={produit.nom}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <span className="text-xs text-slate-400">Aucune image</span>
                          )}
                        </div>

                        <div className="p-4 space-y-1.5">
                          <div className="flex items-center gap-1 text-xs font-medium text-emerald-700">
                            <span>
                              {produit.vendeur?.nom_boutique || 'Boutique Takechap'}
                            </span>
                            {produit.vendeur?.est_verifie && (
                              <BadgeCheck className="w-3.5 h-3.5" />
                            )}
                          </div>

                          <h4
                            onClick={() => handleOpenProduit(produit)}
                            className="font-bold text-slate-900 line-clamp-1 cursor-pointer hover:text-emerald-700 transition"
                          >
                            {produit.nom}
                          </h4>

                          {produit.description && (
                            <p className="text-xs text-slate-500 line-clamp-2">
                              {produit.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="px-4 pb-4 pt-2 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            aria-label="Ajouter aux favoris"
                            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition cursor-pointer"
                          >
                            <Heart className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenProduit(produit)}
                            aria-label="Voir le détail"
                            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="block text-sm sm:text-base font-extrabold text-slate-900">
                            {Number(produit.prix).toLocaleString()} FCFA
                          </span>
                          <span className="text-xs text-slate-500">
                            Stock : {produit.stock}
                          </span>
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