import React, { useState } from "react";
import ListItem from "@mui/material/List";
import { Link } from "react-scroll";
import { IMenuItem } from "@/types/types";

// Mobile menu items
const menus: IMenuItem[] = [
  {
    id: 1,
    title: "Home",
    link: "home",
  },
  {
    id: 2,
    title: "About",
    link: "about",
  },
  {
    id: 3,
    title: "Portfolio",
    link: "portfolio",
  },
  {
    id: 4,
    title: "References",
    link: "references",
  },
  {
    id: 5,
    title: "Contact",
    link: "contact",
  },
];

/**
 * MobileMenu Component
 * @component
 * @returns The MobileMenu component
 */
const MobileMenu = () => {
  const [menuActive, setMenuState] = useState(false);

  /**
   * Handles scrolling to the top of the page when a menu item is clicked
   */
  const handleClick = () => {
    window.scrollTo(10, 0);
  };

  return (
    <div>
      <div
        className={`mobileMenu ${menuActive ? "show" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        <div className="menu-close">
          <button
            className="clox"
            onClick={() => setMenuState(!menuActive)}
            aria-label="Close mobile menu"
            type="button"
          >
            <i className="ti-close" aria-hidden="true"></i>
          </button>
        </div>

        <ul className="responsivemenu" role="menu">
          {menus.map((item) => (
            <ListItem key={item.id} role="none">
              <Link
                to={item.link}
                spy={true}
                smooth={true}
                duration={500}
                onClick={handleClick}
                role="menuitem"
                tabIndex={0}
              >
                {item.title}
              </Link>
            </ListItem>
          ))}
        </ul>
      </div>

      <button
        type="button"
        className="navbar-toggler open-btn showmenu"
        onClick={() => setMenuState(!menuActive)}
        aria-expanded={menuActive}
        aria-controls="mobile-menu"
        aria-label="Toggle mobile menu"
      >
        <span className="icon-bar first-angle" aria-hidden="true"></span>
        <span className="icon-bar middle-angle" aria-hidden="true"></span>
        <span className="icon-bar last-angle" aria-hidden="true"></span>
      </button>
    </div>
  );
};

export default MobileMenu;
