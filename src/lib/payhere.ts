import type { PayHereCheckout } from "@/types/booking";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

const PAYHERE_FIELDS: Array<keyof PayHereCheckout> = [
  "merchant_id",
  "return_url",
  "cancel_url",
  "notify_url",
  "order_id",
  "items",
  "amount",
  "currency",
  "first_name",
  "last_name",
  "email",
  "phone",
  "address",
  "city",
  "country",
  "hash",
];

export function payhereCheckoutHtml(payload: PayHereCheckout) {
  const inputs = PAYHERE_FIELDS.map(
    (field) =>
      `<input type="hidden" name="${field}" value="${escapeHtml(String(payload[field] ?? ""))}" />`,
  ).join("");

  return `<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font-family: -apple-system, sans-serif; background: #050b18; color: #eef3ff; display: flex; min-height: 100vh; align-items: center; justify-content: center; }
    </style>
  </head>
  <body onload="document.forms[0].submit()">
    <form method="POST" action="${escapeHtml(payload.checkout_url)}">
      ${inputs}
    </form>
    <p>Taking you to PayHere…</p>
  </body>
</html>`;
}

export function isPayhereReturnUrl(url: string, payload: PayHereCheckout) {
  const current = url.split("?")[0];
  const returnUrl = payload.return_url.split("?")[0];
  const cancelUrl = payload.cancel_url.split("?")[0];
  return current.startsWith(returnUrl) || current.startsWith(cancelUrl);
}
