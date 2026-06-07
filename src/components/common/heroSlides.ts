export type HeroSlide = {
  title: string;
  subheading: string;
  paragraphs: readonly [string, string];
  image: { src: string; alt: string };
};

export const heroSlides: readonly HeroSlide[] = [
  {
    title: "Private Insurers Have Kept Your Fees Artificially Low",
    subheading: "It's Time to Fight Back.",
    paragraphs: [
      "Private insurers have shaped reimbursement in ways that undervalue your expertise and restrict fair pay. This action brings professionals together with a clear, evidence-led strategy.",
      "Join colleagues who are challenging unfair fee structures through collective representation — transparent milestones, specialist counsel, and a shared commitment to professional freedom.",
    ],
    image: {
      src: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=900&q=80&auto=format&fit=crop",
      alt: "Doctor in a white coat with stethoscope holding a tablet",
    },
  },
  {
    title: "A Coordinated Legal Response For Fair Compensation",
    subheading: "Strength In Numbers.",
    paragraphs: [
      "Competition law, restraint of trade, and economic torts may all be relevant to how your fees have been constrained. Members receive structured support to understand and participate with confidence.",
      "Registration is straightforward: join the group, complete documents, share evidence where appropriate, and our team coordinates the next legal steps with your advisers.",
    ],
    image: {
      src: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=900&q=80&auto=format&fit=crop",
      alt: "Medical professional reviewing information on a tablet",
    }
  },
  // {
  //   title: "Evidence-Led, Professionally Led",
  //   subheading: "Clear Milestones. Real Representation.",
  //   paragraphs: [
  //     "We focus on documented fee pressure, contractual constraints, and insurer practices that may have harmed your practice — aligned with specialist competition and tort counsel.",
  //     "Whether you work in private practice only or across NHS and private settings, you can follow progress through updates, webinars, and a dedicated portal for membership materials.",
  //   ],
  //   image: {
  //     src: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=900&q=80&auto=format&fit=crop",
  //     alt: "Doctor with stethoscope in clinical setting",
  //   },
  // },
];
