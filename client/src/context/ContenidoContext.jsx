import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { api } from '../services/api.js';

const ContenidoContext = createContext(null);

const fallback = {
  textos: {
    hero_titulo: 'Especialistas en Señalética, Acrílicos y Seguridad Vial e Industrial',
    hero_subtitulo: 'Empresa con 15 años de experiencia ofreciendo soluciones publicitarias para su empresa',
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
  // `cargado` indica que ya llegó (o falló) la respuesta del backend. Sirve
  // para no mostrar textos por defecto que luego cambian: los componentes
  // pueden esperar a que sea true antes de pintar contenido editable.
  const [cargado, setCargado] = useState(false);

  useEffect(() => {
    api.contenido()
      .then((d) => setData({
        textos: { ...fallback.textos, ...d.textos },
        contacto: { ...fallback.contacto, ...d.contacto },
      }))
      .catch(() => {})
      .finally(() => setCargado(true));
  }, []);

  const valor = useMemo(() => ({ ...data, cargado }), [data, cargado]);
  return <ContenidoContext.Provider value={valor}>{children}</ContenidoContext.Provider>;
}

export const useContenido = () => useContext(ContenidoContext) || { ...fallback, cargado: false };

export function linkWhatsApp(numero, mensaje = '') {
  const n = (numero || '').replace(/\D/g, '');
  return `https://wa.me/${n}${mensaje ? `?text=${encodeURIComponent(mensaje)}` : ''}`;
}
