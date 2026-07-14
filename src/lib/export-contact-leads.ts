import type { ContactLead } from "@/lib/admin-contact-api";

function escapeCsvCell(value: string) {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function contactLeadsToCsv(leads: ContactLead[]) {
  const headers = [
    "ID",
    "Name",
    "Email",
    "Subject",
    "Message",
    "IP Address",
    "Status",
    "Submitted At",
  ];

  const rows = leads.map((lead) => [
    lead.id,
    lead.name,
    lead.email,
    lead.subject,
    lead.message,
    lead.ip ?? "",
    lead.status,
    new Date(lead.createdAt).toISOString(),
  ]);

  return [headers, ...rows]
    .map((row) => row.map((cell) => escapeCsvCell(String(cell))).join(","))
    .join("\r\n");
}

export function downloadContactLeadsCsv(leads: ContactLead[], filename?: string) {
  const csv = contactLeadsToCsv(leads);
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const date = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.download = filename ?? `contact-leads-${date}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
