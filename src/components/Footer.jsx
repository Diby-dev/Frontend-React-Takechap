import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

// Place ton image dans Frontend/public/ (ex: Frontend/public/footer-bg.jpg)
const DEFAULT_BG_IMAGE = '/footer-bg.jpg';

export default function Footer({ bgImage = DEFAULT_BG_IMAGE }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-neutral-950 text-white border-t border-neutral-800 mt-12">
      {/* Image de fond */}
      {bgImage && (
        <img
          src={bgImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
      )}

      {/* Teinte noire par-dessus l'image */}
      <div className="absolute inset-0 bg-black/75 pointer-events-none" />

      {/* Contenu au-dessus de l'image et de la teinte */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Présentation Takechap */}
          <div className="space-y-3">
            <h2 className="text-white font-extrabold text-xl tracking-tight">
              Takechap
            </h2>

            <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed max-w-sm">
              Votre marketplace à votre disposition, pour acheter et vendre en toute simplicité.
            </p>
          </div>

          {/* Navigation rapide */}
          <div className="md:justify-self-end">
            <h3 className="text-sm font-bold text-white mb-3">
              Navigation
            </h3>

            <ul className="space-y-2 text-xs sm:text-sm text-neutral-200">
              <li>
                <Link to="/" className="hover:text-emerald-400 transition">
                  Accueil & Catalogue
                </Link>
              </li>

              <li>
                <Link to="/vendeurinscp" className="hover:text-emerald-400 transition">
                  Devenir vendeur
                </Link>
              </li>

              <li>
                <Link to="/connexion" className="hover:text-emerald-400 transition">
                  Connexion
                </Link>
              </li>

              <li>
                <Link to="/inscription" className="hover:text-emerald-400 transition">
                  Créer un compte
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="md:justify-self-end">
            <h3 className="text-sm font-bold text-white mb-3">
              Contact
            </h3>

            <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-200">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Abidjan, Côte d&apos;Ivoire</span>
              </li>

              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+225 05 75 07 48 20</span>
              </li>

              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>dibyjeanyves02@gmail.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bas de page */}
        <div className="mt-8 pt-6 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-300">

          <p className="text-white/85">
            © {currentYear} Takechap. Tous droits réservés.
          </p>

          <div className="flex items-center gap-4">
            <Link to="/conditions" className="hover:text-white transition">
              Conditions d&apos;utilisation
            </Link>

            <Link to="/confidentialite" className="hover:text-white transition">
              Confidentialité
            </Link>
          </div>

        </div>
      </div>
    </footer>
  );
}