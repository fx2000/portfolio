"use client";

import Image from "next/image";
import React from "react";
import { Link } from "react-scroll";
import MobileMenu from "@/components/MobileMenu";
import NavLink from "next/link";

// Interface for Header component props
export interface HeaderProps {
  topbarNone?: string;
  hclass?: string;
  logo?: string;
}

// Navigation items for the header
const NAVIGATION_ITEMS = [
  { to: "home", offset: -100, label: "Home" },
  { to: "about", offset: -95, label: "About" },
  { to: "portfolio", offset: -95, label: "Portfolio" },
  { to: "references", offset: -95, label: "References" },
  { to: "contact", offset: -95, label: "Contact" },
] as const;

/**
 * Header component that displays the main navigation bar
 * @component
 * @param topbarNone - Optional class name for the header's topbar styling
 * @param hclass - Optional class name for additional header styling
 * @param logo - Path or URL to the logo image
 * @returns {JSX.Element} Rendered Header component
 */
const Header = ({ topbarNone, hclass, logo }: HeaderProps) => {
  /**
   * Handles click events on the logo, scrolling to the top of the page
   * @returns {void}
   */
  const handleClick = (): void => {
    window.scrollTo(10, 0);
  };

  return (
    <header id="header" className={topbarNone}>
      <div className={`tp-site-header ${hclass}`}>
        <nav
          className="navigation navbar navbar-expand-lg navbar-light"
          role="navigation"
          aria-label="Main navigation"
        >
          <div className="container-fluid">
            <div className="row align-items-center">
              <div className="col-lg-3 col-md-3 col-3 d-lg-none dl-block">
                <div className="mobail-menu">
                  <MobileMenu />
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-6">
                <div className="navbar-header">
                  <NavLink
                    onClick={handleClick}
                    className="navbar-brand"
                    href="/"
                  >
                    {logo && (
                      <Image
                        src={logo}
                        alt="Site Logo"
                        width={150}
                        height={50}
                        priority={true}
                      />
                    )}
                  </NavLink>
                </div>
              </div>
              <div className="col-lg-6 col-md-1 col-1">
                <div
                  id="navbar"
                  className="collapse navbar-collapse navigation-holder"
                  aria-label="Main menu"
                >
                  <button
                    className="menu-close"
                    aria-label="Close menu"
                    type="button"
                  >
                    <i className="ti-close" aria-hidden="true"></i>
                  </button>
                  <ul className="nav navbar-nav mb-2 mb-lg-0" role="menubar">
                    {NAVIGATION_ITEMS.map((item) => (
                      <li key={item.to} role="none">
                        <Link
                          activeClass="active"
                          to={item.to}
                          spy={true}
                          smooth={true}
                          duration={500}
                          offset={item.offset}
                          role="menuitem"
                          tabIndex={0}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
