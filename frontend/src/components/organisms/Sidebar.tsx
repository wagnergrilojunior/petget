'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Home,
  Users,
  Heart,
  Calendar,
  Package,
  DollarSign,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const menuItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
  {
    title: 'Clientes',
    href: '/dashboard/clientes',
    icon: Users,
  },
  {
    title: 'Pets',
    href: '/dashboard/pets',
    icon: Heart,
  },
  {
    title: 'Agenda',
    href: '/dashboard/agenda',
    icon: Calendar,
  },
  {
    title: 'Produtos',
    href: '/dashboard/produtos',
    icon: Package,
  },
  {
    title: 'Financeiro',
    href: '/dashboard/financeiro',
    icon: DollarSign,
  },
  {
    title: 'Configurações',
    href: '/dashboard/configuracoes',
    icon: Settings,
  },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      {!collapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed top-0 left-0 z-50 h-full bg-sidebar border-r border-border transition-all duration-300 ease-in-out shadow-lg",
          collapsed ? "w-16" : "w-64",
          "md:translate-x-0",
          collapsed ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
        role="navigation"
        aria-label="Menu principal de navegação"
        aria-expanded={!collapsed}
      >
        {/* Logo/Brand */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className={cn(
            "flex items-center space-x-3",
            collapsed && "justify-center"
          )}>
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-md">
              <Heart className="w-6 h-6 text-primary-foreground" aria-hidden="true" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-xl font-bold text-sidebar-foreground">
                  PetGet
                </span>
                <span className="text-xs text-muted-foreground">
                  Gestão Veterinária
                </span>
              </div>
            )}
          </div>
          
          {/* Toggle Button - Desktop */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="hidden lg:flex p-1.5"
            aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
            aria-expanded={!collapsed}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            ) : (
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1" role="menu">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start h-11 transition-all duration-200",
                    collapsed ? "justify-center px-2" : "px-3",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90" 
                      : "text-sidebar-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                  role="menuitem"
                  aria-label={collapsed ? item.title : undefined}
                  aria-current={isActive ? "page" : undefined}
                  title={collapsed ? item.title : undefined}
                >
                  <Icon className={cn(
                    "w-5 h-5 flex-shrink-0",
                    !collapsed && "mr-3"
                  )} aria-hidden="true" />
                  {!collapsed && (
                    <span className="truncate font-medium">{item.title}</span>
                  )}
                  {collapsed && isActive && (
                    <div className="absolute left-0 w-1 h-6 bg-primary rounded-r-full" aria-hidden="true" />
                  )}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-3 border-t border-border">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start h-11 text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-200",
              collapsed ? "justify-center px-2" : "px-3"
            )}
            aria-label={collapsed ? "Sair do sistema" : undefined}
            title={collapsed ? "Sair do sistema" : undefined}
          >
            <LogOut className={cn(
              "w-5 h-5 flex-shrink-0",
              !collapsed && "mr-3"
            )} aria-hidden="true" />
            {!collapsed && <span className="font-medium">Sair</span>}
          </Button>
        </div>
      </aside>
    </>
  );
}