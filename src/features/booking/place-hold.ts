import { createHold } from "@/lib/api/bookings";

export function placeHold(input: {
  eventId: string;
  seatIds: string[];
  standing: Record<string, number>;
  promoCode?: string;
}) {
  const standing = Object.entries(input.standing)
    .filter(([, quantity]) => quantity > 0)
    .map(([ticketCategoryId, quantity]) => ({ ticketCategoryId, quantity }));
  const promo = input.promoCode?.trim().toUpperCase();
  return createHold({
    eventId: input.eventId,
    ...(input.seatIds.length ? { seatIds: input.seatIds } : {}),
    ...(standing.length ? { standing } : {}),
    ...(promo ? { promoCode: promo } : {}),
  });
}
