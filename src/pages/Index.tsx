import React, { useState } from 'react';
import { Dashboard } from '@/components/Dashboard';
import { WeeklyPlanner } from '@/components/WeeklyPlanner';
import { SubjectsView } from '@/components/SubjectsView';
import { NotesView } from '@/components/NotesView';
import { CalendarView } from '@/components/CalendarView';
import { ProgressView } from '@/components/ProgressView';
import { HabitsView } from '@/components/HabitsView';
import { CompletedView } from '@/components/CompletedView';
import { SettingsView } from '@/components/SettingsView';
import { UserProfileSelector } from '@/components/UserProfileSelector';
import { useUserProfile } from '@/hooks/useUserProfile';
import { cn } from '@/lib/utils';
import { SchoolDashboard } from '@/components/SchoolDashboard';
import { 
  Calendar, 
  Home, 
  BookOpen, 
  CheckSquare, 
  StickyNote, 
  BarChart3, 
  Target, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  Menu, 
  X 
} from 'lucide-react';

export default function Index() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { userProfile, showProfileSelector, selectProfile } = useUserProfile();

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

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return userProfile === 'university' ? <Dashboard /> : <SchoolDashboard activeSection={activeSection} />;
      case 'planner':
        return <WeeklyPlanner />;
      case 'subjects':
        return userProfile === 'university' ? <SubjectsView /> : <SchoolDashboard activeSection={activeSection} />;
      case 'completed':
        return <CompletedView />;
      case 'notes':
        return <NotesView />;
      case 'calendar':
        return <CalendarView />;
      case 'progress':
        return <ProgressView />;
      case 'habits':
        return <HabitsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <div>Selecciona una sección</div>;
    }
  };

  // Componente Sidebar Responsive Integrado
  const ResponsiveSidebar = () => (
    <>
      {/* Overlay para móvil */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" 
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed md:static inset-y-0 left-0 z-50",
        "transition-all duration-300 ease-in-out",
        "bg-white border-r border-gray-200 flex flex-col",
        // Mobile behavior
        mobileSidebarOpen ? "translate-x-0" : "-translate-x-full",
        "md:translate-x-0",
        // Desktop width
        sidebarCollapsed ? "w-16" : "w-64"
      )}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              {!sidebarCollapsed && (
                <div>
                  <h1 className="font-semibold text-gray-800">EduPlanner</h1>
                  <p className="text-sm text-gray-600">Tu asistente académico</p>
                </div>
              )}
            </div>
            
            {/* Botón cerrar en móvil */}
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="md:hidden p-1 rounded-md hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setActiveSection(item.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left",
                    activeSection === item.id
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => {
              setActiveSection('settings');
              setMobileSidebarOpen(false);
            }}
            className={cn(
              "w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left",
              activeSection === 'settings'
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            )}
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span className="font-medium">Configuración</span>}
          </button>
        </div>

        {/* ==== NUEVO: LOGO DE LA EMPRESA ==== */}
        <div className="p-4 border-t border-gray-200 flex justify-center">
          <div className={cn(
            "transition-all duration-300",
            sidebarCollapsed ? "w-10" : "w-32"
          )}>
            <a
              href="https://wa.me/+50672862183"
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:opacity-80 transition-opacity duration-200"
            >
              <img
                src="/LOGO COMPAÑIA.png"
                alt="InfiniCore Logo"
                className="w-full h-auto cursor-pointer"
              />
            </a>
            {!sidebarCollapsed && (
              <p className="text-xs text-center mt-1 text-gray-500">
                Planifica. Aprende. Triunfa.
              </p>
            )}
          </div>
        </div>

        {/* Toggle button para desktop */}
        <button
          onClick={handleToggleSidebar}
          className="hidden md:block absolute -right-3 top-6 bg-white border border-gray-300 rounded-full p-1 shadow-md hover:bg-gray-50 z-10"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>
    </>
  );

  if (showProfileSelector) {
    return <UserProfileSelector onSelectProfile={selectProfile} />;
  }

  return (
    <div className="min-h-screen bg-academic-neutral flex">
      {/* Sidebar Responsive */}
      <ResponsiveSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-gray-800">EduPlanner</span>
            </div>
            <div className="w-9 h-9"></div> {/* Espaciador */}
          </div>
        </div>

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-6 max-w-7xl mx-auto w-full">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}