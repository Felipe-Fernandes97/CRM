'use client';

import { ReactNode } from 'react';
import LiquidChromeWrapper from '@/components/ui/LiquidChromeWrapper';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[#000000]">
      {/* Liquid Chrome Background */}
      <div className="fixed inset-0 z-0">
        <LiquidChromeWrapper />
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
