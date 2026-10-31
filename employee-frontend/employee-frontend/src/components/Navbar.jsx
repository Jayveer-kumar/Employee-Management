import { useEffect, useState } from "react";

export default function Navbar({ total }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar__inner">
        <a href="/" className="brand">
          <span className="brand__mark">E</span>
          <span className="brand__name">EmployeeHub</span>
        </a>
        <span className="navbar__count">{total} employees</span>
      </div>
    </header>
  );
}
