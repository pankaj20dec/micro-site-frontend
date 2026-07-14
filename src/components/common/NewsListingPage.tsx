import type { PageSummary } from "@/lib/api";
import { Container } from "@/components/ui";
import { NewsCard } from "./NewsCard";
import { NewsSidebar } from "./NewsSidebar";

export function NewsListingPage({ pages }: { pages: PageSummary[] }) {
  return (
    <div className="bg-neutral-50 py-12">
      <Container max="6xl">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_21rem]">
          <main>
            {pages.length === 0 ? (
              <p className="text-sm text-neutral-500">
                No news articles have been published yet.
              </p>
            ) : (
              <div className="flex flex-col gap-0">
                {pages.map((page) => (
                  <NewsCard key={page.id} page={page} />
                ))}
              </div>
            )}
          </main>

          <NewsSidebar featuredPages={pages} />
        </div>
      </Container>
    </div>
  );
}
