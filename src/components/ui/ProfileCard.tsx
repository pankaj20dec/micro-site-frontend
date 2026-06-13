import Image from "next/image";
import type { ReactNode } from "react";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { IconLinkedIn } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

export type ProfileCardProps = {
  name: string;
  bio: string;
  linkedInHref?: string;
  linkedInLabel?: string;
  imageSrc?: string;
  imageAlt?: string;
  className?: string;
  media?: ReactNode;
};

export function ProfileCard({
  name,
  bio,
  linkedInHref,
  linkedInLabel,
  imageSrc,
  imageAlt = "",
  className,
  media,
}: ProfileCardProps) {
  const mediaNode =
    media ??
    (imageSrc ? (
      <Image
        src={imageSrc}
        alt={imageAlt}
        width={400}
        height={300}
        sizes="(max-width: 640px) 80vw, (max-width: 1024px) 35vw, 320px"
        className="aspect-[4/3] w-full rounded-xl object-cover"
      />
    ) : (
      <ImagePlaceholder />
    ));

  return (
    <article
      className={cn(
        "mx-auto rounded-2xl border border-neutral-200/70 bg-white p-4 md:p-6 shadow-[0_4px_12px_rgba(15,23,42,0.06),0_20px_40px_-12px_rgba(15,23,42,0.18)] sm:p-8 lg:p-10",
        className
      )}
    >
      <div className="grid gap-6 sm:grid-cols-12 sm:items-start sm:gap-8 lg:gap-10">
        <div className="sm:col-span-5 lg:col-span-4">{mediaNode}</div>

        <div className="min-w-0 sm:col-span-7 lg:col-span-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h2 className="text-xl font-bold leading-tight text-[#22313F] sm:text-2xl">{name}</h2>
            {linkedInHref ? (
              <a
                href={linkedInHref}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-[#0A66C2] transition hover:opacity-80"
                aria-label={linkedInLabel ?? `${name} on LinkedIn`}
              >
                <IconLinkedIn className="h-6 w-6 sm:h-7 sm:w-7" />
              </a>
            ) : null}
          </div>
          <p className="mt-4 text-left text-sm leading-[1.75] sm:text-base">{bio}</p>
        </div>
      </div>
    </article>
  );
}
