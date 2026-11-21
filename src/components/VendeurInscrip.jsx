import { useNavigate } from 'react-router-dom';

// Place ton image dans Frontend/public/ (ex: Frontend/public/vendeur-banner.jpg)
const DEFAULT_IMAGE = '/vendeur-banner.jpg';

export default function VendeurInscrip({ imageUrl = DEFAULT_IMAGE }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/vendeurinscp');
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        type="button"
        onClick={handleClick}
        className="group relative w-full h-44 sm:h-52 rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer flex items-center justify-center text-center px-6 sm:px-10 bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
      >
        {/* Image de fond choisie */}
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Devenir vendeur sur Takechap"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}

        {/* Teinte sombre pour faire ressortir le texte */}
        <div className="absolute inset-0  group-hover:bg-black/65 transition-colors duration-300" />

        {/* Texte en gras centré */}
        <span className="relative z-10 text-xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug drop-shadow-sm">
          Vous voulez vendre vos produit sur notre plateforme
        </span>
      </button>
    </section>
  );
}