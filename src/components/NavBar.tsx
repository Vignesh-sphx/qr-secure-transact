
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Wallet, QrCode, User, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

const NavBar: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur-md z-40 md:hidden">
      <div className="flex items-center justify-around h-16 px-2 max-w-lg mx-auto">
        <NavLink to="/" active={isActive('/')}>
          <Home className="h-5 w-5" />
          <span>Home</span>
        </NavLink>
        
        <NavLink to="/wallet" active={isActive('/wallet')}>
          <Wallet className="h-5 w-5" />
          <span>Wallet</span>
        </NavLink>
        
        <NavLink to="/transaction" active={isActive('/transaction')}>
          <QrCode className="h-5 w-5" />
          <span>Transact</span>
        </NavLink>
        
        <NavLink to="/authentication" active={isActive('/authentication')}>
          <User className="h-5 w-5" />
          <span>Account</span>
        </NavLink>
      </div>
    </div>
  );
};

interface NavLinkProps {
  to: string;
  active: boolean;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, active, children }) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex flex-col items-center justify-center w-full py-1 px-3 rounded-md transition-colors",
        active 
          ? "text-primary" 
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
      
      {/* Indicator dot */}
      <div className="h-1 w-1 rounded-full mt-1">
        <div className={cn(
          "h-full w-full rounded-full transform scale-0 transition-transform",
          active && "scale-100 bg-primary"
        )} />
      </div>
    </Link>
  );
};

export default NavBar;
