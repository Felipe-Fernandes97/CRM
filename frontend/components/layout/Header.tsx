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
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#2a3146] bg-[#1a1f2e] px-6">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-[#94a3b8] hover:bg-[#252d3f] hover:text-white lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Search */}
        <div className="hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
            <input
              type="text"
              placeholder="Pesquisar..."
              className="h-10 w-64 rounded-lg border border-[#2a3146] bg-[#252d3f] pl-10 pr-4 text-sm text-white placeholder:text-[#94a3b8] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 lg:w-80"
            />
          </div>
        </div>
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
