export const contactIntro = {
  eyebrow: "CONTACT",
} as const;

export const contactInfo = {
  heading: "Contact Information",
  address: {
    title: "Address",
    lines: [
      "Federation of Independent Practitioner Organisations (FIPO)",
      "The Harley Building",
      "77-79 New Cavendish Street",
      "London",
      "W1W 6XB",
    ],
  },
  email: {
    title: "Email us",
    blocks: [
      {
        description: "For enquiries to Harcus Parker, contact:",
        address: "fipo@harcusparker.co.uk",
      },
      {
        description: "For administrative enquiries to FIPO, contact:",
        address: "office@fipo.uk",
      },
    ],
  },
  telephone: {
    title: "Telephone",
    number: "020 7205 4166",
    tel: "+442072054166",
  },
} as const;

export const contactForm = {
  heading: "Send us a message",
  fields: {
    name: {
      label: "Name",
      placeholder: "Enter your name",
    },
    email: {
      label: "Email",
      placeholder: "Enter your email",
    },
    subject: {
      label: "Subject",
      placeholder: "Reason for contacting us",
    },
    message: {
      label: "Message",
      placeholder: "Type your message",
    },
  },
  submitLabel: "Send Message",
  successMessage:
    "Thank you for your message. We will be in touch shortly.",
  errorMessage:
    "Something went wrong. Please email us directly at office@fipo.uk.",
} as const;
