export type HeroSlide = {
  title: string;
  subheading: string;
  paragraphs: readonly [string, string];
  image: { src: string; alt: string };
};

export const heroSlides: readonly HeroSlide[] = [
  {
    title: "Private Insurers have kept your fees artificially low",
    subheading: "It's time to fight back.",
    paragraphs: [
      "FIPO is launching a collective legal action against Bupa and AXA PPP. Join thousands of colleagues to recover the income you should have received.",
      "Today's practitioners face Hobson's choice - accept fees that have stood still for over thirty years - and that is not even reflecting an inflationary uplift.  Or lose access to over 70% of private patients.",
    ],
    image: {
      src: "/images/banner-image1.jpg",
      alt: "Doctor in a white coat with stethoscope holding a tablet",
    },
  },
  // {
  //   title: "A Coordinated Legal Response For Fair Compensation",
  //   subheading: "Strength In Numbers.",
  //   paragraphs: [
  //     "Competition law, restraint of trade, and economic torts may all be relevant to how your fees have been constrained. Members receive structured support to understand and participate with confidence.",
  //     "Registration is straightforward: join the group, complete documents, share evidence where appropriate, and our team coordinates the next legal steps with your advisers.",
  //   ],
  //   image: {
  //     src: "/images/banner-image2.jpg",
  //     alt: "Medical professional reviewing information on a tablet",
  //   }
  // },
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
