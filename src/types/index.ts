export interface Project {
  id: number;
  title: string;
  description: string;
  contributions: string;
  technologies: string[];
  company: string;
  about: string;
  client: string;
  role: string;
  pImg: string;
  pImgAlt: string;
  psub1img1?: string;
  psub1img1Alt?: string;
  psub1img2?: string;
  psub1img2Alt?: string;
  url: string;
  type: "company" | "agency";
  media?: {
    url: string;
    type: string;
    title: string;
  };
}

export interface Testimonial {
  id: number;
  name: string;
  position: string;
  company: string;
  description: string;
  linkedin?: string;
  image?: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  ariaLabel: string;
  icon: "linkedin" | "github";
}
