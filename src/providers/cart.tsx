import { createContext, use, useMemo, useState, type PropsWithChildren } from 'react';

import { BOOKING_FEE, PROMO_DISCOUNT, tiers } from '@/mocks/catalog';

/** Local booking selection shared by the ticket → seats → checkout screens. */
type Cart = {
  qty: Record<string, number>;
  section: string;
  seats: string[];
  promo: boolean;
  method: 'card' | 'wallet' | 'bank';
  /** ISO time the seat hold ends; seats are held for 10 minutes. */
  holdUntil: string | null;
};

type CartValue = Cart & {
  count: number;
  subtotal: number;
  total: number;
  summary: string;
  /** Tier whose seats are being picked (the first tier with tickets). */
  tier: string;
  setQty: (tier: string, qty: number) => void;
  setSection: (section: string) => void;
  setSeats: (seats: string[]) => void;
  setPromo: (on: boolean) => void;
  setMethod: (method: Cart['method']) => void;
  startHold: () => void;
  endHold: () => void;
};

const CartContext = createContext<CartValue | null>(null);

const initial: Cart = {
  qty: { VIP: 0, Gold: 2, Silver: 0, Balcony: 0 },
  section: 'Gold Centre',
  seats: ['G5', 'G6'],
  promo: false,
  method: 'card',
  holdUntil: null,
};

export function CartProvider({ children }: PropsWithChildren) {
  const [cart, setCart] = useState(initial);
  const value = useMemo<CartValue>(() => {
    const count = tiers.reduce((n, t) => n + (cart.qty[t.name] ?? 0), 0);
    const subtotal = tiers.reduce((n, t) => n + (cart.qty[t.name] ?? 0) * t.price, 0);
    const summary = tiers.filter(t => cart.qty[t.name]).map(t => `${cart.qty[t.name]} × ${t.name}`).join(', ');
    return {
      ...cart,
      count,
      subtotal,
      total: subtotal + BOOKING_FEE - (cart.promo ? PROMO_DISCOUNT : 0),
      summary,
      tier: tiers.find(t => cart.qty[t.name])?.name ?? 'Gold',
      setQty: (tier, qty) => setCart(s => ({ ...s, qty: { ...s.qty, [tier]: qty }, seats: [] })),
      setSection: section => setCart(s => ({ ...s, section })),
      setSeats: seats => setCart(s => ({ ...s, seats })),
      setPromo: promo => setCart(s => ({ ...s, promo })),
      setMethod: method => setCart(s => ({ ...s, method })),
      startHold: () => setCart(s => ({ ...s, holdUntil: new Date(Date.now() + 10 * 60_000).toISOString() })),
      endHold: () => setCart(s => ({ ...s, holdUntil: null })),
    };
  }, [cart]);
  return <CartContext value={value}>{children}</CartContext>;
}

export function useCart() {
  const value = use(CartContext);
  if (!value) throw new Error('useCart must be used inside <CartProvider />');
  return value;
}
