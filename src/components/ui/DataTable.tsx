import type { ReactNode } from "react";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/cn";

export function DataTable({
  headers,
  rows,
  caption,
  className = "",
  align = "left",
}: {
  headers: readonly string[];
  rows: readonly (readonly string[])[];
  caption?: ReactNode;
  className?: string;
  align?: "left" | "center";
}) {
  const textAlign = align === "center" ? "text-center" : "text-left";

  return (
    <div className={className}>
      {caption ? <p className="sr-only">{caption}</p> : null}
      <div className="overflow-x-auto rounded-lg border border-neutral-200">
        <table className={cn("w-full min-w-[520px] border-collapse text-sm", textAlign)}>
          <thead>
            <tr style={{ backgroundColor: brand.lavender }}>
              {headers.map((h) => (
                <th
                  key={h}
                  className="border border-neutral-200 px-4 py-3.5 text-sm font-bold text-neutral-900 sm:px-5 sm:py-4"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((cells, rowIndex) => (
              <tr
                key={cells[0]}
                className={rowIndex % 2 === 1 ? "bg-white" : "bg-[#F9F9FA]"}
              >
                {cells.map((cell, i) => (
                  <td
                    key={`${cells[0]}-${i}`}
                    className={cn(
                      "border border-neutral-200 px-4 py-3.5 sm:px-5 sm:py-4",
                      i === 0 && align === "left" && "font-medium text-neutral-900"
                    )}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
