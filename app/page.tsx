'use client';

import { BarChart3, Eye, Users, Droplets, MapPin, Shield, Zap, Globe } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white sticky top-0 z-50 shadow-sm">
        {/* Top institutional bar */}
        <div className="bg-charcoal py-2">
          <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-xs text-cream">
            <span>Gobierno de México | Tecnológico Nacional de México</span>
            <span>gob.mx</span>
          </div>
        </div>
        
        {/* Main header */}
        <div className="border-b-4 border-primary">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo section */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
                    <Droplets className="w-8 h-8 text-white" />
                  </div>
                  <div className="border-l-2 border-neutral pl-4">
                    <div className="text-2xl font-bold text-foreground tracking-tight">Cuenca Hub</div>
                    <div className="text-sm text-neutral font-medium">Sistema Nacional de Monitoreo Hídrico</div>
                  </div>
                </div>
              </div>
              
              {/* Navigation */}
              <nav className="hidden lg:flex items-center space-x-8">
                <a href="#inicio" className="px-4 py-2 text-foreground hover:bg-primary hover:bg-opacity-5 rounded-md transition-all font-medium">Inicio</a>
                <a href="#plataforma" className="px-4 py-2 text-foreground hover:bg-primary hover:bg-opacity-5 rounded-md transition-all font-medium">Plataforma</a>
                <a href="#datos" className="px-4 py-2 text-foreground hover:bg-primary hover:bg-opacity-5 rounded-md transition-all font-medium">Datos Abiertos</a>
                <a href="#colaboracion" className="px-4 py-2 text-foreground hover:bg-primary hover:bg-opacity-5 rounded-md transition-all font-medium">Colaboración</a>
                <div className="w-px h-6 bg-neutral opacity-30"></div>
                <button className="bg-primary text-white px-6 py-2 rounded-md font-semibold hover:bg-opacity-90 transition-all">
                  Acceso Institucional
                </button>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-32 px-6" style={{background: 'linear-gradient(135deg, var(--color-cream) 0%, color-mix(in srgb, var(--color-cream) 30%, transparent) 50%, #f8fafc 100%)'}}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-5xl mx-auto">
            <div className="mb-8">
              <span className="inline-block text-sm font-semibold px-4 py-2 rounded-full mb-4 uppercase tracking-wide text-primary" style={{backgroundColor: 'color-mix(in srgb, var(--color-teal) 10%, transparent)'}}>
                Iniciativa Nacional
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-12 leading-tight text-foreground">
              <span className="block text-primary">Cuenca Lerma-Chapala-Santiago</span>
            </h1>
            <p className="text-xl mb-12 leading-relaxed max-w-3xl mx-auto font-medium text-foreground">
              Sistema integral de monitoreo, coordinación y gestión para la restauración 
              de la cuenca hídrica más estratégica del país.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary px-10 py-4 rounded-lg font-semibold shadow-lg text-sm uppercase tracking-wide">
                Acceder a la Plataforma
              </button>
              <button className="border-2 border-primary text-primary px-10 py-4 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg text-sm uppercase tracking-wide hover:bg-primary hover:bg-opacity-5">
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
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Capacidades del Sistema</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Infraestructura tecnológica para el monitoreo y coordinación ambiental</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Visualización */}
            <div className="p-10 rounded-lg border-l-4 border-primary card-hover" style={{backgroundColor: 'color-mix(in srgb, var(--color-cream) 10%, transparent)'}}>
              <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mb-6">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 uppercase tracking-wide text-foreground">Visualización</h3>
              <p className="leading-relaxed text-foreground">Mapas interactivos e indicadores ambientales en tiempo real.</p>
            </div>

            {/* Monitoreo */}
            <div className="p-10 rounded-lg border-l-4 border-accent card-hover" style={{backgroundColor: 'color-mix(in srgb, var(--color-cream) 10%, transparent)'}}>
              <div className="w-16 h-16 rounded-lg flex items-center justify-center mb-6" style={{backgroundColor: 'var(--color-gold)'}}>
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 uppercase tracking-wide text-foreground">Monitoreo</h3>
              <p className="leading-relaxed text-foreground">Sensores IoT, alertas tempranas y reportes ciudadanos.</p>
            </div>

            {/* Colaboración */}
            <div className="p-10 rounded-lg border-l-4 card-hover" style={{backgroundColor: 'color-mix(in srgb, var(--color-cream) 10%, transparent)', borderLeftColor: 'var(--color-burgundy)'}}>
              <div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center mb-6">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 uppercase tracking-wide text-foreground">Colaboración</h3>
              <p className="leading-relaxed text-foreground">Coordinación entre instituciones, gobiernos y organizaciones.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 gradient-bg text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2 text-cream">3</div>
              <div className="text-cream opacity-80">Estados Conectados</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2 text-cream">50+</div>
              <div className="text-cream opacity-80">Municipios Participantes</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2 text-cream">24/7</div>
              <div className="text-cream opacity-80">Monitoreo Continuo</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2 text-cream">100+</div>
              <div className="text-cream opacity-80">Puntos de Medición</div>
            </div>
          </div>
        </div>
      </section>

      {/* Comunicación Social Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">Conectando con la Cuenca</h2>
            <p className="text-xl text-neutral max-w-3xl mx-auto">Narrativas que sensibilizan y movilizan a la ciudadanía hacia la restauración ambiental</p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Video principal */}
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center relative overflow-hidden group cursor-pointer card-hover">
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                <div className="relative z-10 text-center text-white">
                  <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4 mx-auto backdrop-blur-sm">
                    <div className="w-0 h-0 border-l-8 border-l-white border-t-6 border-t-transparent border-b-6 border-b-transparent ml-1"></div>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Voces de la Cuenca</h3>
                  <p className="text-cream opacity-90">Historias de comunidades que transforman su entorno</p>
                </div>
              </div>
            </div>
            
            {/* Storytelling cards */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4 p-6 rounded-xl" style={{backgroundColor: 'color-mix(in srgb, var(--color-cream) 15%, transparent)'}}>
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-2">Testimonios Ciudadanos</h4>
                  <p className="text-neutral text-sm">Historias reales de impacto y transformación comunitaria</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-6 rounded-xl" style={{backgroundColor: 'color-mix(in srgb, var(--color-cream) 15%, transparent)'}}>
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-2">Infografías Interactivas</h4>
                  <p className="text-neutral text-sm">Datos ambientales visualizados para fácil comprensión</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-6 rounded-xl" style={{backgroundColor: 'color-mix(in srgb, var(--color-cream) 15%, transparent)'}}>
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-2">Campañas Digitales</h4>
                  <p className="text-neutral text-sm">Contenido multimedia para redes sociales y medios</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Call to action para contenido */}
          <div className="text-center">
            <Link href="/comunicacion-social" className="inline-block bg-secondary text-white px-8 py-4 rounded-xl font-semibold hover:bg-opacity-90 transition-all shadow-lg">
              Explorar Contenido Multimedia
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 text-white bg-charcoal">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-cream">Únete al Esfuerzo de Restauración</h2>
          <p className="text-xl mb-8 text-neutral">
            Forma parte de la red de colaboración para el saneamiento de la cuenca.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary px-8 py-4 rounded-xl font-semibold shadow-lg">
              Registrar Institución
            </button>
            <button className="border-2 border-neutral text-neutral px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:bg-neutral hover:bg-opacity-10">
              Acceder como Ciudadano
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-dark-teal text-neutral">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{background: 'linear-gradient(135deg, var(--color-teal), var(--color-charcoal))'}}>
                  <Droplets className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-semibold text-cream">Cuenca Hub</span>
              </div>
              <p className="text-sm text-neutral">Plataforma tecnológica para el saneamiento y restauración de la cuenca Lerma-Chapala-Santiago.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-cream">Plataforma</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-neutral hover:text-accent transition-colors">Mapa Interactivo</a></li>
                <li><a href="#" className="text-neutral hover:text-accent transition-colors">Datos Abiertos</a></li>
                <li><a href="#" className="text-neutral hover:text-accent transition-colors">Reportes</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-cream">Colaboración</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-neutral hover:text-accent transition-colors">TECNM</a></li>
                <li><a href="#" className="text-neutral hover:text-accent transition-colors">Universidades</a></li>
                <li><a href="#" className="text-neutral hover:text-accent transition-colors">Municipios</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-cream">Contacto</h4>
              <ul className="space-y-2 text-sm text-neutral">
                <li>info@cuencahub.mx</li>
                <li>+52 (33) 1234-5678</li>
                <li>Guadalajara, Jalisco</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 text-center text-sm border-t text-neutral" style={{borderTopColor: 'var(--color-teal)'}}>
            <p>&copy; 2025 Cuenca Hub. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
