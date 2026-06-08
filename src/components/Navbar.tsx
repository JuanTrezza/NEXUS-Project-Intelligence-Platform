import React, { useState, useEffect } from "react";
import { Bolt } from "lucide-react";

interface NavbarProps {
  currentView: "landing" | "workspace";
  setView: (view: "landing" | "workspace") => void;
  scrollToSection: (id: string) => void;
}

export default function Navbar({ currentView, setView, scrollToSection }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (currentView !== "landing") {
      setView("landing");
      // Wait a tiny bit for render
      setTimeout(() => {
        scrollToSection(sectionId);
      }, 100);
    } else {
      scrollToSection(sectionId);
    }
  };

  return (
    <nav
      id="top-nav"
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
        scrolled
          ? "bg-stone-950/80 backdrop-blur-xl border-white/10 py-3 shadow-2xl"
          : "bg-transparent border-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <div 
          className="flex items-center gap-3 cursor-pointer select-none group"
          onClick={() => { setView("landing"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
        >
          <div className="w-10 h-10 bg-indigo-600/20 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white rounded-xl flex items-center justify-center border border-indigo-500/30 transition-all duration-300 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
            <Bolt className="w-5 h-5 fill-current" />
          </div>
          <span className="font-sans font-extrabold text-2xl tracking-tighter text-white bg-clip-text">
            NEXUS
          </span>
        </div>

        {/* Links (for Landing) */}
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => handleNavClick("producto")}
            className="text-stone-400 hover:text-white text-sm font-medium transition-colors cursor-pointer"
          >
            Producto
          </button>
          <button
            onClick={() => handleNavClick("features")}
            className="text-stone-400 hover:text-white text-sm font-medium transition-colors cursor-pointer"
          >
            Características
          </button>
          <button
            onClick={() => handleNavClick("precios")}
            className="text-stone-400 hover:text-white text-sm font-medium transition-colors cursor-pointer"
          >
            Precios
          </button>
          <button
            onClick={() => handleNavClick("clientes")}
            className="text-stone-400 hover:text-white text-sm font-medium transition-colors cursor-pointer"
          >
            Clientes
          </button>
          <button
            onClick={() => handleNavClick("faq")}
            className="text-stone-400 hover:text-white text-sm font-medium transition-colors cursor-pointer"
          >
            Preguntas
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          {currentView === "landing" ? (
            <>
              <button
                onClick={() => setView("workspace")}
                className="hidden sm:inline-flex items-center text-stone-300 hover:text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                Demo del Workspace
              </button>
              <button
                onClick={() => setView("workspace")}
                className="bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-sm px-5 py-2.5 rounded-xl hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer shadow-[0_4px_20px_rgba(99,102,241,0.3)] shadow-indigo-500/20 border border-indigo-400/20"
              >
                Probar Gratis
              </button>
            </>
          ) : (
            <button
              onClick={() => setView("landing")}
              className="bg-stone-800 hover:bg-stone-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl border border-white/10 active:scale-95 transition-all cursor-pointer"
            >
              Volver a la Landing
            </button>
          )}

          {/* Mobile Menu Icon */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-stone-300 hover:text-white p-2"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-stone-900 border-b border-stone-800 p-6 flex flex-col gap-4 animate-fade-in shadow-2xl">
          <button
            onClick={() => handleNavClick("producto")}
            className="text-left text-stone-300 hover:text-white text-base py-1"
          >
            Producto
          </button>
          <button
            onClick={() => handleNavClick("features")}
            className="text-left text-stone-300 hover:text-white text-base py-1"
          >
            Características
          </button>
          <button
            onClick={() => handleNavClick("precios")}
            className="text-left text-stone-300 hover:text-white text-base py-1"
          >
            Precios
          </button>
          <button
            onClick={() => handleNavClick("clientes")}
            className="text-left text-stone-300 hover:text-white text-base py-1"
          >
            Clientes
          </button>
          <button
            onClick={() => handleNavClick("faq")}
            className="text-left text-stone-300 hover:text-white text-base py-1"
          >
            Preguntas frecuentes
          </button>
          <div className="h-px bg-stone-800 my-2"></div>
          <button
            onClick={() => {
              setView("workspace");
              setMobileMenuOpen(false);
            }}
            className="bg-indigo-600 text-white font-bold text-center py-2.5 rounded-lg w-full"
          >
            Acceder al Workspace (Demo)
          </button>
        </div>
      )}
    </nav>
  );
}
