"use client";

import { Element } from "react-scroll";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About/About";
import Projects from "@/components/Projects";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
/**
 * Home page
 * @component
 * @returns Home page
 */
export default function Home() {
  return (
    <>
      <Navbar />
      <Element name="home">
        <Hero />
      </Element>
      <Element name="about">
        <About />
      </Element>
      <Element name="portfolio">
        <Projects />
      </Element>
      <Element name="references">
        <Testimonials />
      </Element>
      <Element name="contact">
        <Contact />
      </Element>
      <Footer />
      <BackToTop />
    </>
  );
}
