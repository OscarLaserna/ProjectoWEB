'use client'

import { ReactNode } from 'react';
import { signOut } from "next-auth/react"

export const navbarButtonClasses =
  'rounded-full p-2 text-gray-400 hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-white';

interface NavbarButtonProps {
  children: ReactNode;
}

const handleSignOut = async () => {
    await signOut();
};

export default function NavbarButton({ children }: NavbarButtonProps) {
  return (
    <button className={navbarButtonClasses} onClick={handleSignOut}>
      {children}
    </button>
  );
}