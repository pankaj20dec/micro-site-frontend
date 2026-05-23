const heights = ["9.5rem", "11rem", "10rem"] as const;

export function TeamIllustration({ className }: { className?: string }) {
  return (
    <div
      className={`relative flex aspect-[4/3] items-end justify-center gap-3 rounded-2xl bg-gradient-to-b from-violet-100/80 to-white p-8 ${className ?? ""}`}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="flex w-[4.5rem] flex-col items-center justify-end rounded-t-full bg-violet-200/90 shadow-inner"
          style={{ height: heights[i] }}
        >
          <div className="mb-2 h-10 w-10 rounded-full bg-violet-300" />
          <div className="h-14 w-12 rounded-t-lg bg-white" />
        </div>
      ))}
    </div>
  );
}
