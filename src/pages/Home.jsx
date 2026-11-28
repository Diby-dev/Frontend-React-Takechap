import { useCatalogue } from '../hooks/useCatalogue';
import Navbar from '../components/Navbar';
import Recherche from '../components/Recherche';
import AllProduit from '../components/AllProduit';
import VendeurInscrip from '../components/VendeurInscrip';
import Footer from '../components/Footer';

export default function Home() {
  const {
    produits,
    loading,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    feedback,
    setFeedback,
    fetchProduits,
    handleSelectProduit,
    resetFiltres,
  } = useCatalogue();

  return (
    <>
      <Navbar />
      <Recherche
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={fetchProduits}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {feedback && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-2xl px-4 py-3 flex items-center justify-between">
            <span>{feedback}</span>
            <button
              type="button"
              onClick={() => setFeedback('')}
              className="text-xs font-bold underline cursor-pointer"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      <AllProduit
        produits={produits}
        loading={loading}
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        onSelectProduit={handleSelectProduit}
        onResetFiltres={resetFiltres}
      />

      <VendeurInscrip />
      <Footer />
    </>
  );
}