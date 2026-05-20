import React, { useState, useEffect } from "react";
import { Phone } from "lucide-react";
import HangingLogo3D from "./HangingLogo3D";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 px-4 py-3 md:px-8">
      <nav
        id="navbar"
        className={`max-w-7xl mx-auto rounded-2xl transition-all duration-300 border overflow-visible ${
          isScrolled
            ? "bg-white/80 backdrop-blur-md shadow-lg border-brand-green/20 py-2.5 px-4 md:px-6"
            : "bg-transparent border-transparent py-4 px-2"
        }`}
      >
        <div className="flex items-center justify-between overflow-visible">
          {/* Logo Brand */}
          <a
            href="#home"
            onClick={handleScrollToTop}
            className="relative flex items-center h-16 overflow-visible cursor-pointer select-none md:scale-105"
            aria-label="The Unschooled Mind Home"
          >
            <HangingLogo3D scale={0.7} className="-mt-[14px] origin-top-left" />
          </a>

          {/* CTA & Call Button */}
          <div className="flex items-center gap-3">
            <a
              href="tel:+918262503442"
              className="px-4 py-2 rounded-xl text-xs font-rounded font-bold flex items-center gap-2 border border-brand-green bg-white/90 hover:bg-brand-green hover:text-brand-sand transition-all shadow-[2px_2px_0px_0px_var(--color-brand-green)] active:translate-y-0.5 active:shadow-none"
            >
              <Phone className="w-3.5 h-3.5 text-brand-clay" />
              <span>Call Us</span>
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
