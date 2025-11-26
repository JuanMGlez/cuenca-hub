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
              <div className="w-12 h-12 bg-gradient-to-br from-teal-800 to-slate-900 rounded-lg flex items-center justify-center shadow-lg" style={{background: 'linear-gradient(135deg, #1e5b4f, #161a1d)'}}>
                <Droplets className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold" style={{color: '#161a1d'}}>Cuenca Hub</h1>
                <p className="text-xs font-medium" style={{color: '#98989A'}}>PLATAFORMA OFICIAL</p>
              </div>
              <div className="gov-badge ml-3">TECNM</div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#inicio" className="transition-all duration-300 font-medium text-sm uppercase tracking-wide" style={{color: '#161a1d'}} onMouseEnter={(e) => e.target.style.color = '#1e5b4f'} onMouseLeave={(e) => e.target.style.color = '#161a1d'}>Inicio</a>
              <a href="#plataforma" className="transition-all duration-300 font-medium text-sm uppercase tracking-wide" style={{color: '#161a1d'}} onMouseEnter={(e) => e.target.style.color = '#1e5b4f'} onMouseLeave={(e) => e.target.style.color = '#161a1d'}>Plataforma</a>
              <a href="#datos" className="transition-all duration-300 font-medium text-sm uppercase tracking-wide" style={{color: '#161a1d'}} onMouseEnter={(e) => e.target.style.color = '#1e5b4f'} onMouseLeave={(e) => e.target.style.color = '#161a1d'}>Datos</a>
              <a href="#colaboracion" className="transition-all duration-300 font-medium text-sm uppercase tracking-wide" style={{color: '#161a1d'}} onMouseEnter={(e) => e.target.style.color = '#1e5b4f'} onMouseLeave={(e) => e.target.style.color = '#161a1d'}>Colaboración</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 px-6" style={{background: 'linear-gradient(135deg, #e6d194 0%, rgba(230, 209, 148, 0.3) 50%, #f8fafc 100%)'}}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-5xl mx-auto">
            <div className="mb-6">
              <span className="inline-block text-sm font-semibold px-4 py-2 rounded-full mb-4 uppercase tracking-wide" style={{backgroundColor: 'rgba(30, 91, 79, 0.1)', color: '#1e5b4f'}}>
                Iniciativa Nacional
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-tight" style={{color: '#161a1d'}}>
              Plataforma Nacional de Saneamiento
              <span className="block mt-2" style={{color: '#1e5b4f'}}>Cuenca Lerma-Chapala-Santiago</span>
            </h1>
            <p className="text-xl mb-10 leading-relaxed max-w-3xl mx-auto font-medium" style={{color: '#161a1d'}}>
              Sistema integral de monitoreo, coordinación y gestión para la restauración 
              de la cuenca hídrica más estratégica del país.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary text-white px-10 py-4 rounded-lg font-semibold shadow-lg text-sm uppercase tracking-wide">
                Acceder a la Plataforma
              </button>
              <button className="border-2 px-10 py-4 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg text-sm uppercase tracking-wide" style={{borderColor: '#1e5b4f', color: '#1e5b4f', backgroundColor: 'transparent'}} onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(30, 91, 79, 0.05)'} onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
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
            <div className="p-10 rounded-lg border-l-4 card-hover" style={{backgroundColor: 'rgba(230, 209, 148, 0.1)', borderLeftColor: '#1e5b4f'}}>
              <div className="w-16 h-16 rounded-lg flex items-center justify-center mb-6" style={{backgroundColor: '#1e5b4f'}}>
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 uppercase tracking-wide" style={{color: '#161a1d'}}>Centro de Datos</h3>
              <p className="leading-relaxed" style={{color: '#161a1d'}}>Plataforma centralizada con mapas interactivos, indicadores ambientales y acceso a datos públicos en tiempo real.</p>
            </div>

            {/* Monitoreo */}
            <div className="p-10 rounded-lg border-l-4 card-hover" style={{backgroundColor: 'rgba(230, 209, 148, 0.1)', borderLeftColor: '#a57f2c'}}>
              <div className="w-16 h-16 rounded-lg flex items-center justify-center mb-6" style={{backgroundColor: '#a57f2c'}}>
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 uppercase tracking-wide" style={{color: '#161a1d'}}>Monitoreo Continuo</h3>
              <p className="leading-relaxed" style={{color: '#161a1d'}}>Red de sensores IoT, sistema de alertas y mecanismos de reporte ciudadano para vigilancia ambiental 24/7.</p>
            </div>

            {/* Colaboración */}
            <div className="p-10 rounded-lg border-l-4 card-hover" style={{backgroundColor: 'rgba(230, 209, 148, 0.1)', borderLeftColor: '#9b2247'}}>
              <div className="w-16 h-16 rounded-lg flex items-center justify-center mb-6" style={{backgroundColor: '#9b2247'}}>
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 uppercase tracking-wide" style={{color: '#161a1d'}}>Red Institucional</h3>
              <p className="leading-relaxed" style={{color: '#161a1d'}}>Coordinación entre TECNM, gobiernos, universidades, municipios y organizaciones civiles a nivel nacional.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 gradient-bg text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2" style={{color: '#e6d194'}}>3</div>
              <div style={{color: 'rgba(230, 209, 148, 0.8)'}}>Estados Conectados</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2" style={{color: '#e6d194'}}>50+</div>
              <div style={{color: 'rgba(230, 209, 148, 0.8)'}}>Municipios Participantes</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2" style={{color: '#e6d194'}}>24/7</div>
              <div style={{color: 'rgba(230, 209, 148, 0.8)'}}>Monitoreo Continuo</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2" style={{color: '#e6d194'}}>100+</div>
              <div style={{color: 'rgba(230, 209, 148, 0.8)'}}>Puntos de Medición</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 text-white" style={{backgroundColor: '#161a1d'}}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6" style={{color: '#e6d194'}}>Únete al Esfuerzo de Restauración</h2>
          <p className="text-xl mb-8" style={{color: '#98989A'}}>
            Forma parte de la red de colaboración más grande para el saneamiento de la cuenca Lerma-Chapala-Santiago.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary text-white px-8 py-4 rounded-xl font-semibold shadow-lg">
              Registrar Institución
            </button>
            <button className="border-2 px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg" style={{borderColor: '#98989A', color: '#98989A'}} onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(152, 152, 154, 0.1)'} onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
              Acceder como Ciudadano
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6" style={{backgroundColor: '#002f2a', color: '#98989A'}}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{background: 'linear-gradient(135deg, #1e5b4f, #161a1d)'}}>
                  <Droplets className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-semibold" style={{color: '#e6d194'}}>Cuenca Hub</span>
              </div>
              <p className="text-sm" style={{color: '#98989A'}}>Plataforma tecnológica para el saneamiento y restauración de la cuenca Lerma-Chapala-Santiago.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3" style={{color: '#e6d194'}}>Plataforma</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="transition-colors" style={{color: '#98989A'}} onMouseEnter={(e) => e.target.style.color = '#a57f2c'} onMouseLeave={(e) => e.target.style.color = '#98989A'}>Mapa Interactivo</a></li>
                <li><a href="#" className="transition-colors" style={{color: '#98989A'}} onMouseEnter={(e) => e.target.style.color = '#a57f2c'} onMouseLeave={(e) => e.target.style.color = '#98989A'}>Datos Abiertos</a></li>
                <li><a href="#" className="transition-colors" style={{color: '#98989A'}} onMouseEnter={(e) => e.target.style.color = '#a57f2c'} onMouseLeave={(e) => e.target.style.color = '#98989A'}>Reportes</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3" style={{color: '#e6d194'}}>Colaboración</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="transition-colors" style={{color: '#98989A'}} onMouseEnter={(e) => e.target.style.color = '#a57f2c'} onMouseLeave={(e) => e.target.style.color = '#98989A'}>TECNM</a></li>
                <li><a href="#" className="transition-colors" style={{color: '#98989A'}} onMouseEnter={(e) => e.target.style.color = '#a57f2c'} onMouseLeave={(e) => e.target.style.color = '#98989A'}>Universidades</a></li>
                <li><a href="#" className="transition-colors" style={{color: '#98989A'}} onMouseEnter={(e) => e.target.style.color = '#a57f2c'} onMouseLeave={(e) => e.target.style.color = '#98989A'}>Municipios</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3" style={{color: '#e6d194'}}>Contacto</h4>
              <ul className="space-y-2 text-sm" style={{color: '#98989A'}}>
                <li>info@cuencahub.mx</li>
                <li>+52 (33) 1234-5678</li>
                <li>Guadalajara, Jalisco</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 text-center text-sm" style={{borderTop: '1px solid #1e5b4f', color: '#98989A'}}>
            <p>&copy; 2024 Cuenca Hub. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
