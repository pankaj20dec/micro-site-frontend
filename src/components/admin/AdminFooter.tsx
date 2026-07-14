export function AdminFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200/80 bg-white px-4 py-4 lg:px-8">
      <p className="text-center text-xs text-slate-400 lg:text-left">
        © {year} FIPO · Admin portal for authorised users only
      </p>
    </footer>
  );
}
