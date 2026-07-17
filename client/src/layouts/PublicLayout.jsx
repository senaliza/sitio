import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import FondoDinamico from '../components/FondoDinamico.jsx';
import { useContenido, linkWhatsApp } from '../context/ContenidoContext.jsx';
import { IconWhatsApp } from '../components/Icons.jsx';

export default function PublicLayout() {
  const { contacto } = useContenido();
  return (
    <>
      <FondoDinamico />
      <Navbar />
      <main><Outlet /></main>
      <Footer />

      <a className="wsp-flotante" href={linkWhatsApp(contacto.whatsapp, 'Hola, me gustaría más información.')}
        target="_blank" rel="noreferrer" aria-label="WhatsApp">
        <IconWhatsApp size={28} />
      </a>

      <style>{`
        .wsp-flotante { position: fixed; bottom: 24px; right: 24px; z-index: 60;
          width: 58px; height: 58px; border-radius: 50%; background: #25D366; color: #fff;
          display: grid; place-items: center; box-shadow: 0 8px 28px rgba(37,211,102,.45);
          transition: transform .2s ease; }
        .wsp-flotante:hover { transform: scale(1.08) translateY(-2px); }
      `}</style>
    </>
  );
}
