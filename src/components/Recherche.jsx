import { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, X } from 'lucide-react';

const SLIDES = [
  { url: '/slide1.jpg', alt: 'Slide 1' },
  { url: '/slide2.jpg', alt: 'Slide 2' },
  { url: '/slide3.jpg', alt: 'Slide 3' },
  { url: '/slide4.jpg', alt: 'Slide 4' },
];

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

export default function Recherche({
  searchQuery = '',
  onSearchChange = () => {},
  onSearchSubmit = () => {},
  selectedCategory = '',
  onSelectCategory = () => {},
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SLIDES.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % SLIDES.length);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSearchSubmit(searchQuery);
  };

  const handleCategoryClick = (category) => {
    onSelectCategory(selectedCategory === category ? '' : category);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
      <div className="relative h-[380px] sm:h-[430px] w-full rounded-2xl overflow-hidden shadow-md bg-slate-900 select-none">
        {SLIDES.map((slide, index) => (
          <img
            key={slide.url}
            src={slide.url}
            alt={slide.alt}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
              index === activeIndex
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-105 pointer-events-none'
            }`}
          />
        ))}

        <div className="absolute inset-0 bg-black/45" />

        <button
          type="button"
          onClick={handlePrev}
          aria-label="Image précédente"
          className="hidden sm:flex items-center justify-center absolute left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/35 hover:bg-black/60 text-white transition cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Image suivante"
          className="hidden sm:flex items-center justify-center absolute right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/35 hover:bg-black/60 text-white transition cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-12 text-center">
          <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight max-w-2xl leading-snug drop-shadow-sm mb-6">
            Tous ce dont vous avez besoins en un seul endroit
          </h1>

          <form onSubmit={handleFormSubmit} className="w-full max-w-3xl">
            <div className="flex items-center bg-white/95 backdrop-blur-sm rounded-full shadow-lg px-4 py-2 sm:py-2.5 border border-white/40 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500 transition">
              <Search className="w-5 h-5 text-slate-500 shrink-0 mr-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Recherche"
                className="w-full bg-transparent text-slate-800 placeholder-slate-500 text-sm sm:text-base focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    onSearchChange('');
                    onSearchSubmit('');
                  }}
                  aria-label="Effacer la recherche"
                  className="text-slate-400 hover:text-slate-700 mr-2 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full transition cursor-pointer shrink-0"
              >
                Rechercher
              </button>
            </div>
          </form>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 max-w-3xl">
            {CATEGORIES.map((category) => {
              const isSelected = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategoryClick(category)}
                  className={`px-3.5 py-1 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-sm scale-105'
                      : 'bg-black/45 hover:bg-black/70 text-white/95 backdrop-blur-xs border border-white/15'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {SLIDES.map((slide, index) => (
            <button
              key={slide.url}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Aller à l'image ${index + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                index === activeIndex
                  ? 'w-6 bg-white'
                  : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}