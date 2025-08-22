'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Users,
  Heart,
  Calendar,
  CreditCard,
  BarChart3,
  UserCog,
  DollarSign,
  Settings,
  Menu,
  X,
  Zap
} from 'lucide-react';

const menuItems = [
  { icon: Home, label: 'Dashboard', href: '/dashboard' },
  { icon: Users, label: 'Clientes', href: '/dashboard/clientes' },
  { icon: Heart, label: 'Animais', href: '/dashboard/animais' },
  { icon: Calendar, label: 'Agenda', href: '/dashboard/agenda' },
  { icon: CreditCard, label: 'Planos', href: '/dashboard/planos' },
  { icon: BarChart3, label: 'Relatórios', href: '/dashboard/relatorios' },
  { icon: UserCog, label: 'Usuários', href: '/dashboard/usuarios' },
  { icon: DollarSign, label: 'Financeiro', href: '/dashboard/financeiro' },
  { icon: Zap, label: 'Integração', href: '/dashboard/integracao' },
  { icon: Settings, label: 'Configurações', href: '/dashboard/configuracoes' },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg bg-white shadow-lg"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed left-0 top-0 z-40 h-screen transition-all duration-300 sidebar-gradient
          ${collapsed ? 'w-16' : 'w-64'}
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-center px-4 border-b border-white/10">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <Heart className="h-8 w-8 text-white" />
              <h1 className="text-xl font-bold text-white">PetCare</h1>
            </div>
          )}
          {collapsed && <Heart className="h-8 w-8 text-white" />}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200
                  ${isActive 
                    ? 'bg-white/20 text-white shadow-sm' 
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }
                  ${collapsed ? 'justify-center' : ''}
                `}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse button */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex w-full items-center justify-center p-2 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors"
          >
            {collapsed ? (
              <Menu className="h-5 w-5" />
            ) : (
              <div className="flex items-center gap-2">
                <X className="h-5 w-5" />
                <span className="text-sm">Recolher</span>
              </div>
            )}
          </button>
        </div>
      </div>
    </>
  );
}