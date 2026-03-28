import { Project } from "@/types";

export const featuredProjectIds = [0, 7, 4, 2, 1, 14];

export const projects: Project[] = [
  {
    id: 13,
    title: "BacktraceDesign",
    description:
      "A Chrome extension that reverse-engineers websites to automatically generate comprehensive, exportable style books containing colors, typography, design tokens, and component styles.",
    contributions:
      "Designed and built the entire extension from scratch, including color palette extraction with semantic role detection, CSS variable and token resolution, typography analysis, button and link style extraction with live-rendered previews, and multiple export formats including PDF, JSON Design Tokens, CSS Variables, and Tailwind Config.",
    technologies: [
      "TypeScript",
      "React",
      "Tailwind CSS",
      "Chrome Extensions API",
    ],
    company: "Browser Extension",
    about:
      "BacktraceDesign extracts the design language of any website. It analyzes CSS to identify brand colors, resolve custom properties and @layer rules, capture typography details, extract button and link variants, and detect recurring spacing and shadow tokens — all exportable in multiple formats.",
    client: "BacktraceDesign",
    role: "Creator & Developer",
    pImg: "/images/projects/backtrace/homepage.png",
    pImgAlt: "BacktraceDesign - Extract the design language of any website",
    url: "https://backtracedesign.duque.ai",
    type: "company",
  },
  {
    id: 0,
    title: "Topsort",
    description:
      "Topsort's mission is to democratize world-class auction and AI-based monetization technology that giants in Silicon Valley have been using as a profit engine into the wider ecosystem of e-commerce.",
    contributions:
      "Led a team of 5 senior engineers, owning architectural direction and technical execution for the Retailer Experience Platform. Introduced AI-assisted engineering workflows that improved developer throughput by 25%. Led projects including a Campaign Performance Forecasting tool, an AI assistant chatbot, the migration from Pages to App router, a deployment pipeline refactor from Vercel to AWS, and numerous improvements to Internationalization and Localization.",
    technologies: [
      "Typescript",
      "React",
      "NextJS",
      "OpenAPI",
      "oRPC",
      "React-Query",
      "AWS",
      "Github Actions",
    ],
    company: "Topsort",
    about:
      "I joined Topsort as Tech Lead for the Retailer Experience Team, owning the architecture and product delivery of the Auction Manager, Topsort's client-facing platform. I defined service boundaries, platform APIs, and CI/CD workflows while introducing AI-powered tooling to accelerate team velocity.",
    client: "Topsort",
    role: "Tech Lead - Retailer Experience Team",
    pImg: "/images/projects/topsort/homepage.png",
    pImgAlt: "Topsort Auction Manager",
    psub1img1: "/images/projects/topsort/psub1img1.png",
    psub1img1Alt: "Dashboard",
    psub1img2: "/images/projects/topsort/psub1img2.png",
    psub1img2Alt: "",
    url: "https://www.topsort.com",
    type: "company",
  },
  {
    id: 1,
    title: "Convene",
    description:
      "Convene is a global hospitality company that manages a growing portfolio of lifestyle brands focused on revolutionizing the way people meet, work, and gather.",
    contributions:
      "I joined the Convene project as a Senior Engineer in charge of migrating the current site from Wordpress to PayloadCMS. I was responsible for building a large part of the new site's reusable component library. I also built numerous components like carousels, accordions, responsive image containers, and video players, plus handled integration with Google Places and Hotelmap APIs.",
    technologies: [
      "Typescript",
      "React",
      "NextJS",
      "HTML",
      "CSS",
      "PayloadCMS",
      "Google Places API",
    ],
    company: "Engineer Access",
    about:
      "Engineer Access was contracted by Convene to modernize their legacy site from Wordpress to PayloadCMS. The new website was built using React, NextJS, and PayloadCMS.",
    client: "Convene",
    role: "Senior Engineer - Experience Technology",
    pImg: "/images/projects/convene/homepage.png",
    pImgAlt: "Convene Homepage",
    psub1img1: "/images/projects/convene/psub1img1.png",
    psub1img1Alt: "PayloadCMS",
    psub1img2: "/images/projects/convene/psub1img2.png",
    psub1img2Alt: "Layout Creation",
    url: "https://www.convene.com",
    type: "agency",
  },
  {
    id: 2,
    title: "Aramark",
    description:
      "Aramark is an American food service and facilities services provider. Revenues totaled US $18.854 billion in 2023, ranked 21st largest employer on the Fortune 500.",
    contributions:
      "I was responsible for building a large part of the site's reusable component library. I built the main mega menu, animated Hero component, carousels, accordions, and video players. I also created a form building engine using react-hook-form and integrated all forms with Aramark's Salesforce CRM.",
    technologies: [
      "Javascript",
      "React",
      "React Hook Form",
      "Adobe Experience Manager",
      "Storybook",
      "Salesforce CRM",
    ],
    company: "Hero Digital",
    about:
      "Hero Digital was contracted by Aramark to build a new website. The new website was built using React, running on Adobe Experience Manager CMS.",
    client: "Aramark",
    role: "Senior Engineer - Experience Technology",
    pImg: "/images/projects/aramark/homepage.png",
    pImgAlt: "Aramark Homepage",
    psub1img1: "/images/projects/aramark/psub1img1.png",
    psub1img1Alt: "Form Building Engine",
    psub1img2: "/images/projects/aramark/psub1img2.png",
    psub1img2Alt: "Carousel Component",
    url: "https://www.aramark.com",
    type: "agency",
  },
  {
    id: 3,
    title: "Masonite",
    description:
      "Masonite International Corporation is a designer, manufacturer and distributor of interior and exterior doors for the new construction and repair sectors.",
    contributions:
      "I built a complex Door visualization tool with advanced filtering using XState, and a Where to Buy tool using the Google Maps API with advanced filtering and search capabilities.",
    technologies: [
      "Javascript",
      "HTML",
      "CSS",
      "XState",
      "Google Maps API",
      "Optimizely",
      "Storybook",
    ],
    company: "Hero Digital",
    about:
      "Hero Digital was contracted by Masonite for a complete redesign of their corporate website, built using vanilla javascript and html templates on Optimizely CMS.",
    client: "Masonite",
    role: "Senior Engineer - Experience Technology",
    pImg: "/images/projects/masonite/homepage.png",
    pImgAlt: "Masonite Homepage",
    psub1img1: "/images/projects/masonite/psub1img1.png",
    psub1img1Alt: "Door Visualization Tool",
    psub1img2: "/images/projects/masonite/psub1img2.png",
    psub1img2Alt: "Where to Buy Tool",
    url: "https://www.masonite.com",
    type: "agency",
  },
  {
    id: 4,
    title: "LPGA",
    description:
      "The Ladies Professional Golf Association is an American organization for female golfers, best known for running the LPGA Tour for elite women professional golfers worldwide.",
    contributions:
      "Led the engineering team and defined the cross-platform architecture using Solito and Tamagui for full component reuse across web and mobile. Designed a custom CMS integration and supervised frontend delivery, aligning technical decisions with product requirements.",
    technologies: [
      "Typescript",
      "React Native",
      "NextJS",
      "Tamagui",
      "Solito",
      "Storybook",
      "Team Management",
    ],
    company: "Hero Digital",
    about:
      "Hero Digital was contracted by the LPGA to build a new website and mobile application. I led the engineering team and owned the cross-platform architecture using React Native and NextJS with Tamagui for full component reuse across platforms.",
    client: "LPGA",
    role: "Engineering Manager & Product Lead",
    pImg: "/images/projects/lpga/homepage.png",
    pImgAlt: "LPGA Homepage",
    url: "https://www.lpga.com",
    type: "agency",
  },
  {
    id: 5,
    title: "Atlantic Health Systems",
    description:
      "Atlantic Health System is one of the largest non-profit health care networks in New Jersey, employing 18,000 people and more than 4,800 affiliated physicians.",
    contributions:
      "I built a large part of the site's reusable component library and created complex Find a Doctor and Find a Location tools using Google Maps API and the Coveo search engine.",
    technologies: [
      "Typescript",
      "React",
      "Adobe Experience Manager",
      "Storybook",
      "Coveo",
      "Google Maps API",
      "SWR",
    ],
    company: "Hero Digital",
    about:
      "Hero Digital was contracted by Atlantic Health Systems for a complete redesign of their corporate website, built using React on Adobe Experience Manager CMS.",
    client: "Atlantic Health System",
    role: "Senior Engineer - Experience Technology",
    pImg: "/images/projects/ahs/homepage.png",
    pImgAlt: "AHS Homepage",
    psub1img1: "/images/projects/ahs/psub1img1.png",
    psub1img1Alt: "Find a Doctor",
    psub1img2: "/images/projects/ahs/psub1img2.png",
    psub1img2Alt: "Find a Location",
    url: "https://www.atlantichealth.org",
    type: "agency",
  },
  {
    id: 6,
    title: "niikiis",
    description:
      "niikiis is the all-in-one HR software that streamlines time tracking and time off management, empowering workforce with self-service time management.",
    contributions:
      "Built core platform features including social feeds, analytics tools, and real-time collaboration interfaces. Developed an AI-powered attendance tracking system using TensorFlow face detection and AWS Rekognition, reducing manual tracking overhead. Also built a micro learning animated video player using AWS Polly and Lottie.",
    technologies: [
      "Typescript",
      "React",
      "Redux",
      "React Context API",
      "NodeJS",
      "DynamoDB",
      "AWS",
      "Tensorflow",
      "Lottie",
      "AWS Polly",
      "React Native",
      "Expo",
      "Amazon Rekognition",
    ],
    company: "niikiis Knowtion",
    about:
      "I joined niikiis as a Senior Developer to build the company's HRIS platform, leading development of full-stack features and AI-powered tools. Built serverless backend endpoints with AWS Lambda and integrated TensorFlow-based face detection for automated attendance tracking.",
    client: "niikiis Knowtion",
    role: "Senior Frontend Developer",
    pImg: "/images/projects/niikiis/homepage.png",
    pImgAlt: "niikiis Homepage",
    psub1img1: "/images/projects/niikiis/psub1img1.png",
    psub1img1Alt: "Attendance Tracking",
    psub1img2: "/images/projects/niikiis/psub1img2.png",
    psub1img2Alt: "Reporting Engine",
    url: "https://www.niikiis.com",
    type: "company",
  },
  {
    id: 7,
    title: "Magic",
    description:
      "A Y Combinator backed company, Magic is a leading modern outsourcing platform that connects SMBs to high-quality remote workers, supercharged with AI technology.",
    contributions:
      "Built RAG-driven conversational automation powering real-time AI phone interactions. Designed orchestration layers connecting LLM pipelines, retrieval services, and communication APIs using GPT, Twilio, and speech engines. The AI agent could place real phone calls to schedule appointments, following scripts while handling unexpected situations. Also built a vertical for ordering presents from online stores.",
    technologies: [
      "Python",
      "GPT",
      "Twilio API",
      "Text-to-Speech",
      "Speech-to-Text",
      "Autogen",
      "Prompt Engineering",
    ],
    company: "Magic Inc",
    about:
      "I joined Magic as Senior Engineer with the Labs team, building backend systems for RAG-driven conversational AI. Designed orchestration layers connecting LLM pipelines, retrieval services, and communication APIs to support scalable conversational workflows.",
    client: "Magic Inc",
    role: "Senior Engineer",
    pImg: "/images/projects/magic/homepage.png",
    pImgAlt: "Magic Inc Homepage",
    url: "https://www.getmagic.com",
    type: "company",
    media: {
      url: "/images/projects/magic/audio.mp3",
      type: "audio/mpeg",
      title: "AI Model Demo - Scheduling an Appointment",
    },
  },
  {
    id: 8,
    title: "Sprouts Farmers Market",
    description:
      "Sprouts Farmers Market is a supermarket chain offering natural and organic foods, operating 400+ stores in 23 states with 35,000 employees.",
    contributions:
      "Managed engineering delivery and product coordination, supervising a team of contractors while handling direct technical communication with the client. Responsible for building the new interface and resolving integration issues across third-party libraries.",
    technologies: [
      "PHP",
      "WordPress",
      "Team Management",
      "Client Communication",
    ],
    company: "Hero Digital",
    about:
      "Hero Digital was contracted by Sprouts Farmers Market to improve their customer-facing website. I led engineering delivery and managed the contractor team while serving as the technical point of contact for the client.",
    client: "Sprouts Farmers Market",
    role: "Engineering Manager & Product Lead",
    pImg: "/images/projects/sprouts/homepage.png",
    pImgAlt: "Sprouts Homepage",
    url: "https://www.sprouts.com",
    type: "agency",
  },
  {
    id: 9,
    title: "Novick Corporation",
    description:
      "Novick Corporation is a global leader in transportation, distribution, and delivery services for the foodservice industry, servicing 11 states across the northeast US.",
    contributions:
      "I built the frontend from the ground up using NextJS, React, and Material UI. The application uses SSO with Azure AD through custom MSAL middleware, zustand for state management, and supports drag-and-drop of meals and recipes.",
    technologies: [
      "Typescript",
      "React",
      "NextJS",
      "Zustand",
      "React Query",
      "Material UI",
      "SSO",
      "Azure AD",
      "MSAL",
    ],
    company: "Hero Digital",
    about:
      "Hero Digital was contracted by Novick Corporation to build a new menu planning tool for their b2b customers, handling user management, meal creation, scheduling and ordering.",
    client: "Novick Corporation",
    role: "Senior Engineer - Experience Technology",
    pImg: "/images/projects/novick/homepage.png",
    pImgAlt: "Novick Homepage",
    psub1img1: "/images/projects/novick/psub1img1.png",
    psub1img1Alt: "Menu Planning",
    psub1img2: "/images/projects/novick/psub1img2.png",
    psub1img2Alt: "Meal Details",
    url: "https://www.novickcorp.com",
    type: "agency",
  },
  {
    id: 10,
    title: "Cranium",
    description:
      "Born from KPMG Studio, Cranium is the leading AI governance software provider enabling organizations to drive security, compliance, and trust across AI systems.",
    contributions:
      "I migrated state management from Redux to Zustand, implemented react-query for API communications, updated React to the latest version, and improved the application's overall design and accessibility.",
    technologies: [
      "Typescript",
      "React",
      "Zustand",
      "React Query",
      "ANT Design",
    ],
    company: "Expand the Room",
    about:
      "Expand the Room was contracted by Cranium to improve their client facing AI Governance tool built using React.",
    client: "Cranium",
    role: "Senior Engineer",
    pImg: "/images/projects/cranium/homepage.png",
    pImgAlt: "Cranium Homepage",
    url: "https://www.cranium.ai",
    type: "agency",
  },
  {
    id: 11,
    title: "Prevu",
    description:
      "Prevu ranks as the No. 34 fastest growing company in real estate on the Inc. 5000 List, on a mission to make the real estate buying process seamless and affordable.",
    contributions:
      "I migrated state management from Redux to React's Context API, implemented react-query for API communications, and rebuilt numerous pages and components to match updated design patterns.",
    technologies: [
      "Typescript",
      "React",
      "NextJS",
      "Redux",
      "React Query",
      "Context API",
    ],
    company: "Rockstar Coders",
    about:
      "Rockstar Coders was contracted by Prevu to offer staff augmentation for their customer facing Real Estate application.",
    client: "Prevu Real Estate",
    role: "Senior Engineer",
    pImg: "/images/projects/prevu/homepage.png",
    pImgAlt: "Prevu Homepage",
    url: "https://www.prevu.com",
    type: "agency",
  },
  {
    id: 12,
    title: "Prosprice Generator",
    description:
      "The power to price on the spot. Use the barcode scanner to cost out the job and communicate estimates with customers instantly.",
    contributions:
      "I built this mobile application using React Native on Expo for iOS and Android, with barcode scanning via BigBox API integration and invoice generation capabilities.",
    technologies: [
      "Typescript",
      "React",
      "React Native",
      "React Query",
      "zustand",
      "Expo",
      "BigBox API",
    ],
    company: "Rockstar Coders",
    about:
      "Rockstar Coders was contracted by Prosprice to develop a new mobile application for their Construction Estimating tool.",
    client: "Prosprice",
    role: "Senior Engineer",
    pImg: "/images/projects/prosprice/homepage.png",
    pImgAlt: "Prosprice Homepage",
    url: "https://www.prosprice.com",
    type: "agency",
  },
  {
    id: 14,
    title: "AI Portfolio",
    description:
      "This portfolio site — an AI-powered interactive experience built with Next.js 16, featuring a conversational AI assistant that can control the website in real time, voice chat with natural TTS, live code sandboxes, a real-time collaborative whiteboard, smart navigation, and hidden easter eggs.",
    contributions:
      "Architected and built the entire AI interaction layer: a command system that lets the chatbot change colors, trigger visual effects (fireworks, confetti, snow, matrix rain, disco mode), navigate to sections, and highlight projects. Implemented voice chat with Web Speech API for STT and Google Cloud TTS for natural speech output. Built a live code sandbox with iframe-based execution. Created a real-time collaborative whiteboard using Supabase Realtime with shape tools (draw, rectangle, circle, arrow, line, text), live cursor tracking with user names, selection/move, undo, and PNG export. Created the WarGames easter egg that launches playable DOOM in the browser via js-dos. Designed a tailored pitch system that generates custom responses for recruiters and offers resume downloads. All powered by Google Gemini 2.5 Flash with a sophisticated prompt engineering layer.",
    technologies: [
      "TypeScript",
      "React",
      "Next.js",
      "Gemini API",
      "Google Cloud TTS",
      "Web Speech API",
      "Supabase Realtime",
      "GSAP",
      "Tailwind CSS",
      "js-dos",
      "Netlify",
    ],
    company: "Personal Project",
    about:
      "A portfolio site that doubles as an AI capabilities demo. The conversational AI assistant (powered by Gemini 2.5 Flash) doesn't just answer questions — it controls the website in real time through a custom command system. Visitors can ask it to change the site's colors, throw fireworks, navigate to projects, show live code demos, play DOOM, or generate tailored pitches. Voice chat enables hands-free interaction with natural text-to-speech. A real-time collaborative whiteboard lets visitors draw together with shape tools, live cursors, and presence tracking via Supabase Realtime. The entire site was built through an AI-assisted workflow using Claude Code, with Daniel directing architecture and design decisions.",
    client: "Daniel Duque",
    role: "Creator & Developer",
    pImg: "/images/projects/portfolio/homepage.png",
    pImgAlt: "AI Portfolio - Interactive AI-powered portfolio site",
    url: "https://github.com/fx2000/portfolio",
    type: "company",
  },
];

/** Returns the 6 featured projects in display order */
export const getFeaturedProjects = (): Project[] =>
  featuredProjectIds
    .map((id) => projects.find((p) => p.id === id))
    .filter((p): p is Project => p !== undefined);

/** Returns projects not in the featured list */
export const getOtherProjects = (): Project[] =>
  projects.filter((p) => !featuredProjectIds.includes(p.id));
