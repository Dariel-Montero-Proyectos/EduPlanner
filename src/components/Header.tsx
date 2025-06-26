
import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Menu, Sun, Moon, Bell } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export function Header({ onToggleSidebar, darkMode, onToggleDarkMode }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="md:hidden"
        >
          <Menu className="w-5 h-5 text-slate-700" />
        </Button>
        
        <div className="hidden md:block">
          <h2 className="font-medium text-slate-800">
            {new Date().toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" className="text-slate-600">
          <Bell className="w-4 h-4" />
        </Button>
        
        <div className="flex items-center gap-2">
          <Sun className="w-4 h-4 text-slate-600" />
          <Switch 
            checked={darkMode} 
            onCheckedChange={onToggleDarkMode}
            id="dark-mode"
          />
          <Moon className="w-4 h-4 text-slate-600" />
        </div>
      </div>
    </header>
  );
}
