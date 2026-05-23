import { ButtonLink, Container } from "@/components/ui";
import { HeaderBrand } from "./HeaderBrand";
import { Navigation, NavigationCompact } from "./Navigation";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200/80 bg-white shadow-sm">
      <Container className="flex flex-wrap items-center justify-between gap-y-4 py-4 sm:py-5">
        <HeaderBrand />
        <div className="flex min-w-0 flex-1 items-center justify-end gap-6 sm:gap-8 lg:flex-initial">
          <nav className="hidden min-w-0 lg:block" aria-label="Main">
            <Navigation />
          </nav>
          <nav className="max-w-[100vw] flex-1 overflow-x-auto lg:hidden" aria-label="Main">
            <NavigationCompact />
          </nav>
          <ButtonLink
            href="/#join"
            variant="primary"
            size="md"
            className="shrink-0 rounded-full px-7 py-2.5 text-[11px] sm:text-xs"
          >
            Join the claim
          </ButtonLink>
        </div>
      </Container>
    </header>
  );
}
