import React, { useEffect, useState } from "react";

/**
 * BackToTop component
 * @component
 * @returns - Back to top button
 */
const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled up to given distance
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div
      className="col-lg-12"
      style={{ display: isVisible ? "block" : "none" }}
      onClick={scrollToTop}
      role="button"
      tabIndex={0}
      aria-label="Scroll to top of page"
    >
      <div className="header-menu">
        <ul className="smothscroll">
          <li>
            <div>
              <i className="ti-arrow-up"></i>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BackToTop;
