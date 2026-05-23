export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-zinc-100 dark:bg-zinc-950">
      <div className="mx-auto max-w-5xl px-6 py-10">{children}</div>
    </div>
  );
}
