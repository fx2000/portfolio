"use client";

import React from "react";
import Header from "@/components/Header";
import { useLayoutEffect, useState } from "react";

// Interface for Navbar component props
export interface NavbarProps {
  hclass?: string;
  topbarNone?: string;
}

const logo = "/images/logo.png";

/**
 * Navbar component that provides a fixed navigation bar with scroll behavior
 * @component
 * @param hclass - Optional class name for header styling
 * @param topbarNone - Optional class name for topbar styling
 * @returns {JSX.Element} Rendered Navbar component
 */
const Navbar: React.FC<NavbarProps> = ({ hclass, topbarNone }) => {
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useLayoutEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };

    // Set initial scroll position
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Don't render anything until after hydration
  if (!mounted) {
    return null;
  }

  const className = isScrolled ? "fixed-navbar active" : "fixed-navbar";

  return (
    <div className={className} style={{ zIndex: 1000 }}>
      <Header hclass={hclass} topbarNone={topbarNone} logo={logo} />
    </div>
  );
};

export default Navbar;
