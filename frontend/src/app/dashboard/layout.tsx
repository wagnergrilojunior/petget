'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/organisms/Sidebar';
import { Header } from '@/components/organisms/Header';
import { SkipLinks } from '@/components/ui/skip-links';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Skip Links para acessibilidade */}
      <SkipLinks />
      
      {/* Sidebar */}
      <div id="main-navigation">
        <Sidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>
      
      {/* Main Content */}
      <div className={cn(
        "transition-all duration-300 ease-in-out",
        sidebarCollapsed ? "ml-16" : "ml-64",
        "lg:ml-64 lg:ml-16" // Responsive: sempre colapsada em mobile
      )}>
        {/* Header */}
        <Header 
          onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        {/* Page Content */}
        <main 
          id="main-content"
          className="p-4 lg:p-6"
          role="main"
          aria-label="Conteúdo principal"
          tabIndex={-1}
        >
          {children}
        </main>
      </div>
      
      {/* Região live para anúncios dinâmicos */}
      <div 
        id="live-region" 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
      ></div>
    </div>
  );
}