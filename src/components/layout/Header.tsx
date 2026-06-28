import { ButtonLink, Container } from "@/components/ui";
import { HeaderBrand } from "./HeaderBrand";
import { Navigation } from "./Navigation";
import { MobileMenu } from "./MobileMenu";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200/80 bg-white shadow-sm">
      <Container className="flex items-center justify-between py-3.5 sm:py-4">
        <HeaderBrand />

        {/* Desktop nav — lg and above */}
        <div className="hidden items-center gap-8 lg:flex">
          <nav aria-label="Main">
            <Navigation />
          </nav>
          <ButtonLink
            href="/#join"
            variant="primary"
            size="md"
            className="shrink-0 rounded-full px-7 py-2.5 text-[11px] sm:text-xs"
          >
            Join the Claim
          </ButtonLink>
        </div>

        {/* Mobile hamburger — below lg */}
        <MobileMenu />
      </Container>
    </header>
  );
}
