import dynamic from "next/dynamic";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import FeaturedProjects from "@/components/FeaturedProjects";
import MoreWork from "@/components/MoreWork";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const ChatWidget = dynamic(() => import("@/components/ChatWidget"));
const EffectsOverlay = dynamic(() => import("@/components/EffectsOverlay"));
const WhiteboardButton = dynamic(() => import("@/components/WhiteboardButton"));

export default function Home() {
  return (
    <>
      <a
        href="#main-content"
        className="absolute -left-[9999px] top-0 z-[10002] px-6 py-3 bg-accent text-white text-sm font-medium rounded-br-lg no-underline focus:left-0"
      >
        Skip to main content
      </a>
      <Navigation />
      <main id="main-content">
        <Hero />
        <About />
        <FeaturedProjects />
        <MoreWork />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <ChatWidget />
      <EffectsOverlay />
      <WhiteboardButton />
    </>
  );
}
