import React from "react";
import NavLink from "next/link";
import Image from "next/image";
import { Link } from "react-scroll";
import { ISocialLink } from "@/types/types";

const himg = "/images/headshot.png";

/**
 * Social media links configuration
 */
const socialLinks: ISocialLink[] = [
  {
    platform: "LinkedIn",
    url: "https://www.linkedin.com/in/duquedev/",
    ariaLabel: "Visit my LinkedIn profile",
  },
  {
    platform: "GitHub",
    url: "https://www.github.com/fx2000",
    ariaLabel: "Visit my GitHub profile",
  },
];

/**
 * Hero section component for the landing page
 * @component
 * @returns The rendered Hero section
 */
const Hero = () => {
  return (
    <section className="tp-hero-section-1" aria-label="Introduction">
      <div className="container">
        <div className="row">
          <div className="col col-xs-7 col-lg-7">
            <div className="tp-hero-section-text">
              <div className="tp-hero-title">
                <h1>Full Stack Developer</h1>
              </div>
              <div className="tp-hero-sub">
                <p>Daniel Duque</p>
              </div>
              <div className="btns">
                <Link
                  activeClass="active"
                  to="contact"
                  spy={true}
                  smooth={true}
                  duration={500}
                  offset={-95}
                  className="theme-btn"
                  role="button"
                  aria-label="Get in touch with Daniel Duque"
                  tabIndex={0}
                >
                  Get in touch
                </Link>
                <a
                  href="/files/DanielDuqueCV.pdf"
                  className="theme-btn"
                  download="DanielDuqueCV.pdf"
                  aria-label="Download Daniel Duque's resume"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download my resume
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="right-vec" aria-hidden="true">
        <div className="right-img">
          {/* <Image
            src={himg}
            alt="Professional headshot of Daniel Duque"
            width={687}
            height={959}
            priority
            style={{
              minHeight: "959px",
              minWidth: "790px",
            }}
          /> */}
        </div>
      </div>

      <nav className="social-link" aria-label="Social media links">
        <ul>
          {socialLinks.map(({ platform, url, ariaLabel }) => (
            <li key={platform}>
              <NavLink
                href={url}
                aria-label={ariaLabel}
                target="_blank"
                rel="noopener noreferrer"
              >
                {platform}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="visible-text" aria-hidden="true">
        <h2>Developer</h2>
      </div>
    </section>
  );
};

export default Hero;
