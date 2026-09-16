export type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type FooterLinkGroup = Record<string, FooterLink[]>;

export const footerLinkGroups: FooterLinkGroup = {
  Platform: [
    { label: 'Browse Consultants', href: '#consultants' },
    { label: 'Services', href: '#services' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#' },
  ],
  Company: [
    { label: 'About Us', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Press', href: '#' },
  ],
  Support: [
    { label: 'Help Center', href: '#' },
    { label: 'Contact Us (WhatsApp)', href: 'https://wa.me/254718232483', external: true },
    { label: 'Email Us', href: 'mailto:kim425716@gmail.com', external: true },
    { label: 'Status', href: '#' },
    { label: 'Community', href: '#' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy', href: '#' },
    { label: 'Security', href: '#' },
  ],
};

export const footerBrand = {
  name: 'Logic Tech',
  accent: 'Tech',
  tagline:
    'The trusted marketplace connecting businesses with expert IT consultants across Africa and beyond.',
};

export const footerSocial = {
  email: 'mailto:kim425716@gmail.com',
  whatsapp: 'https://wa.me/254718232483',
};
