"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/cn";
import { ButtonLink, Container, MediaFrame } from "@/components/ui";
import { heroSlides } from "./heroSlides";

const AUTOPLAY_MS = 7000;

/** Tiled hex watermark (left side reads as molecular / honeycomb) */
const hexPattern =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='49' viewBox='0 0 56 49'%3E%3Cg fill='none' stroke='%237D2E7E' stroke-opacity='0.14' stroke-width='1'%3E%3Cpath d='M28 1l13.9 8v16l-13.9 8-13.9-8V9z'/%3E%3Cpath d='M0 24.5l13.9-8v16l13.9 8M56 24.5l-13.9-8v16l-13.9 8'/%3E%3C/g%3E%3C/svg%3E\")";

export function HeroSlider() {
  const [active, setActive] = useState(0);
  const count = heroSlides.length;
  const pauseRef = useRef(false);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (!pauseRef.current) {
        setActive((i) => (i + 1) % count);
      }
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [count]);

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        pauseRef.current = true;
      }}
      onMouseLeave={() => {
        pauseRef.current = false;
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
        style={{
          backgroundImage: hexPattern,
          backgroundSize: "56px 49px",
          maskImage: "linear-gradient(90deg, black 0%, black 42%, transparent 70%)",
          WebkitMaskImage: "linear-gradient(90deg, black 0%, black 42%, transparent 70%)",
        }}
      />

      <Container className="relative z-10 grid items-center gap-10 py-12 sm:py-14 lg:grid-cols-2 lg:gap-12 lg:py-20">
        <div>
          <div
            className="relative min-h-[17.5rem] sm:min-h-[19rem]"
            aria-live="polite"
            aria-atomic="true"
          >
            {heroSlides.map((slide, i) => (
              <div
                key={slide.title}
                className={cn(
                  "transition-opacity duration-500 ease-out",
                  i === active ? "relative z-10 opacity-100" : "pointer-events-none absolute inset-0 opacity-0"
                )}
                aria-hidden={i !== active}
              >
                <h1 className="font-top-heading pr-2 text-3xl font-bold leading-tight tracking-normal text-[#22313F] sm:text-4xl lg:text-[2.1rem] lg:leading-[1.22]">
                  {slide.title}
                </h1>
                <p
                  className="mt-4 text-xl font-bold text-neutral-900 sm:text-2xl"
                  style={{ color: brand.purple }}
                >
                  {slide.subheading}
                </p>
                <div className="mt-6 max-w-xl space-y-4 text-base font-normal leading-relaxed text-neutral-700">
                  <p>{slide.paragraphs[0]}</p>
                  <p>{slide.paragraphs[1]}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <ButtonLink
              href="#join"
              variant="primary"
              size="md"
              className="rounded-full px-8 py-3 text-xs sm:text-sm"
            >
              Join the claim
            </ButtonLink>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative min-h-[280px] sm:min-h-[360px] lg:min-h-[420px]">
            {heroSlides.map((slide, i) => (
              <div
                key={slide.image.src}
                className={cn(
                  "transition-opacity duration-500 ease-out",
                  i === active ? "relative z-10 opacity-100" : "pointer-events-none absolute inset-0 opacity-0"
                )}
              >
                <MediaFrame className="h-full min-h-[280px] sm:min-h-[360px] lg:min-h-[420px]">
                  <Image
                    src={slide.image.src}
                    alt={slide.image.alt}
                    width={720}
                    height={900}
                    className="h-full min-h-[280px] w-full object-cover object-top sm:min-h-[360px] lg:min-h-[420px]"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority={i === 0}
                  />
                </MediaFrame>
              </div>
            ))}
          </div>
        </div>
      </Container>

      <div className="relative z-10 flex justify-center px-6 pb-10 pt-2 sm:pb-12 lg:justify-end lg:pr-[max(1.5rem,calc((100vw-1400px)/2+1.5rem))]">
        <div className="flex items-center gap-2.5" role="tablist" aria-label="Hero slides">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Go to slide ${i + 1} of ${count}`}
              onClick={() => setActive(i)}
              className={cn(
                "rounded-full transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400",
                i === active
                  ? "h-3 w-3 scale-100 ring-2 ring-white ring-offset-0"
                  : "h-2.5 w-2.5 bg-violet-200/90 hover:bg-violet-300"
              )}
              style={i === active ? { backgroundColor: brand.purple } : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
