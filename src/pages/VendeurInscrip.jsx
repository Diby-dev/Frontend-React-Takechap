import { Link } from 'react-router-dom';
import { ArrowLeft, Store, MessageCircle, Phone } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Remplace par ton numéro au format international sans "+" ni espaces (ex: 2250700000000)
const WHATSAPP_NUMBER = '2250575074820';
const PHONE_NUMBER = '+2250575074820';
const PHONE_DISPLAY = '+225 05 75 07 48 20';

// Optionnel : mets l'URL ou l'import de tes propres logos (ex: import whatsappLogo from '../assets/whatsapp.png')
const CUSTOM_WHATSAPP_LOGO_URL = '';
const CUSTOM_PHONE_LOGO_URL = '';

export default function VendeurInscrip() {
  const whatsappMessage = encodeURIComponent(
    "Bonjour Takechap, je souhaite devenir vendeur et enregistrer ma boutique. Voici mes informations :\n- Nom & Prénom : \n- Nom de la boutique : \n- Téléphone : \n- Email : "
  );
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;
  const telHref = `tel:${PHONE_NUMBER}`;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        <Navbar />

        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-black transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour à l&apos;accueil</span>
            </Link>
          </div>

          <section className="bg-white border border-slate-200 rounded-3xl shadow-sm p-8 sm:p-10 space-y-8 text-center">
            <div className="space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <Store className="w-7 h-7" />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                Espace Futurs Vendeurs
              </p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Contactez-nous pour ouvrir votre boutique
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
                Les comptes vendeurs sont validés et enregistrés directement par l&apos;équipe
                Takechap. Contactez-nous par WhatsApp ou par appel téléphonique pour créer votre
                espace vendeur et enregistrer votre boutique.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              {/* Bouton 1 : Me contacter par WhatsApp */}
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm sm:text-base px-6 py-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200"
              >
                {CUSTOM_WHATSAPP_LOGO_URL ? (
                  <img
                    src={CUSTOM_WHATSAPP_LOGO_URL}
                    alt="Logo WhatsApp"
                    className="w-6 h-6 object-contain shrink-0"
                  />
                ) : (
                  <MessageCircle className="w-6 h-6 shrink-0" />
                )}
                <span>Me contacter par WhatsApp</span>
              </a>

              {/* Bouton 2 : Me contacter par téléphone -> ouvre l'appli téléphone */}
              <a
                href={telHref}
                className="group flex items-center justify-center gap-3 bg-black hover:bg-neutral-800 text-white font-semibold text-sm sm:text-base px-6 py-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200"
              >
                {CUSTOM_PHONE_LOGO_URL ? (
                  <img
                    src={CUSTOM_PHONE_LOGO_URL}
                    alt="Logo Téléphone"
                    className="w-6 h-6 object-contain shrink-0"
                  />
                ) : (
                  <Phone className="w-6 h-6 shrink-0" />
                )}
                <span>Me contacter par téléphone</span>
              </a>
            </div>

            <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-1">
              <p>
                Numéro direct : <strong className="text-slate-800">{PHONE_DISPLAY}</strong>
              </p>
              <p>
                Préparez votre nom, prénom, nom de boutique, email et numéro de téléphone.
              </p>
            </div>
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
}