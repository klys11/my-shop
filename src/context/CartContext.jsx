import { createContext, useContext, useReducer } from "react";

const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const existing = state.find((i) => i.id === action.product.id);
      if (existing) {
        return state.map((i) =>
          i.id === action.product.id ? { ...i, qty: i.qty + action.qty } : i,
        );
      }
      return [...state, { ...action.product, qty: action.qty }];
    }

    case "REMOVE":
      return state.filter((i) => i.id !== action.id);

    case "SET_QTY":
      return state.map((i) =>
        i.id === action.id ? { ...i, qty: Math.max(1, action.qty) } : i,
      );

    case "CLEAR":
      return [];

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, []);

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);
  const cartSubtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shipping = cartSubtotal === 0 ? 0 : cartSubtotal >= 50 ? 0 : 5.99;
  const cartTotal = cartSubtotal + shipping;

  return (
    <CartContext.Provider
      value={{ cart, dispatch, cartCount, cartSubtotal, shipping, cartTotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
