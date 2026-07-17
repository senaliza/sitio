import { createContext, useContext, useReducer, useMemo } from 'react';

const CarritoContext = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case 'AGREGAR': {
      const p = action.producto;
      const existe = state.find((i) => i.id === p.id);
      if (existe) {
        return state.map((i) =>
          i.id === p.id ? { ...i, cantidad: i.cantidad + (action.cantidad || 1) } : i
        );
      }
      return [...state, { id: p.id, nombre: p.nombre, precio: Number(p.precio), imagen: p.imagen, cantidad: action.cantidad || 1 }];
    }
    case 'CANTIDAD':
      return state.map((i) =>
        i.id === action.id ? { ...i, cantidad: Math.max(1, action.cantidad) } : i
      );
    case 'ELIMINAR':
      return state.filter((i) => i.id !== action.id);
    case 'VACIAR':
      return [];
    default:
      return state;
  }
}

export function CarritoProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, []);

  const valor = useMemo(() => {
    // Total = suma de (precio plano * cantidad). NO se suma IVA ni cargo alguno.
    const total = items.reduce((acc, i) => acc + Number(i.precio) * i.cantidad, 0);
    const unidades = items.reduce((acc, i) => acc + i.cantidad, 0);
    return {
      items,
      total,
      unidades,
      agregar: (producto, cantidad) => dispatch({ type: 'AGREGAR', producto, cantidad }),
      cambiarCantidad: (id, cantidad) => dispatch({ type: 'CANTIDAD', id, cantidad }),
      eliminar: (id) => dispatch({ type: 'ELIMINAR', id }),
      vaciar: () => dispatch({ type: 'VACIAR' }),
    };
  }, [items]);

  return <CarritoContext.Provider value={valor}>{children}</CarritoContext.Provider>;
}

export const useCarrito = () => {
  const ctx = useContext(CarritoContext);
  if (!ctx) throw new Error('useCarrito debe usarse dentro de CarritoProvider');
  return ctx;
};
