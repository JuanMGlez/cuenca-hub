'use client';

import { BarChart3, Eye, Users, Droplets, MapPin, Shield, Zap, Globe, Target, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import LandingMap from '@/components/LandingMap';
import Logo from '@/components/Logo';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white sticky top-0 z-50 shadow-sm">
        {/* Top institutional bar */}
        <div className="bg-charcoal py-2">
          <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-xs text-cream">
            <span>Gobierno del Estado de México | Consejo Mexiquense de Ciencia y Tecnología</span>
            <span>comecyt.edomex.gob.mx</span>
          </div>
        </div>

        {/* Main header */}
        <div className="border-b-4 border-primary">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo section */}
              <Logo variant="header" />

              {/* Navigation */}
              <nav className="hidden lg:flex items-center space-x-2">
                <a href="#inicio" className="px-4 py-2 text-foreground hover:text-primary transition-colors font-medium relative group">
                  <span>Inicio</span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></div>
                </a>
                <a href="#plataforma" className="px-4 py-2 text-foreground hover:text-primary transition-colors font-medium relative group">
                  <span>Plataforma</span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></div>
                </a>
                <a href="#datos" className="px-4 py-2 text-foreground hover:text-primary transition-colors font-medium relative group">
                  <span>Datos Abiertos</span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></div>
                </a>
                <a href="#colaboracion" className="px-4 py-2 text-foreground hover:text-primary transition-colors font-medium relative group">
                  <span>Colaboración</span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></div>
                </a>
                <div className="ml-6 pl-6 border-l border-neutral border-opacity-20">
                  <Link href="/login" className="inline-block bg-primary text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                    Iniciar Sesión
                  </Link>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-32 px-6" style={{ background: 'linear-gradient(135deg, var(--color-cream) 0%, color-mix(in srgb, var(--color-cream) 30%, transparent) 50%, #f8fafc 100%)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-5xl mx-auto">
            <div className="mb-8">
              <span className="inline-block text-sm font-semibold px-4 py-2 rounded-full mb-4 uppercase tracking-wide text-primary" style={{ backgroundColor: 'color-mix(in srgb, var(--color-teal) 10%, transparent)' }}>
                Iniciativa Nacional
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-12 leading-tight text-foreground">
              <span className="block text-primary">Cuenca Lerma-Chapala-Santiago</span>
            </h1>
            <p className="text-xl mb-12 leading-relaxed max-w-3xl mx-auto font-medium text-foreground">
              Uniendo ciencia, tecnología y comunidad para la recuperación integral de la cuenca Lerma-Chapala-Santiago.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login" className="inline-block btn-primary px-10 py-4 rounded-lg font-semibold shadow-lg text-sm uppercase tracking-wide">
                Ingresar a la Plataforma
              </Link>
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
            <div className="p-10 rounded-lg border-l-4 border-primary card-hover" style={{ backgroundColor: 'color-mix(in srgb, var(--color-cream) 10%, transparent)' }}>
              <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mb-6">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 uppercase tracking-wide text-foreground">Ciencia Visible</h3>
              <p className="leading-relaxed text-foreground">Difusión clara y accesible de los avances científicos y su impacto real.</p>
            </div>

            {/* Monitoreo */}
            <div className="p-10 rounded-lg border-l-4 border-accent card-hover" style={{ backgroundColor: 'color-mix(in srgb, var(--color-cream) 10%, transparent)' }}>
              <div className="w-16 h-16 rounded-lg flex items-center justify-center mb-6" style={{ backgroundColor: 'var(--color-gold)' }}>
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 uppercase tracking-wide text-foreground">Tecnología que Une</h3>
              <p className="leading-relaxed text-foreground">Herramientas avanzadas para conectar expertos y coordinar esfuerzos.</p>
            </div>

            {/* Colaboración */}
            <div className="p-10 rounded-lg border-l-4 card-hover" style={{ backgroundColor: 'color-mix(in srgb, var(--color-cream) 10%, transparent)', borderLeftColor: 'var(--color-burgundy)' }}>
              <div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center mb-6">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 uppercase tracking-wide text-foreground">Colaboración Total</h3>
              <p className="leading-relaxed text-foreground">Una red viva de investigadores, instituciones y comunidades trabajando juntos.</p>
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
              <div className="text-cream opacity-80">Estados Unidos por la Cuenca</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2 text-cream">50+</div>
              <div className="text-cream opacity-80">Municipios Activos</div>
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

      {/* Mapa Interactivo Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#9b2247]/10 to-[#1e5b4f]/10 px-4 py-2 rounded-full mb-6">
              <MapPin className="w-4 h-4 text-[#9b2247]" />
              <span className="text-sm font-semibold text-[#9b2247]">Monitoreo en Tiempo Real</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-[#161a1d] mb-6">
              Visualiza el Estado de la{' '}
              <span className="bg-gradient-to-r from-[#9b2247] to-[#1e5b4f] bg-clip-text text-transparent">Cuenca</span>
            </h2>

            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Explora alertas tempranas, proyectos de restauración activos y testimonios de la comunidad
              en nuestro mapa interactivo de la cuenca Lerma-Chapala-Santiago.
            </p>
          </div>

          <div className="relative">
            <div className="h-[600px] w-full relative rounded-2xl overflow-hidden shadow-xl border border-slate-200">
              <LandingMap />
            </div>

            {/* Leyenda */}
            <div className="mt-8 grid md:grid-cols-3 gap-6">
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-white/60 shadow-lg">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                    <Shield className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="font-bold text-slate-800">Sistema de Alerta Temprana</h3>
                </div>
                <p className="text-sm text-slate-600">
                  Zonas de riesgo identificadas con código de colores para proteger la salud pública y el ecosistema.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-white/60 shadow-lg">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <Target className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="font-bold text-slate-800">Proyectos de Restauración</h3>
                </div>
                <p className="text-sm text-slate-600">
                  Iniciativas activas de universidades, ONGs y gobierno trabajando en la recuperación de la cuenca.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-white/60 shadow-lg">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-[#9b2247]/10 rounded-xl flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-[#9b2247]" />
                  </div>
                  <h3 className="font-bold text-slate-800">Ciencia Ciudadana</h3>
                </div>
                <p className="text-sm text-slate-600">
                  Testimonios de la comunidad y datos de sensores IoT que conectan la narrativa científica con la social.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comunicación Social Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">Historias de la Cuenca</h2>
            <p className="text-xl text-neutral max-w-3xl mx-auto">Relatos que inspiran y movilizan hacia la recuperación de nuestro entorno.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16 ">
            {/* Video principal */}
            <div className="relative p-8 rounded-3xl" style={{ backgroundColor: 'color-mix(in srgb, var(--color-cream) 15%, transparent)' }}>
              <div className="aspect-video rounded-2xl overflow-hidden shadow-lg">
                <iframe
                  src="https://www.youtube.com/embed/YSfxNTcpAx8?si=GXyxUC-S1gXfPNfI"
                  title="Voces del Cambio"
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="mt-4 text-center">
                <h3 className="text-2xl font-bold mb-2 text-foreground">Voces del Cambio</h3>
                <p className="text-neutral">Conoce las iniciativas de restauración y conservación en nuestra cuenca</p>
              </div>
            </div>

            {/* Storytelling cards */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4 p-6 rounded-xl" style={{ backgroundColor: 'color-mix(in srgb, var(--color-cream) 15%, transparent)' }}>
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-2">Testimonios Ciudadanos</h4>
                  <p className="text-neutral text-sm">Historias reales de impacto y transformación comunitaria</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-6 rounded-xl" style={{ backgroundColor: 'color-mix(in srgb, var(--color-cream) 15%, transparent)' }}>
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-2">Mapa Cuenca Lerma-Chapala-Santiago</h4>
                  <p className="text-neutral text-sm">Datos ambientales visualizados para fácil comprensión</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-6 rounded-xl" style={{ backgroundColor: 'color-mix(in srgb, var(--color-cream) 15%, transparent)' }}>
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-2">Campañas Digitales</h4>
                  <p className="text-neutral text-sm">Contenido multimedia para redes sociales y medios</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-6 rounded-xl" style={{ backgroundColor: 'color-mix(in srgb, var(--color-cream) 15%, transparent)' }}>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#8B4513' }}>
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-2">Llamado a la Acción</h4>
                  <p className="text-neutral text-sm">Eventos y campañas comunitarias para la saneación activa de la cuenca</p>
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
          <h2 className="text-3xl font-bold mb-6 text-cream">Sé Parte de la Solución</h2>
          <p className="text-xl mb-8 text-neutral">
            Súmate a la red de colaboración y contribuye al saneamiento de nuestra cuenca.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/registro" className="inline-block btn-primary px-8 py-4 rounded-xl font-semibold shadow-lg">
              Registrar Participación
            </Link>
            <Link href="/login" className="inline-block border-2 border-neutral text-neutral px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:bg-neutral hover:bg-opacity-10">
              Acceso Ciudadano
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-dark-teal text-neutral">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8">
            <div>
              <Logo variant="footer" className="mb-4" />
              <p className="text-sm text-neutral text-justify">Plataforma tecnológica para el saneamiento y restauración de la cuenca Lerma-Chapala-Santiago.</p>
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
            <div className="backdrop-blur-sm">
              <Image
                src="/logo/Copernicus_logo.jpg"
                alt="Copernicus Logo"
                width={200}
                height={80}
                className="object-contain mix-blend-multiply"
              />
            </div>
          </div>
          <div className="mt-8 pt-8 text-center text-sm border-t text-neutral" style={{ borderTopColor: 'var(--color-teal)' }}>
            <p>&copy; 2025 Cuenca Hub. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
