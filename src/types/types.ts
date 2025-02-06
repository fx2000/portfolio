// Interface for projects
export interface IProject {
  id: number;
  title: string;
  description: string;
  contributions: string;
  technologies: string[];
  about: string;
  company: string;
  client: string;
  role: string;
  pImg: string;
  psub1img1?: string;
  psub1img2?: string;
  pImgAlt?: string;
  psub1img1Alt?: string;
  psub1img2Alt?: string;
  url?: string;
  type: "agency" | "company";
  media?: {
    url: string;
    type: "audio/mpeg" | "audio/wav";
    title?: string;
  };
}

// Interface for testimonials
export interface ITestimonial {
  id: number;
  name: string;
  position: string;
  company: string;
  description: string;
}

// Interface for mobile menu items
export interface IMenuItem {
  id: number;
  title: string;
  link: string;
}

// Props for social media links
export interface ISocialLink {
  platform: string;
  url: string;
  ariaLabel: string;
}

// Statistics item props
export interface IStatItem {
  count: string;
  label: string;
}
