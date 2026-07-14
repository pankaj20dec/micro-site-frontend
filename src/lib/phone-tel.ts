export function phoneTelHref(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "tel:";
  if (digits.startsWith("0")) return `tel:+44${digits.slice(1)}`;
  return `tel:+${digits}`;
}
