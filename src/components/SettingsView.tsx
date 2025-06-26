import React, { useState, useEffect } from 'react';
import { Settings, User, Palette, Shield, Info, FileText, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useUserProfile } from '@/hooks/useUserProfile'; // Importamos el hook

// Theme hook (solo modo claro)
const useTheme = () => {
  const [theme] = useState('light');

  useEffect(() => {
    const root = document.documentElement;
    root.className = '';
    root.classList.add(`theme-light`);
    
    // Aplicar variables CSS para tema claro
    root.style.setProperty('--bg-primary', '#f8fafc');
    root.style.setProperty('--bg-secondary', '#ffffff');
    root.style.setProperty('--bg-card', '#ffffff');
    root.style.setProperty('--text-primary', '#1e293b');
    root.style.setProperty('--text-secondary', '#64748b');
    root.style.setProperty('--border-color', '#e2e8f0');
  }, [theme]);

  return { theme };
};

// PDF Document Viewer Component
const PDFViewer = ({ fileName, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkPDF = () => {
      try {
        // Verificar que el archivo existe
        setLoading(false);
      } catch (err) {
        setError('Error al cargar el documento');
        setLoading(false);
      }
    };

    checkPDF();
  }, [fileName]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg">
          <p>Cargando documento...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-md">
          <h3 className="text-lg font-semibold mb-2">Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={onClose}>Cerrar</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-full flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">{fileName}</h3>
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </div>
        <div className="flex-1 overflow-auto">
          <iframe
            src={`/${fileName}`}
            className="w-full h-full min-h-[600px]"
            title={fileName}
          />
        </div>
      </div>
    </div>
  );
};

