import { BandTitleBlock, Container, DataTable, Section, TextLink } from "@/components/ui";
import type {
  LegalBlock,
  LegalDocumentIntro,
  LegalListItem,
  LegalSection,
} from "@/lib/legal-document";

const TOKEN = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|\n)/g;

function isListItem(item: string | LegalListItem): item is LegalListItem {
  return typeof item !== "string";
}

function RichText({ text }: { text: string }) {
  const parts = text.split(TOKEN).filter((part) => part !== "");

  return (
    <>
      {parts.map((part, index) => {
        if (part === "\n") return <br key={`br-${index}`} />;
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={`b-${index}`}>{part.slice(2, -2)}</strong>;
        }
        const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (link) {
          return (
            <TextLink key={`a-${index}`} href={link[2]}>
              {link[1]}
            </TextLink>
          );
        }
        return <span key={`t-${index}`}>{part}</span>;
      })}
    </>
  );
}

function ListItems({
  as: Tag,
  items,
}: {
  as: "ol" | "ul";
  items: readonly (string | LegalListItem)[];
}) {
  return (
    <Tag className={`${Tag === "ol" ? "list-decimal" : "list-disc"} space-y-1.5 pl-5`}>
      {items.map((item, index) => {
        const text = isListItem(item) ? item.text : item;
        const children = isListItem(item) ? item.children : undefined;
        return (
          <li key={`${text}-${index}`}>
            <RichText text={text} />
            {children && children.length > 0 ? (
              <ul className="mt-1.5 list-disc space-y-1 pl-5">
                {children.map((child) => (
                  <li key={child}>
                    <RichText text={child} />
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        );
      })}
    </Tag>
  );
}

function BlockView({ block }: { block: LegalBlock }) {
  switch (block.type) {
    case "h3":
      return (
        <h3 className="pt-2 text-base font-bold text-[#22313F] sm:text-[17px]">
          {block.text}
        </h3>
      );
    case "p":
      return (
        <p>
          <RichText text={block.text} />
        </p>
      );
    case "ol":
      return <ListItems as="ol" items={block.items} />;
    case "ul":
      return <ListItems as="ul" items={block.items} />;
    case "checks":
      return (
        <ul className="space-y-1.5">
          {block.items.map((item) => (
            <li key={item}>
              <RichText text={`✓ ${item}`} />
            </li>
          ))}
        </ul>
      );
    case "table":
      return (
        <div>
          <DataTable headers={block.headers} rows={block.rows} />
          {block.note ? (
            <p className="mt-2 text-xs italic text-[#8F8F8F] sm:text-sm">
              {block.note}
            </p>
          ) : null}
        </div>
      );
    case "note":
      return (
        <p className="italic">
          <RichText text={block.text} />
        </p>
      );
    default: {
      const _exhaustive: never = block;
      return _exhaustive;
    }
  }
}

export function LegalDocumentPage({
  titleId,
  intro,
  sections,
}: {
  titleId: string;
  intro: LegalDocumentIntro;
  sections: readonly LegalSection[];
}) {
  return (
    <div className="bg-white">
      <Section className="bg-white">
        <Container className="pt-12 pb-2 sm:pt-16">
          <BandTitleBlock id={titleId}>{intro.eyebrow}</BandTitleBlock>
        </Container>
      </Section>

      <Section className="bg-white pb-14 sm:pb-20">
        <Container className="pt-6 sm:pt-10" max="5xl">
          <article className="mx-auto max-w-3xl">
            <p className="text-xs font-medium text-[#8F8F8F] sm:text-sm">
              Document version {intro.documentVersion} · Last updated {intro.lastUpdated} ·
              Next review {intro.nextReviewDate}
            </p>

            <div className="mt-10 flex flex-col gap-10">
              {sections.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-28">
                  <h2 className="text-lg font-bold text-[#22313F] sm:text-xl">
                    {section.title}
                  </h2>
                  <div className="mt-3 space-y-3 text-sm leading-relaxed text-[#627489] sm:text-[15px]">
                    {section.blocks.map((block, index) => (
                      <BlockView key={`${section.id}-${index}`} block={block} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </article>
        </Container>
      </Section>
    </div>
  );
}
