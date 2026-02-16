'use client';

import { Bell, Search, Menu } from 'lucide-react';
import { Avatar } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between bg-transparent backdrop-blur-sm px-6">

      {/* Left side */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-[#94a3b8] hover:bg-[#252d3f] hover:text-white lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative rounded-lg p-2 text-[#94a3b8] hover:bg-[#252d3f] hover:text-white">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-blue-500" />
        </button>

        {/* User */}
        <div className="flex items-center gap-3">
          <Avatar name={user?.nome} size="sm" />
          <div className="hidden md:block">
            <p className="text-sm font-medium text-white">{user?.nome}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
