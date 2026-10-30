import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, Box, Calculator } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenCalculator: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ cartCount, onOpenCart, onOpenCalculator }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ['inicio', 'productos', 'caracteristicas', 'nosotros', 'novedades', 'testimonios', 'contacto'];
      const current = sections.find((section) => {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          return rect.top <= 140 && rect.bottom >= 140;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#productos', label: 'Catálogo', id: 'productos' },
    { href: '#caracteristicas', label: 'Calidad', id: 'caracteristicas' },
    { href: '#nosotros', label: 'Taller', id: 'nosotros' },
    { href: '#novedades', label: 'Novedades', id: 'novedades' },
    { href: '#testimonios', label: 'Opiniones', id: 'testimonios' },
    { href: '#contacto', label: 'Contacto', id: 'contacto' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#08090f]/90 backdrop-blur-md border-b border-[#262b42] shadow-[0_8px_30px_rgba(0,0,0,0.5)]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand */}
        <a href="#inicio" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4f8cff] to-[#9d5cff] p-0.5 shadow-[0_0_20px_rgba(79,140,255,0.4)] flex items-center justify-center transition-transform group-hover:scale-105">
            <div className="w-full h-full bg-[#08090f] rounded-[10px] flex items-center justify-center">
              <Box className="w-5 h-5 text-[#4f8cff] transition-transform group-hover:rotate-12" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-xl tracking-tight text-white flex items-center gap-1">
              Universo <span className="gradient-text">3D</span>
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#9aa0b8] font-mono">Taller Maker Pro</span>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-white relative py-1 ${
                activeSection === link.id ? 'text-white' : 'text-[#9aa0b8]'
              }`}
            >
              {link.label}
              {activeSection === link.id && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#4f8cff] to-[#17e6a3] rounded-full" />
              )}
            </a>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Cotizador Button */}
          <button
            onClick={onOpenCalculator}
            className="hidden sm:inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-full border border-[#262b42] bg-[#131623]/80 hover:bg-[#1a1e30] text-[#17e6a3] hover:border-[#17e6a3]/50 transition-all shadow-sm"
            title="Calcula el costo de tu pieza 3D personalizada"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Cotizador 3D</span>
          </button>

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            aria-label="Abrir carrito"
            className="relative flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#4f8cff] to-[#9d5cff] text-white text-sm font-semibold shadow-[0_4px_20px_rgba(79,140,255,0.35)] hover:shadow-[0_6px_25px_rgba(79,140,255,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Carrito</span>
            <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1 text-xs font-bold bg-[#17e6a3] text-[#04140f] rounded-full">
              {cartCount}
            </span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl border border-[#262b42] text-[#eef0f7] hover:bg-[#131623] transition-colors"
            aria-label="Alternar menú móvil"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0e1018]/95 backdrop-blur-xl border-b border-[#262b42] px-6 py-5 flex flex-col gap-3 animate-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium py-2 text-[#9aa0b8] hover:text-white border-b border-[#262b42]/40"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenCalculator();
            }}
            className="mt-2 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-[#17e6a3]/40 bg-[#17e6a3]/10 text-[#17e6a3] font-semibold text-sm"
          >
            <Calculator className="w-4 h-4" />
            <span>Cotizador 3D a medida</span>
          </button>
        </div>
      )}
    </header>
  );
};
