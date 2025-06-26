
import React from 'react';
import { Calendar, Home, BookOpen, CheckSquare, StickyNote, BarChart3, Target, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'planner', label: 'Planificador', icon: Calendar },
  { id: 'subjects', label: 'Materias', icon: BookOpen },
  { id: 'completed', label: 'Completadas', icon: CheckSquare },
  { id: 'notes', label: 'Notas', icon: StickyNote },
  { id: 'calendar', label: 'Calendario', icon: Calendar },
  { id: 'progress', label: 'Progreso', icon: BarChart3 },
  { id: 'habits', label: 'Hábitos', icon: Target },
];

export function Sidebar({ activeSection, onSectionChange, collapsed, onToggleCollapse }: SidebarProps) {
  return (
    <div className={cn(
      "h-full bg-white border-r border-slate-200 transition-all duration-300 flex flex-col relative",
      collapsed ? "w-14 md:w-16" : "w-56 md:w-64"
    )}>
      {/* Toggle Button responsivo */}
      <button
        onClick={onToggleCollapse}
        className={cn(
          "absolute -right-3 top-6 bg-white border border-slate-300 rounded-full p-1 shadow-md transition-all duration-300 hover:bg-slate-50 z-10",
          "hidden md:flex"
        )}
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4 text-slate-700" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-slate-700" />
        )}
      </button>

      {/* Mobile Toggle Button */}
      <button
        onClick={onToggleCollapse}
        className={cn(
          "md:hidden flex absolute top-3 right-3 bg-blue-600 text-white rounded-full p-1 shadow-lg z-20"
        )}
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>

      {/* Header responsivo */}
      <div className="p-2 md:p-4 border-b border-slate-200">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-7 h-7 md:w-8 md:h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <BookOpen className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-semibold text-slate-800 text-sm md:text-base">EduPlanner</h1>
              <p className="text-xs md:text-sm text-slate-600">Tu asistente académico</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation responsiva */}
      <nav className="flex-1 p-2 md:p-4">
        <ul className="space-y-1 md:space-y-2">
          {navigationItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-2 md:gap-3 p-2 md:px-3 md:py-2 rounded-lg transition-colors text-left relative group text-sm md:text-base",
                  activeSection === item.id
                    ? "bg-blue-600 text-white"
                    : "text-slate-800 hover:bg-slate-100"
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span className="font-medium">{item.label}</span>}
                
                {/* Tooltip para modo colapsado */}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30">
                    {item.label}
                  </div>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-2 md:p-4 border-t border-slate-200">
        <button
          onClick={() => onSectionChange('settings')}
          className={cn(
            "w-full flex items-center gap-2 md:gap-3 p-2 md:px-3 md:py-2 rounded-lg transition-colors text-left relative group text-sm md:text-base",
            activeSection === 'settings'
              ? "bg-blue-600 text-white"
              : "text-slate-800 hover:bg-slate-100"
          )}
          title={collapsed ? "Configuración" : undefined}
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="font-medium">Configuración</span>}
          
          {/* Tooltip para modo colapsado */}
          {collapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30">
              Configuración
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
