import type {
  CreateHoldPayload,
  CreateOrderPayload,
  CreateOrderResponse,
  EventOffer,
  Hold,
  Order,
  OrderTicket,
} from "@/types/booking";
import { asArray } from "./events";
import { apiRequest } from "./client";

export function createHold(payload: CreateHoldPayload) {
  return apiRequest<Hold>("/bookings/holds", {
    method: "POST",
    body: payload,
    auth: true,
  });
}

export function releaseHold(holdId: string) {
  return apiRequest<{ message: string }>(`/bookings/holds/${holdId}`, {
    method: "DELETE",
    auth: true,
  });
}

export async function createOrder(payload: CreateOrderPayload) {
  const result = await apiRequest<CreateOrderResponse & { payhere?: CreateOrderResponse["payhere"] }>(
    "/bookings/orders",
    {
      method: "POST",
      body: payload,
      auth: true,
    },
  );
  if (result && "order" in result && result.order) {
    return { order: result.order, payhere: result.payhere ?? null };
  }
  return {
    order: result as unknown as Order,
    payhere: result.payhere ?? null,
  };
}

export function getOrder(orderId: string) {
  return apiRequest<Order>(`/bookings/orders/${orderId}`, { auth: true });
}

export async function listOrders() {
  const payload = await apiRequest<unknown>("/bookings/orders", { auth: true });
  return asArray<Order>(payload);
}

export async function listTickets() {
  const payload = await apiRequest<unknown>("/bookings/tickets", { auth: true });
  return asArray<OrderTicket>(payload);
}

export function getTicket(ticketId: string) {
  return apiRequest<OrderTicket>(`/bookings/tickets/${ticketId}`, { auth: true });
}

export async function listEventOffers(eventId: string) {
  const payload = await apiRequest<unknown>(`/event-offers?eventId=${encodeURIComponent(eventId)}`);
  return asArray<EventOffer>(payload).filter((offer) => offer.status !== "REVOKED");
}
