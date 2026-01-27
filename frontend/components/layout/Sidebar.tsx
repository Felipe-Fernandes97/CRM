'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Building2,
  Target,
  FileText,
  CheckSquare,
  MessageSquare,
  BarChart3,
  Zap,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar } from '@/components/ui';

const menuItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Leads', href: '/leads', icon: UserPlus },
  { name: 'Clientes', href: '/clientes', icon: Users },
  { name: 'Empresas', href: '/empresas', icon: Building2 },
  { name: 'Oportunidades', href: '/oportunidades', icon: Target },
  { name: 'Negociações', href: '/negociacoes', icon: FileText },
  { name: 'Atividades', href: '/atividades', icon: CheckSquare },
  { name: 'Comunicações', href: '/comunicacoes', icon: MessageSquare },
  { name: 'Equipe', href: '/equipe', icon: Users },
  { name: 'Relatórios', href: '/relatorios', icon: BarChart3 },
  { name: 'Automações', href: '/automacoes', icon: Zap },
  { name: 'Configurações', href: '/configuracoes', icon: Settings },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-40 flex flex-col bg-[#1e2538] border-r border-[#2a3146] transition-all duration-300',
        collapsed ? 'w-[72px]' : 'w-64'
      )}
    >
      {/* Toggle */}
      <div className="flex h-16 items-center justify-end px-4">
        <button
          onClick={onToggle}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[#94a3b8] hover:bg-[#252d3f] hover:text-white transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/' && pathname.startsWith(item.href));

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  title={collapsed ? item.name : undefined}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    collapsed && 'justify-center px-0',
                    isActive
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'text-[#94a3b8] hover:bg-[#252d3f] hover:text-white'
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!collapsed && item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User */}
      <div className="p-3">
        <div className={cn('flex items-center gap-3', collapsed && 'flex-col')}>
          <Avatar name={user?.nome} size="md" />
          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-white">
                {user?.nome}
              </p>
              <p className="truncate text-xs text-[#94a3b8]">
                {user?.cargo === 'admin' ? 'Administrador' :
                 user?.cargo === 'gerente' ? 'Gerente' : 'Vendedor'}
              </p>
            </div>
          )}
          <button
            onClick={logout}
            title="Sair"
            className={cn(
              'rounded-lg p-2 text-[#94a3b8] hover:bg-[#252d3f] hover:text-white',
              collapsed && 'mt-1'
            )}
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
