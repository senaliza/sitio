import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { api } from '../services/api.js';

const ContenidoContext = createContext(null);

const fallback = {
  textos: {
    hero_titulo: 'Soluciones visuales que destacan su marca',
    hero_subtitulo: '',
    mision: 'Brindar soluciones de señalización y rotulación de alta calidad.',
    vision: 'Ser la empresa líder en soluciones visuales y señalización.',
    mensaje_destacado: 'Soluciones visuales para empresas de todo el país.',
    // Métricas mostradas con animación (editables desde el contenido del sitio).
    // Ajuste estos valores a las cifras reales de la empresa.
    stat_anios: '12',
    stat_proyectos: '16800',
    stat_clientes: '400',
    stat_satisfaccion: '100',
  },
  contacto: {
    telefono: '+506 8888-8888', whatsapp: '50688888888', email: 'info@senaliza.cr',
    direccion: 'San José, Costa Rica', sinpe_numero: '8888-8888', sinpe_nombre: 'Señaliza S.A.',
    transferencia_iban: 'CR0500000000000000000000', transferencia_nombre: 'Señaliza S.A.',
  },
};

export function ContenidoProvider({ children }) {
  const [data, setData] = useState(fallback);

  useEffect(() => {
    api.contenido()
      .then((d) => setData({
        textos: { ...fallback.textos, ...d.textos },
        contacto: { ...fallback.contacto, ...d.contacto },
      }))
      .catch(() => {});
  }, []);

  const valor = useMemo(() => data, [data]);
  return <ContenidoContext.Provider value={valor}>{children}</ContenidoContext.Provider>;
}

export const useContenido = () => useContext(ContenidoContext) || fallback;

export function linkWhatsApp(numero, mensaje = '') {
  const n = (numero || '').replace(/\D/g, '');
  return `https://wa.me/${n}${mensaje ? `?text=${encodeURIComponent(mensaje)}` : ''}`;
}
