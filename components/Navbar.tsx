import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { NAV_LINKS } from '../constants';
import Button from './ui/Button';

interface NavbarProps {
  onSchedule: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSchedule }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);

    if (href === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);

    if (element) {
      // Calculate offset to ensure the fixed header doesn't cover the content
      const headerOffset = 100; // Adjusts based on navbar height + breathing room
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <a 
            href="#" 
            className="flex-shrink-0 flex items-center cursor-pointer" 
            onClick={(e) => handleNavClick(e, '#')}
          >
            <img 
              src="https://i.postimg.cc/Q9t8kqYr/Gemini-Generated-Image-dxal1ddxal1ddxal.png" 
              alt="Kinac Logo" 
              className="h-24 md:h-28 w-auto object-contain transition-all duration-300"
            />
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-gray-600 hover:text-primary-600 font-medium transition-colors text-sm uppercase tracking-wide"
              >
                {link.label}
              </a>
            ))}
            <Button size="sm" onClick={onSchedule}>Solicitar Turno</Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
             {/* CTA visible on mobile for high conversion */}
            <Button size="sm" className="text-xs px-3 py-2" onClick={onSchedule}>
                Turnos
            </Button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-primary-600 focus:outline-none p-2"
              aria-label="Menu"
            >
              {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-xl animate-in slide-in-from-top-5 duration-200">
          <div className="px-4 pt-4 pb-8 space-y-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block px-3 py-3 rounded-lg text-lg font-medium text-gray-700 hover:text-primary-700 hover:bg-gray-50 border-b border-gray-50 last:border-0"
                onClick={(e) => handleNavClick(e, link.href)}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4">
              <Button className="w-full text-lg py-4" onClick={() => { setIsOpen(false); onSchedule(); }}>
                Solicitar Evaluación
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;