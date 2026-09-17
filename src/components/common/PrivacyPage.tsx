import { BandTitleBlock, Container, Section, TextLink } from "@/components/ui";
import { brand } from "@/lib/brand";
import { phoneTelHref } from "@/lib/phone-tel";
import {
  privacyContact,
  privacyPageIntro,
  privacySections,
} from "@/lib/privacy-content";

export function PrivacyPage() {
  return (
    <div className="bg-white">
      <Section className="bg-white">
        <Container className="pt-12 pb-2 sm:pt-16">
          <BandTitleBlock id="privacy-page-title">
            {privacyPageIntro.eyebrow}
          </BandTitleBlock>
        </Container>
      </Section>

      <Section className="bg-white pb-14 sm:pb-20">
        <Container className="pt-6 sm:pt-10" max="5xl">
          <article className="mx-auto max-w-3xl">
            <p className="text-sm leading-relaxed text-[#627489] sm:text-[15px]">
              {privacyPageIntro.summary}
            </p>
            <p className="mt-3 text-xs font-medium text-[#8F8F8F] sm:text-sm">
              Last updated: {privacyPageIntro.lastUpdated}
            </p>

            <div className="mt-10 flex flex-col gap-10">
              {privacySections.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-28">
                  <h2 className="text-lg font-bold text-[#22313F] sm:text-xl">
                    {section.title}
                  </h2>
                  <div className="mt-3 space-y-3 text-sm leading-relaxed text-[#627489] sm:text-[15px]">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                    {section.bullets && section.bullets.length > 0 ? (
                      <ul className="flex flex-col gap-2.5">
                        {section.bullets.map((item) => (
                          <li key={item} className="flex gap-3">
                            <span
                              aria-hidden
                              className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                              style={{ backgroundColor: brand.purple }}
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    {section.afterBullets?.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </section>
              ))}

              <section id="contact-details" className="scroll-mt-28">
                <h2 className="text-lg font-bold text-[#22313F] sm:text-xl">
                  {privacyContact.title}
                </h2>
                <div className="mt-3 space-y-3 text-sm leading-relaxed text-[#627489] sm:text-[15px]">
                  <p>{privacyContact.intro}</p>
                  <ul className="space-y-1.5">
                    {privacyContact.emails.map((email) => (
                      <li key={email.address}>
                        {email.label}:{" "}
                        <TextLink href={`mailto:${email.address}`}>{email.address}</TextLink>
                      </li>
                    ))}
                    <li>
                      Telephone:{" "}
                      <TextLink href={phoneTelHref(privacyContact.phone)}>
                        {privacyContact.phone}
                      </TextLink>
                    </li>
                  </ul>
                  <p>
                    You can also contact the {privacyContact.icoLabel} on{" "}
                    <TextLink href={phoneTelHref(privacyContact.icoPhone)}>
                      {privacyContact.icoPhone}
                    </TextLink>{" "}
                    or via{" "}
                    <TextLink href={privacyContact.icoUrl}>ico.org.uk</TextLink>.
                  </p>
                </div>
              </section>
            </div>
          </article>
        </Container>
      </Section>
    </div>
  );
}
