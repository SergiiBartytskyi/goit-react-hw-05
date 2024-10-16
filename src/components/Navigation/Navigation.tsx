import { useRef } from "react";
import { NavLink } from "react-router-dom";
import { BiArrowToTop } from "react-icons/bi";
import clsx from "clsx";
import { IIsActiveProps } from "../../types";
import css from "./Navigation.module.css";

const buildLinkClass = ({ isActive }: IIsActiveProps) => {
  return clsx(css.link, isActive && css.active);
};

const Navigation = () => {
  const navigationRef = useRef<HTMLElement | null>(null);

  const scrollToTop = () => {
    if (navigationRef.current) {
      navigationRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <header className={css.header}>
      <nav className={css.nav} ref={navigationRef}>
        <NavLink to="/" className={buildLinkClass}>
          Home
        </NavLink>
        <NavLink to="/movies" className={buildLinkClass}>
          Movies
        </NavLink>
      </nav>
      <button
        onClick={scrollToTop}
        className={css.scrollBtn}
        aria-label="Scroll to top"
      >
        <BiArrowToTop className={css.reactIcon} />
      </button>
    </header>
  );
};
export default Navigation;
