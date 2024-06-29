import React from 'react';
import { FaSearch } from 'react-icons/fa';
import Logo from '@/assets/icon/logo.svg';
import { Input } from '@/components/ui/input';

const Topbar = () => {
  return (
    <div className="fixed h-16 bg-primary text-primary-foreground w-screen flex flex-row justify-between items-center py-2 px-4">
      <div className="ml-4">
        <img src={Logo} alt="Logo" className="h-16 w-auto" />
      </div>
    </div>
  );
};

export default Topbar;
