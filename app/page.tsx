'use client';

import { BarChart3, Eye, Users, Droplets, MapPin, Shield, Zap, Globe } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="glass-effect sticky top-0 z-50 border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-700 to-blue-900 rounded-lg flex items-center justify-center shadow-lg">
                <Droplets className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Cuenca Hub</h1>
                <p className="text-xs text-slate-600 font-medium">PLATAFORMA OFICIAL</p>
              </div>
              <div className="gov-badge ml-3">TECNM</div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#inicio" className="text-slate-700 hover:text-blue-700 transition-all duration-300 font-medium text-sm uppercase tracking-wide">Inicio</a>
              <a href="#plataforma" className="text-slate-700 hover:text-blue-700 transition-all duration-300 font-medium text-sm uppercase tracking-wide">Plataforma</a>
              <a href="#datos" className="text-slate-700 hover:text-blue-700 transition-all duration-300 font-medium text-sm uppercase tracking-wide">Datos</a>
              <a href="#colaboracion" className="text-slate-700 hover:text-blue-700 transition-all duration-300 font-medium text-sm uppercase tracking-wide">Colaboración</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 px-6 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-5xl mx-auto">
            <div className="mb-6">
              <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-2 rounded-full mb-4 uppercase tracking-wide">
                Iniciativa Nacional
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-8 leading-tight">
              Plataforma Nacional de Saneamiento
              <span className="block text-blue-700 mt-2">Cuenca Lerma-Chapala-Santiago</span>
            </h1>
            <p className="text-xl text-slate-700 mb-10 leading-relaxed max-w-3xl mx-auto font-medium">
              Sistema integral de monitoreo, coordinación y gestión para la restauración 
              de la cuenca hídrica más estratégica del país.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary text-white px-10 py-4 rounded-lg font-semibold shadow-lg text-sm uppercase tracking-wide">
                Acceder a la Plataforma
              </button>
              <button className="border-2 border-blue-700 text-blue-700 px-10 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 hover:shadow-lg text-sm uppercase tracking-wide">
                Consultar Datos Públicos
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="inline-block bg-slate-100 text-slate-700 text-sm font-semibold px-4 py-2 rounded-full mb-6 uppercase tracking-wide">
              Capacidades Técnicas
            </span>
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Sistema Integral de Gestión</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Infraestructura tecnológica de vanguardia para el monitoreo, análisis y coordinación de acciones ambientales</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Visualización */}
            <div className="bg-slate-50 p-10 rounded-lg border-l-4 border-blue-600 card-hover">
              <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4 uppercase tracking-wide">Centro de Datos</h3>
              <p className="text-slate-700 leading-relaxed">Plataforma centralizada con mapas interactivos, indicadores ambientales y acceso a datos públicos en tiempo real.</p>
            </div>

            {/* Monitoreo */}
            <div className="bg-slate-50 p-10 rounded-lg border-l-4 border-teal-600 card-hover">
              <div className="w-16 h-16 bg-teal-600 rounded-lg flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4 uppercase tracking-wide">Monitoreo Continuo</h3>
              <p className="text-slate-700 leading-relaxed">Red de sensores IoT, sistema de alertas y mecanismos de reporte ciudadano para vigilancia ambiental 24/7.</p>
            </div>

            {/* Colaboración */}
            <div className="bg-slate-50 p-10 rounded-lg border-l-4 border-red-600 card-hover">
              <div className="w-16 h-16 bg-red-600 rounded-lg flex items-center justify-center mb-6">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4 uppercase tracking-wide">Red Institucional</h3>
              <p className="text-slate-700 leading-relaxed">Coordinación entre TECNM, gobiernos, universidades, municipios y organizaciones civiles a nivel nacional.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 gradient-bg text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">3</div>
              <div className="text-teal-100">Estados Conectados</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-teal-100">Municipios Participantes</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-teal-100">Monitoreo Continuo</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100+</div>
              <div className="text-teal-100">Puntos de Medición</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Únete al Esfuerzo de Restauración</h2>
          <p className="text-xl text-slate-300 mb-8">
            Forma parte de la red de colaboración más grande para el saneamiento de la cuenca Lerma-Chapala-Santiago.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary text-white px-8 py-4 rounded-xl font-semibold shadow-lg">
              Registrar Institución
            </button>
            <button className="border-2 border-slate-600 text-slate-300 px-8 py-4 rounded-xl font-semibold hover:bg-slate-800 transition-all duration-300 hover:shadow-lg">
              Acceder como Ciudadano
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-slate-300 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-teal-600 to-teal-800 rounded-xl flex items-center justify-center">
                  <Droplets className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-semibold text-white">Cuenca Hub</span>
              </div>
              <p className="text-sm">Plataforma tecnológica para el saneamiento y restauración de la cuenca Lerma-Chapala-Santiago.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Plataforma</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-teal-400 transition-colors">Mapa Interactivo</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Datos Abiertos</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Reportes</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Colaboración</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-teal-400 transition-colors">TECNM</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Universidades</a></li>
                <li><a href="#" className="hover:text-teal-400 transition-colors">Municipios</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Contacto</h4>
              <ul className="space-y-2 text-sm">
                <li>info@cuencahub.mx</li>
                <li>+52 (33) 1234-5678</li>
                <li>Guadalajara, Jalisco</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2024 Cuenca Hub. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