export function SettingsView() {
  const { theme } = useTheme();
  const [showPDF, setShowPDF] = useState(null);
  
  // Usamos el hook para obtener el perfil del usuario
  const { userProfile, isUniversity, isSchool } = useUserProfile();

  const handleDeleteData = () => {
    if (window.confirm('¿Estás seguro de que deseas borrar TODOS tus datos? Esta acción es irreversible.')) {
      try {
        localStorage.clear();
        window.location.reload();
        alert('Todos los datos han sido eliminados. La aplicación se reiniciará.');
      } catch (error) {
        console.error('Error al borrar datos:', error);
        alert('Error al borrar datos');
      }
    }
  };

  const handleViewDocument = (docType) => {
    setShowPDF(docType);
  };

  // Estilos fijos para modo claro
  const rootStyles = "min-h-screen p-6 transition-all duration-300 bg-gray-50 text-slate-800";
  const cardStyles = "bg-white border-slate-200 shadow-sm";
  const textStyles = {
    primary: "text-slate-800",
    secondary: "text-slate-700",
    muted: "text-slate-600"
  };

  return (
    <div className={rootStyles}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Settings className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className={`text-3xl font-bold ${textStyles.primary}`}>
              Configuración
            </h1>
            <p className={textStyles.secondary}>
              Personaliza tu experiencia en EduPlanner
            </p>
          </div>
        </div>

        {/* Perfil de Usuario */}
        <Card className={cardStyles}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${textStyles.primary}`}>
              <User className="w-5 h-5 text-blue-600" />
              Perfil de Usuario
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className={`text-base font-medium ${textStyles.primary}`}>
                  Tipo de Usuario
                </Label>
                <p className={`text-sm ${textStyles.muted}`}>
                  Tu perfil académico actual (no modificable)
                </p>
              </div>
              <Badge 
                variant="outline" 
                className="capitalize border-blue-200 text-blue-700 bg-blue-50"
              >
                {isUniversity ? 'Universitario' : 'Colegial'}
              </Badge>
            </div>
            
            <Separator className="bg-slate-200" />
            
            <div className="flex items-center justify-between">
              <div>
                <Label className={`text-base font-medium ${textStyles.primary}`}>
                  Estado del Perfil
                </Label>
                <p className={`text-sm ${textStyles.muted}`}>
                  El perfil no puede cambiarse después de la selección inicial
                </p>
              </div>
              <Badge
                variant="secondary"
                className="text-slate-600 bg-slate-100 border-slate-300 hover:bg-red-100 hover:text-red-700 hover:border-red-400 transition-colors"
              >
                Bloqueado
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Apariencia */}
        <Card className={cardStyles}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${textStyles.primary}`}>
              <Palette className="w-5 h-5 text-purple-600" />
              Apariencia
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className={`text-base font-medium ${textStyles.primary}`}>
                  Tema de la Aplicación
                </Label>
                <p className={`text-sm ${textStyles.muted}`}>
                  Modo Claro predeterminado y permanente.
                </p>
              </div>
              <Badge 
                variant="outline" 
                className="capitalize border-purple-200 text-purple-700 bg-purple-50"
              >
                Modo Claro
              </Badge>
            </div>
            
            <Separator className="bg-slate-200" />
            
            <div className="p-4 rounded-lg border-2 border-dashed border-opacity-50" 
                 style={{ 
                   borderColor: '#cbd5e1',
                   backgroundColor: '#f8fafc'
                 }}>
              <p className={`text-sm font-medium ${textStyles.primary} mb-2`}>
                Vista previa del tema:
              </p>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-blue-500"></div>
                <div className="w-4 h-4 rounded bg-green-500"></div>
                <div className="w-4 h-4 rounded bg-purple-500"></div>
                <span className={`text-sm ${textStyles.secondary}`}>
                  Tema claro activo.
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Datos y Privacidad */}
        <Card className={cardStyles}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${textStyles.primary}`}>
              <Shield className="w-5 h-5 text-indigo-600" />
              Datos y Privacidad
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className={`text-base font-medium ${textStyles.primary}`}>
                  Borrar Datos
                </Label>
                <p className={`text-sm ${textStyles.muted}`}>
                  Elimina permanentemente todos tus datos
                </p>
              </div>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleDeleteData}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Borrar Todo
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Información */}
        <Card className={cardStyles}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${textStyles.primary}`}>
              <Info className="w-5 h-5 text-cyan-600" />
              Información Legal y Soporte
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className={`text-base font-medium ${textStyles.primary}`}>
                  Versión
                </Label>
                <p className={`text-sm ${textStyles.muted}`}>
                  EduPlanner v1.0.0    │    InfinCore WebWoks. All Rights Reserved
                </p>
              </div>
            </div>
            
            <Separator className="bg-slate-200" />
            
            <div className="flex items-center justify-between">
              <div>
                <Label className={`text-base font-medium ${textStyles.primary}`}>
                  Política de Privacidad
                </Label>
                <p className={`text-sm ${textStyles.muted}`}>
                  Consulta nuestra política de privacidad
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleViewDocument('Politica_de_Privacidad_EduPlanner.pdf')}
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Ver Documento
              </Button>
            </div>
            
            <Separator className="bg-slate-200" />
            
            <div className="flex items-center justify-between">
              <div>
                <Label className={`text-base font-medium ${textStyles.primary}`}>
                  Términos de Servicio
                </Label>
                <p className={`text-sm ${textStyles.muted}`}>
                  Lee nuestros términos y condiciones
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleViewDocument('Terminos_de_Servicio_EduPlanner.pdf')}
                className="flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Ver Documento
              </Button>
            </div>
            
            <Separator className="bg-slate-200" />

            <div className="flex items-center justify-between">
              <div>
                <Label className={`text-base font-medium ${textStyles.primary}`}>
                  Soporte Técnico
                </Label>
                <p className={`text-sm ${textStyles.muted}`}>
                  ¿Necesitas ayuda? Contáctanos
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  window.open('https://wa.me/50672862183?text=Hola%2C%20necesito%20ayuda%20con%20el%20soporte%20técnico%20EduPlanner', '_blank')
                }
              >
                Contactar
              </Button>
            </div>

          </CardContent>
        </Card>
      </div>

      {/* PDF Viewer Modal */}
      {showPDF && (
        <PDFViewer 
          fileName={showPDF}
          onClose={() => setShowPDF(null)}
        />
      )}
    </div>
  );
}