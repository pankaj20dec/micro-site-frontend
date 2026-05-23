import type { ReactNode } from "react";
import Link from "next/link";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/cn";

function isNativeHref(href: string) {
  return /^(https?:|mailto:|tel:)/.test(href);
}

export function TextLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  const cls = cn("font-semibold underline-offset-2 hover:underline", className);
  const style = { color: brand.purple };

  if (isNativeHref(href)) {
    return (
      <a href={href} className={cls} style={style}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={cls} style={style}>
      {children}
    </Link>
  );
}
