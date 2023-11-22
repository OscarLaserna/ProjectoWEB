import { CartItemsProvider } from '@/providers/CartItemsProvider';
import './globals.css';
import { Inter } from 'next/font/google';
import React from 'react';
import { NextAuthProvider } from '@/providers/NextAuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'ShoeShop',
  description: 'ShoeShop sample application for the WES course',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={`${inter.className}`}>
        <NextAuthProvider>
          <CartItemsProvider>
            {children}
          </CartItemsProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
