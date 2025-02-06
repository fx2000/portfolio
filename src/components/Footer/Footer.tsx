import React from "react";
import Link from "next/link";
import Image from "next/image";

const logo = "/images/logo.png";

/**
 * Footer component
 * @component
 * @returns Footer component
 */
const Footer = () => {
  return (
    <footer className="tp-site-footer text-center">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="footer-image">
              {logo && (
                <Link className="logo" href="/" aria-label="Home">
                  <Image
                    src={logo}
                    alt="Company Logo"
                    width={100}
                    height={100}
                  />
                </Link>
              )}
            </div>
          </div>
          <div className="col-12">
            <nav className="link-widget" aria-label="Social Media Links">
              <ul>
                <li>
                  <Link
                    href="https://www.linkedin.com/in/duquedev/"
                    aria-label="Visit my LinkedIn Profile"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="ti-linkedin" aria-hidden="true"></i>
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://www.github.com/fx2000"
                    aria-label="Visit my GitHub Profile"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="ti-github" aria-hidden="true"></i>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className="col-12">
            <div className="copyright">
              <small>
                &copy; {new Date().getFullYear()} All rights reserved by Daniel
                Duque
              </small>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
