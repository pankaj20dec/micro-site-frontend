export function isPayPalStubMode() {
  const id = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID?.trim();
  return !id || id === "placeholder";
}

export function getPayPalClientId() {
  return process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID?.trim() ?? "";
}
