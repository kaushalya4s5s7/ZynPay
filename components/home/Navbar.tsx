import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const service = { path: "/pages/auth?mode=payroll" };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        .navbar {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.1);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          border-radius: 0px;
        }
        
        .navbar::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: url('https://framerusercontent.com/images/VSKXXbby1d8KiLHkPqnzNbqnFM.png?scale-down-to=2048');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          opacity: 0.4;
          z-index: -1;
          pointer-events: none;
        }
        
        .navbar.scrolled {
          background: rgba(255, 255, 255, 0.25);
          box-shadow: 0 4px 25px 0 rgba(0, 0, 0, 0.15);
        }
        
        .navbar.scrolled::before {
          opacity: 0.3;
        }
        
        .logo-text {
          font-weight: 700;
          font-size: 24px;
          color: #0D1B2A;
          letter-spacing: -0.02em;
          position: relative;
          z-index: 2;
        }
        
        .nav-link {
          font-weight: 500;
          font-size: 15px;
          color: #374151;
          text-decoration: none;
          padding: 8px 16px;
          border-radius: 8px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 4px;
          position: relative;
          z-index: 2;
        }
        
        .nav-link:hover {
          color: #0D1B2A;
          background: rgba(13, 27, 42, 0.05);
        }
        
        .dropdown-chevron {
          width: 16px;
          height: 16px;
          transition: transform 0.2s ease;
        }
        
        .nav-link:hover .dropdown-chevron {
          transform: rotate(180deg);
        }
        
        .cta-button {
          background: #0D1B2A;
          border: none;
          border-radius: 50px;
          padding: 0;
          height: 44px;
          display: flex;
          align-items: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 8px rgba(13, 27, 42, 0.2);
          overflow: hidden;
          position: relative;
          z-index: 2;
        }
        
        .cta-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(13, 27, 42, 0.3);
        }
        
        .cta-button:active {
          transform: translateY(0);
        }
        
        .cta-text {
          color: white;
          font-weight: 600;
          font-size: 15px;
          padding: 0 20px 0 24px;
          white-space: nowrap;
        }
        
        .cta-icon-container {
          background: #2A3B4A;
          width: 36px;
          height: 36px;
          margin: 4px 4px 4px 0;
          border-radius: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        
        .cta-button:hover .cta-icon-container {
          background: #3A4B5A;
          transform: scale(1.1);
        }
        
        .cta-arrow {
          color: white;
          width: 16px;
          height: 16px;
        }
        
        .mobile-menu {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-top: 1px solid rgba(0, 0, 0, 0.1);
        }
        
        .mobile-nav-link {
          font-weight: 500;
          color: #374151;
          padding: 12px 16px;
          border-radius: 8px;
          transition: all 0.2s ease;
          text-decoration: none;
          display: block;
        }
        
        .mobile-nav-link:hover {
          color: #0D1B2A;
          background: rgba(13, 27, 42, 0.05);
        }
        
        .mobile-cta {
          background: #0D1B2A;
          color: white;
          padding: 12px 24px;
          border-radius: 50px;
          border: none;
          font-weight: 600;
          width: 100%;
          transition: all 0.2s ease;
        }
        
        .mobile-cta:hover {
          background: #1A2938;
        }
      `}</style>
      
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4">
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`} style={{ width: 'calc(100% - 2rem)', maxWidth: '1200px', borderRadius: '0px' }}>
          <div className="px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex items-center space-x-3" style={{ position: 'relative', zIndex: 2 }}>
                <Image 
                  src="/ZynPay_without_bg.png" 
                  alt="ZynPay Logo" 
                  width={32} 
                  height={32}
                  className="w-8 h-8"
                />
                <div className="logo-text">ZynPay</div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              <a href="#product" className="nav-link">
                Product
                <ChevronDown className="dropdown-chevron" />
              </a>
              <a href="#solutions" className="nav-link">
                Solutions
                <ChevronDown className="dropdown-chevron" />
              </a>
              <a href="#pricing" className="nav-link">
                Pricing
              </a>
              <a href="#company" className="nav-link">
                Company
              </a>
            </div>

            {/* CTA Button */}
            <div className="hidden md:flex items-center">
              <button 
                className="cta-button"
                onClick={() => router.push(service.path)}
              >
                <span className="cta-text">Book a Demo</span>
                <div className="cta-icon-container">
                  <ArrowRight className="cta-arrow" />
                </div>
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
          </div>
          
          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden mobile-menu">
              <div className="px-4 pt-2 pb-4 space-y-2">
                <a href="#product" className="mobile-nav-link">Product</a>
                <a href="#solutions" className="mobile-nav-link">Solutions</a>
                <a href="#pricing" className="mobile-nav-link">Pricing</a>
                <a href="#company" className="mobile-nav-link">Company</a>
                <div className="pt-4">
                  <button 
                    className="mobile-cta"
                    onClick={() => router.push(service.path)}
                  >
                    Book a Demo
                  </button>
                </div>
              </div>
            </div>
          )}
        </nav>
      </div>
    </>
  );
}