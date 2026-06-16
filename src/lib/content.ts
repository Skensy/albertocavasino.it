export interface SiteContent {
  site: { name: string; role: string };
  nav: Array<{ label: string; href: string }>;
  hero: {
    bgImage: string;
    bgAlt: string;
    badge: string;
    headingLine1: string;
    headingAccent: string;
    subtitle: string;
    ctaText: string;
    ctaHref: string;
  };
  about: {
    photoUrl: string;
    photoAlt: string;
    title: string;
    paragraphs: string[];
    skills: Array<{ label: string; icon: string }>;
    stats: Array<{ number: string; label: string }>;
  };
  services: {
    title: string;
    subtitle: string;
    items: Array<{
      title: string;
      description: string;
      iconName: string;
    }>;
  };
  portfolio: {
    title: string;
    subtitle: string;
    projects: Array<{
      title: string;
      category: string;
      src: string;
    }>;
  };
  contact: {
    title: string;
    subtitle: string;
    email: string;
    phone: string;
    location: string;
    formLabels: {
      name: string;
      namePlaceholder: string;
      email: string;
      emailPlaceholder: string;
      message: string;
      messagePlaceholder: string;
      submit: string;
    };
    sidebarTitle: string;
    socialTitle: string;
    socials: Array<{
      label: string;
      url: string;
      iconName: string;
    }>;
  };
  footer: {
    linkSectionTitle: string;
    socialSectionTitle: string;
    footerLinks: string[];
    copyright: string;
  };
  colors: {
    primary: string;
    primaryHover: string;
    bgLight: string;
    bgDark: string;
    textPrimary: string;
    textSecondary: string;
    navBg: string;
    serviceNumberColor: string;
    serviceNumberOpacity: number;
  };
  typography: {
    sansFont: string;
    serifFont: string;
  };
  spacing: {
    sectionPaddingY: { mobile: number; desktop: number };
    sectionHeaderMb: number;
    sectionContentGap: { mobile: number; desktop: number };
    footerPaddingTop: number;
    footerPaddingBottom: number;
  };
  seo: {
    title: string;
    description: string;
  };
}

import raw from "@/data/site-content.json";

const content = raw as SiteContent;

export default content;
