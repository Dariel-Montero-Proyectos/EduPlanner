import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, BookOpen, FileText, Shield } from 'lucide-react';

interface UserProfileSelectorProps {
  onSelectProfile: (profile: 'university' | 'school') => void;
}

export function UserProfileSelector({ onSelectProfile }: UserProfileSelectorProps) {
  const [selectedProfile, setSelectedProfile] = useState<'university' | 'school' | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTermsOfService, setShowTermsOfService] = useState(false);

  const handleProfileSelect = (profile: 'university' | 'school') => {
    setSelectedProfile(profile);
  };

  const handleContinue = () => {
    if (selectedProfile && acceptedTerms) {
      onSelectProfile(selectedProfile);
    }
  };

  const PrivacyPolicyModal = () => (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4">
      <Card className="w-full max-w-3xl bg-white rounded-xl shadow-2xl max-h-[85vh] overflow-y-auto relative">
        <CardHeader className="sticky top-0 bg-white border-b z-10">
          <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Política de Privacidad
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <div className="text-sm text-slate-600 space-y-4">
            <p><strong>1. Información que recopilamos:</strong> Recopilamos información personal que nos proporcionas directamente, tus preferencias académicas y tu nivel academico.</p>
            <p><strong>2. Cómo usamos tu información:</strong> Utilizamos tu información para que puedas personalizar tu experiencia educativa y mejorar nuestros servicios.</p>
            <p><strong>3. Protección de datos:</strong> Implementamos medidas de seguridad técnicas y organizativas para proteger tu información personal.</p>
            <p><strong>4. Compartir información:</strong> No vendemos, alquilamos ni compartimos tu información personal con terceros sin tu consentimiento.</p>
            <p><strong>5. Tus derechos:</strong> Tienes derecho a acceder, corregir o eliminar tu información personal en cualquier momento.</p>
          </div>
          <div className="sticky bottom-0 bg-white pt-4 border-t">
            <Button 
              onClick={() => setShowPrivacyPolicy(false)}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Cerrar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const TermsOfServiceModal = () => (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4">
      <Card className="w-full max-w-3xl bg-white rounded-xl shadow-2xl max-h-[85vh] overflow-y-auto relative">
        <CardHeader className="sticky top-0 bg-white border-b z-10">
          <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Términos de Servicio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <div className="text-sm text-slate-600 space-y-4">
            <p><strong>1. Aceptación de términos:</strong> Al usar EduPlanner, aceptas cumplir con estos términos y condiciones.</p>
            <p><strong>2. Uso del servicio:</strong> EduPlanner está destinado para uso educativo personal. No debes usar el servicio para actividades ilegales o no autorizadas.</p>
            <p><strong>3. Responsabilidad del usuario:</strong> Eres responsable de mantener la confidencialidad de tu cuenta y de todas las actividades que ocurran bajo tu cuenta.</p>
            <p><strong>4. Contenido del usuario:</strong> Conservas todos los derechos sobre el contenido que creas o subes a EduPlanner.</p>
            <p><strong>5. Servicio gratuito:</strong> EduPlanner es completamente gratuito. Nadie está autorizado a cobrarte por usar la aplicación o sus funciones.</p>
            <p><strong>6. Modificaciones:</strong> Nos reservamos el derecho de modificar estos términos en cualquier momento, te avisaremos si sucede para aceptes los terminos nuevamente.</p>
          </div>
          <div className="sticky bottom-0 bg-white pt-4 border-t">
            <Button 
              onClick={() => setShowTermsOfService(false)}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              Cerrar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-lg bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-slate-800">
              ¡Bienvenido a EduPlanner!
            </CardTitle>
            <p className="text-slate-600">
              Para personalizar tu experiencia, selecciona tu nivel académico:
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                onClick={() => handleProfileSelect('university')}
                variant="outline"
                className={`h-32 flex flex-col items-center justify-center gap-3 bg-white border-2 transition-all duration-200 rounded-lg ${
                  selectedProfile === 'university' 
                    ? 'border-blue-400 bg-blue-50 ring-2 ring-blue-200' 
                    : 'border-blue-200 hover:bg-blue-50 hover:border-blue-400'
                }`}
              >
                <GraduationCap className="w-8 h-8 text-blue-600" />
                <div className="text-center">
                  <h3 className="font-bold text-slate-800">
                    Universitario
                  </h3>
                  <p className="text-sm text-slate-600">
                    Materias, créditos, proyectos
                  </p>
                </div>
              </Button>
              
              <Button
                onClick={() => handleProfileSelect('school')}
                variant="outline"
                className={`h-32 flex flex-col items-center justify-center gap-3 bg-white border-2 transition-all duration-200 rounded-lg ${
                  selectedProfile === 'school' 
                    ? 'border-indigo-400 bg-indigo-50 ring-2 ring-indigo-200' 
                    : 'border-indigo-200 hover:bg-indigo-50 hover:border-indigo-400'
                }`}
              >
                <BookOpen className="w-8 h-8 text-indigo-600" />
                <div className="text-center">
                  <h3 className="font-bold text-slate-800">
                    Colegial
                  </h3>
                  <p className="text-sm text-slate-600">
                    Asignaturas, tareas, exámenes
                  </p>
                </div>
              </Button>
            </div>
            
            {/* Botones de Política de Privacidad y Términos de Servicio */}
            <div className="border-t border-blue-200 pt-4 space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <Button
                  onClick={() => setShowPrivacyPolicy(true)}
                  variant="ghost"
                  className="text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-3 h-auto w-full justify-start"
                >
                  <Shield className="w-4 h-4 mr-3 flex-shrink-0" />
                  <div className="text-left">
                    <div className="font-semibold">Política de Privacidad</div>
                    <div className="text-slate-500 text-xs">Consulta nuestra política de privacidad</div>
                  </div>
                </Button>
                
                <Button
                  onClick={() => setShowTermsOfService(true)}
                  variant="ghost"
                  className="text-sm text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 p-3 h-auto w-full justify-start"
                >
                  <FileText className="w-4 h-4 mr-3 flex-shrink-0" />
                  <div className="text-left">
                    <div className="font-semibold">Términos de Servicio</div>
                    <div className="text-slate-500 text-xs">Lee nuestros términos y condiciones</div>
                  </div>
                </Button>
              </div>

              {/* Checkbox para aceptar términos */}
              <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded flex-shrink-0"
                />
                <label htmlFor="acceptTerms" className="text-sm text-slate-700 leading-relaxed">
                  Acepto los <button 
                    onClick={() => setShowTermsOfService(true)}
                    className="text-indigo-600 hover:underline font-medium"
                  >
                    Términos de Servicio
                  </button> y la <button 
                    onClick={() => setShowPrivacyPolicy(true)}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Política de Privacidad
                  </button> de EduPlanner.
                </label>
              </div>

              {/* Botón Continuar */}
              <Button
                onClick={handleContinue}
                disabled={!selectedProfile || !acceptedTerms}
                className={`w-full h-12 text-base font-semibold transition-all duration-200 ${
                  selectedProfile && acceptedTerms
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {!selectedProfile ? 'Selecciona un perfil para continuar' :
                 !acceptedTerms ? 'Acepta los términos para continuar' :
                 'Continuar con EduPlanner'}
              </Button>
            </div>
            
            <p className="text-xs text-center text-slate-500">
              Esta configuración se guardará permanentemente y no se podrá cambiar.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Modales */}
      {showPrivacyPolicy && <PrivacyPolicyModal />}
      {showTermsOfService && <TermsOfServiceModal />}
    </>
  );
}