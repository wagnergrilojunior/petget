'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Menu,
  Search,
  Bell,
  Settings,
  User,
  LogOut,
  Moon,
  Sun,
} from 'lucide-react';
// import { cn } from '@/lib/utils'; // Removido temporariamente

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Aqui você implementaria a lógica real do dark mode
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header 
      className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border shadow-sm"
      role="banner"
      aria-label="Cabeçalho principal"
    >
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden"
            aria-label="Abrir menu de navegação"
            aria-expanded="false"
          >
            <Menu className="w-5 h-5" aria-hidden="true" />
          </Button>

          {/* Search Bar */}
          <div className="hidden md:flex items-center space-x-2" role="search">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" aria-hidden="true" />
              <input
                type="text"
                placeholder="Buscar clientes, pets, agendamentos..."
                className="pl-10 pr-4 py-2.5 w-96 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 hover:border-primary/50"
                aria-label="Campo de busca"
                aria-describedby="search-description"
              />
              <span id="search-description" className="sr-only">
                Digite para buscar clientes, pets ou agendamentos
              </span>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2">
          {/* Search Button - Mobile */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden h-9 w-9 hover:bg-accent"
            aria-label="Abrir busca"
          >
            <Search className="w-4 h-4" aria-hidden="true" />
          </Button>

          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleDarkMode}
            className="h-9 w-9 hover:bg-accent transition-colors"
            aria-label={isDarkMode ? "Ativar modo claro" : "Ativar modo escuro"}
            aria-pressed={isDarkMode}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Moon className="w-4 h-4" aria-hidden="true" />
            )}
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            className="relative h-9 w-9 hover:bg-accent transition-colors"
            aria-label="Notificações (3 não lidas)"
            aria-describedby="notification-count"
          >
            <Bell className="w-4 h-4" aria-hidden="true" />
            {/* Notification Badge */}
            <span 
              className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-background"
              aria-hidden="true"
            >
            </span>
            <span id="notification-count" className="sr-only">
              3 notificações não lidas
            </span>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="relative h-10 w-10 rounded-full hover:bg-accent transition-colors"
                aria-label="Menu do usuário"
                aria-haspopup="menu"
              >
                <Avatar className="h-9 w-9">
                  <div className="w-full h-full bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-sm">
                    <User className="w-4 h-4 text-primary-foreground" aria-hidden="true" />
                  </div>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end" forceMount role="menu">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-semibold leading-none">Dr. João Silva</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    joao@clinicapet.com
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" aria-hidden="true"></div>
                    <span className="text-xs text-muted-foreground">Clínica PetCare</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" role="menuitem">
                <User className="mr-2 h-4 w-4" aria-hidden="true" />
                <span>Meu Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" role="menuitem">
                <Settings className="mr-2 h-4 w-4" aria-hidden="true" />
                <span>Configurações</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive cursor-pointer focus:text-destructive" role="menuitem">
                <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}