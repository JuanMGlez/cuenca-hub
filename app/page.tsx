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
              <div className="w-12 h-12 rounded-lg flex items-center justify-center shadow-lg" style={{background: 'linear-gradient(135deg, var(--color-teal), var(--color-charcoal))'}}>
                <Droplets className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Cuenca Hub</h1>
                <p className="text-xs font-medium text-neutral">PLATAFORMA OFICIAL</p>
              </div>
              <div className="gov-badge ml-3">TECNM</div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#inicio" className="transition-all duration-300 font-medium text-sm uppercase tracking-wide text-foreground hover:text-primary">Inicio</a>
              <a href="#plataforma" className="transition-all duration-300 font-medium text-sm uppercase tracking-wide text-foreground hover:text-primary">Plataforma</a>
              <a href="#datos" className="transition-all duration-300 font-medium text-sm uppercase tracking-wide text-foreground hover:text-primary">Datos</a>
              <a href="#colaboracion" className="transition-all duration-300 font-medium text-sm uppercase tracking-wide text-foreground hover:text-primary">Colaboración</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 px-6" style={{background: 'linear-gradient(135deg, var(--color-cream) 0%, color-mix(in srgb, var(--color-cream) 30%, transparent) 50%, #f8fafc 100%)'}}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-5xl mx-auto">
            <div className="mb-6">
              <span className="inline-block text-sm font-semibold px-4 py-2 rounded-full mb-4 uppercase tracking-wide text-primary" style={{backgroundColor: 'color-mix(in srgb, var(--color-teal) 10%, transparent)'}}>
                Iniciativa Nacional
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-tight text-foreground">
              Plataforma Nacional de Saneamiento
              <span className="block mt-2 text-primary">Cuenca Lerma-Chapala-Santiago</span>
            </h1>
            <p className="text-xl mb-10 leading-relaxed max-w-3xl mx-auto font-medium text-foreground">
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
            <span className="inline-block bg-slate-100 text-slate-700 text-sm font-semibold px-4 py-2 rounded-full mb-6 uppercase tracking-wide">
              Capacidades Técnicas
            </span>
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Sistema Integral de Gestión</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Infraestructura tecnológica de vanguardia para el monitoreo, análisis y coordinación de acciones ambientales</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Visualización */}
            <div className="p-10 rounded-lg border-l-4 border-primary card-hover" style={{backgroundColor: 'color-mix(in srgb, var(--color-cream) 10%, transparent)'}}>
              <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mb-6">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 uppercase tracking-wide text-foreground">Centro de Datos</h3>
              <p className="leading-relaxed text-foreground">Plataforma centralizada con mapas interactivos, indicadores ambientales y acceso a datos públicos en tiempo real.</p>
            </div>

            {/* Monitoreo */}
            <div className="p-10 rounded-lg border-l-4 border-accent card-hover" style={{backgroundColor: 'color-mix(in srgb, var(--color-cream) 10%, transparent)'}}>
              <div className="w-16 h-16 rounded-lg flex items-center justify-center mb-6" style={{backgroundColor: 'var(--color-gold)'}}>
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 uppercase tracking-wide text-foreground">Monitoreo Continuo</h3>
              <p className="leading-relaxed text-foreground">Red de sensores IoT, sistema de alertas y mecanismos de reporte ciudadano para vigilancia ambiental 24/7.</p>
            </div>

            {/* Colaboración */}
            <div className="p-10 rounded-lg border-l-4 card-hover" style={{backgroundColor: 'color-mix(in srgb, var(--color-cream) 10%, transparent)', borderLeftColor: 'var(--color-burgundy)'}}>
              <div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center mb-6">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 uppercase tracking-wide text-foreground">Red Institucional</h3>
              <p className="leading-relaxed text-foreground">Coordinación entre TECNM, gobiernos, universidades, municipios y organizaciones civiles a nivel nacional.</p>
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

      {/* CTA Section */}
      <section className="py-20 px-6 text-white bg-charcoal">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-cream">Únete al Esfuerzo de Restauración</h2>
          <p className="text-xl mb-8 text-neutral">
            Forma parte de la red de colaboración más grande para el saneamiento de la cuenca Lerma-Chapala-Santiago.
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
            <p>&copy; 2024 Cuenca Hub. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
