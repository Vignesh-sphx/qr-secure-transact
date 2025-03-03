
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { QrCode, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full px-6 py-4 backdrop-blur-md bg-background/80 border-b",
      className
    )}>
      <div className="flex items-center justify-between max-w-screen-lg mx-auto">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <QrCode className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">SecureTransact</span>
          </Link>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/wallet" className="text-sm font-medium hover:text-primary transition-colors">
            Wallet
          </Link>
          <Link to="/transaction" className="text-sm font-medium hover:text-primary transition-colors">
            Transact
          </Link>
          <Link to="/authentication">
            <Button variant="outline" size="sm" className="ml-2 animate-fade-in">
              My Account
            </Button>
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button 
          className="md:hidden flex items-center justify-center"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile navigation */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 top-[72px] bg-background/95 backdrop-blur-sm animate-fade-in z-40">
          <nav className="flex flex-col items-center justify-center h-full gap-8 p-6">
            <Link 
              to="/" 
              className="text-xl font-medium animate-slide-up" 
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link 
              to="/wallet" 
              className="text-xl font-medium animate-slide-up" 
              style={{ animationDelay: '0.1s' }}
              onClick={toggleMenu}
            >
              Wallet
            </Link>
            <Link 
              to="/transaction" 
              className="text-xl font-medium animate-slide-up" 
              style={{ animationDelay: '0.2s' }}
              onClick={toggleMenu}
            >
              Transact
            </Link>
            <Link 
              to="/authentication" 
              className="text-xl font-medium animate-slide-up" 
              style={{ animationDelay: '0.3s' }}
              onClick={toggleMenu}
            >
              My Account
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
