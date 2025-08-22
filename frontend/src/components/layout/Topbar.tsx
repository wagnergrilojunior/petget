'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Bell,
  Search,
  Settings,
  User,
  LogOut,
} from 'lucide-react';

export default function Topbar() {
  return (
    <header className="fixed top-0 right-0 z-30 h-16 bg-white border-b border-gray-200 shadow-sm" style={{ left: '16rem', width: 'calc(100% - 16rem)' }}>
      <div className="flex h-full items-center justify-between px-6">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Buscar..."
              className="h-9 w-64 rounded-lg border border-gray-300 bg-white pl-10 pr-4 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative h-9 w-9 p-0 text-gray-600 hover:text-gray-900">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">3</span>
            <span className="sr-only">Notificações</span>
          </Button>

          {/* Settings */}
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-gray-600 hover:text-gray-900">
            <Settings className="h-5 w-5" />
            <span className="sr-only">Configurações</span>
          </Button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 h-9 px-3 rounded-lg hover:bg-gray-50">
                <Avatar className="h-7 w-7">
                  <AvatarImage src="/avatars/luana.jpg" alt="Luana" />
                  <AvatarFallback className="bg-blue-500 text-white text-sm">L</AvatarFallback>
                </Avatar>
                <span className="hidden md:block text-sm font-medium text-gray-700">Luana</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Luana</p>
                  <p className="text-xs leading-none text-gray-500">
                    luana@petcare.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}