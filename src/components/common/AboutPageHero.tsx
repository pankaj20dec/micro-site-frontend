import { BandTitleBlock, Container, ProfileCard, Section } from "@/components/ui";
import { suzanneRabProfile } from "@/lib/about-profile";

/** About page hero — Figma node 103:2857 (ABOUT US title + profile card). */
export function AboutPageHero() {
  return (
    <Section className="bg-white py-8 sm:py-10">
      <Container>
        <BandTitleBlock ruleVariant="lavender">ABOUT US</BandTitleBlock>
        <ProfileCard
          className="mt-12 max-w-5xl sm:mt-14 lg:max-w-6xl"
          name={suzanneRabProfile.name}
          bio={suzanneRabProfile.bio}
          linkedInHref={suzanneRabProfile.linkedInHref}
          linkedInLabel={suzanneRabProfile.linkedInLabel}
          imageSrc={suzanneRabProfile.imageSrc}
          imageAlt={suzanneRabProfile.imageAlt}
        />
      </Container>
    </Section>
  );
}
