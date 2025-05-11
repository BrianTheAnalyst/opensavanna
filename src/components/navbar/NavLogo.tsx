
import React from 'react';
import { Link } from 'react-router-dom';

const NavLogo = () => {
  return (
    <Link 
      to="/" 
      className="flex items-center space-x-2 mr-4" 
      aria-label="OpenSavanna Home"
    >
      <div 
        className="bg-gradient-to-r from-primary to-primary/80 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold" 
        aria-hidden="true"
      >OS</div>
      <span className="font-medium text-lg hidden md:block">OpenSavanna</span>
    </Link>
  );
};

export default NavLogo;
