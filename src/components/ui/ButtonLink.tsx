import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/cn";

const base =
  "inline-flex items-center justify-center font-bold uppercase tracking-widest transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

const sizes = {
  md: "px-6 py-3 text-xs sm:text-sm",
  sm: "px-4 py-2.5 text-[10px] sm:text-xs",
  lg: "px-8 py-3 text-xs sm:text-sm",
} as const;

export type ButtonLinkVariant = "primary" | "outline" | "inverse";

function isNativeHref(href: string) {
  return /^(https?:|mailto:|tel:|#)/.test(href);
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
}: {
  href: string;
  variant?: ButtonLinkVariant;
  size?: keyof typeof sizes;
  className?: string;
  children: ReactNode;
}) {
  let style: CSSProperties | undefined;
  const classes = cn(
    base,
    sizes[size],
    variant === "primary" && "text-white hover:opacity-95",
    variant === "outline" && "border-2 hover:bg-violet-50/80",
    variant === "inverse" &&
      "border-2 border-white bg-white text-[#521f52] hover:bg-transparent hover:text-white",
    className
  );

  if (variant === "primary") {
    style = { backgroundColor: brand.purple };
  } else if (variant === "outline") {
    style = { borderColor: brand.purple, color: brand.purple };
  }

  if (isNativeHref(href)) {
    return (
      <a href={href} className={classes} style={style}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} style={style}>
      {children}
    </Link>
  );
}
