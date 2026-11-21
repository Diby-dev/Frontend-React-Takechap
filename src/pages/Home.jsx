import Navbar from '../components/Navbar';
import Recherche from '../components/Recherche';
import AllProduit from '../components/AllProduit';
import VendeurInscrip from '../components/VendeurInscrip';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <Recherche />
      <AllProduit />
      <VendeurInscrip />
      <Footer />
    </>
  );
}