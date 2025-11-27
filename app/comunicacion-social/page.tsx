'use client';

import { Play, Download, Share2, Eye, Heart, MessageCircle, ArrowLeft, ChevronRight, Calendar, Clock, MapPin, ExternalLink, Copy } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const MapaCuenca = dynamic(() => import('../../components/MapaCuenca'), { ssr: false });

export default function ComunicacionSocial() {
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyHashtag = async (hashtag: string, index: number) => {
    try {
      await navigator.clipboard.writeText(hashtag);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  const testimonials = [
    { 
      role: "Hidroquímica", 
      location: "Toluca, Estado de México", 
      views: "267K",
      videoId: "lvKVsmNDXeg",
      videoTitle: "Calidad del Agua"
    },
    { 
      role: "Ecología Acuática", 
      location: "Chapala, Jalisco", 
      views: "189K",
      videoId: "r1A4zwu7ei4",
      videoTitle: "Ecosistemas Acuáticos"
    },
    { 
      role: "Tecnologías Ambientales", 
      location: "Guadalajara, Jalisco", 
      views: "203K",
      videoId: "K81z2yUkOgU",
      videoTitle: "Innovación Verde"
    },
    { 
      role: "Gestión Hídrica", 
      location: "Lerma, Estado de México", 
      views: "234K",
      videoId: "kKypWRsQSVg",
      videoTitle: "Manejo del Agua"
    },
    { 
      role: "Políticas Públicas", 
      location: "Ciudad de México", 
      views: "156K",
      videoId: "qXKTHpbzuXI",
      videoTitle: "Políticas Hídricas"
    },
    { 
      role: "Red de Investigación", 
      location: "Santiago, Nayarit", 
      views: "298K",
      videoId: "RNvURUunJAY",
      videoTitle: "Colaboración Científica"
    }
  ];

  const handleVideoClick = (index: number) => {
    setPlayingVideo(playingVideo === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header simplificado */}
      <header className="bg-white sticky top-0 z-50 shadow-sm border-b border-primary">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 text-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Volver a Cuenca Hub</span>
          </Link>
          <div className="text-sm text-neutral">Comunicación Social</div>
        </div>
      </header>

      {/* Hero Video Inmersivo */}
      <section className="relative h-screen min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-charcoal"></div>
        <video
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/promoHistoria.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/80"></div>

        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-6 sm:mb-8 leading-tight">
            Historias de Cambio
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-8 sm:mb-12 text-cream opacity-90 max-w-2xl mx-auto">
            Descubre cómo la ciencia y la tecnología están recuperando nuestra cuenca.
          </p>
        </div>
      </section>

      {/* Galería de Testimonios */}
      <section className="py-24 px-6 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">

            <h2 className="text-4xl font-bold text-foreground mb-6">Voces de la Comunidad</h2>

            <p className="text-lg text-foreground max-w-2xl mx-auto">Testimonios reales de quienes viven y trabajan por la cuenca</p>

          </div>


          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((person, index) => (
              <div key={index} className="group cursor-pointer" onClick={() => person.videoId && handleVideoClick(index)}>
                <div className="relative aspect-video bg-gradient-to-br from-primary to-charcoal rounded-2xl overflow-hidden mb-4 group-hover:scale-105 transition-transform duration-300">
                  {playingVideo === index && person.videoId ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${person.videoId}?autoplay=1`}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <>
                      {person.videoId ? (
                        <img
                          src={`https://img.youtube.com/vi/${person.videoId}/hqdefault.jpg`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary to-charcoal" />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-opacity-0 group-hover:bg-opacity-90 rounded-full flex items-center justify-center backdrop-blur-sm transition-all" style={{backgroundColor: 'rgba(30, 91, 79, 0)'}}>
                          <Play className="w-6 h-6 text-white group-hover:opacity-100 transition-all ml-1 opacity-0" style={{color: '#1e5b4f'}} />
                        </div>
                      </div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <div className="text-xs bg-black bg-opacity-50 px-2 py-1 rounded">{person.views} vistas</div>
                      </div>
                    </>
                  )}
                </div>
                <h3 className="font-bold text-foreground text-lg">{person.videoTitle}</h3>
                <p className="text-foreground opacity-70 text-sm">{person.location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Infografía Interactiva del Mapa */}
      <section className="py-24 px-6 bg-charcoal">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-cream mb-6">Cuenca Lerma-Chapala-Santiago</h2>
            <p className="text-lg text-cream opacity-90 max-w-2xl mx-auto">Explora las tres zonas críticas de la cuenca</p>
          </div>

          <MapaCuenca />
        </div>
      </section>

      {/* Campañas Digitales */}
      <section className="py-24 px-6" style={{ backgroundColor: 'color-mix(in srgb, var(--color-cream) 15%, transparent)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-foreground mb-6">Tendencias Digitales</h2>
            <p className="text-lg text-foreground max-w-2xl mx-auto">Descubre el impacto de nuestras campañas en redes sociales.</p>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {[
              { title: "#CascaronDeHuevo", engagement: "100k", platform: "Todas las redes", span: "md:col-span-1" },
              { title: "#CuencaLermaSantiago", engagement: "50K", platform: "Instagram & Facebook", span: "md:col-span-2" },
              { title: "#BasuraCero", engagement: "141k", platform: "X & Facebook", span: "md:col-span-1" }
            ].map((campaign, index) => (
              <div key={index} className={`bg-gradient-to-br from-primary to-secondary p-8 rounded-2xl text-white text-center group hover:scale-105 transition-transform cursor-pointer ${campaign.span}`}>
                <h3 className="text-xl font-bold mb-4">{campaign.title}</h3>
                <div className="text-4xl font-bold text-cream mb-2">{campaign.engagement}</div>
                <div className="text-cream opacity-75 mb-6">interacciones</div>
                <div className="text-sm text-cream">{campaign.platform}</div>
                <button 
                  onClick={() => handleCopyHashtag(campaign.title, index)}
                  className="mt-6 bg-charcoal bg-opacity-80 px-6 py-2 rounded-full text-sm font-semibold hover:bg-opacity-90 transition-all flex items-center space-x-2 mx-auto text-white"
                >
                  <Copy className="w-4 h-4" />
                  <span>{copiedIndex === index ? '¡Copiado!' : 'Copiar Hashtag'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Llamado a la Acción - Eventos */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-6" style={{color: '#161a1d'}}>Llamado a la Acción</h2>
            <p className="text-lg max-w-2xl mx-auto" style={{color: '#98989A'}}>Participa en eventos y campañas comunitarias para la saneación de la cuenca.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Organismo Agua y Saneamiento de Toluca",
                date: "6 de Noviembre 2025",
                location: "Toluca, Estado de México",
                description: "Jornada comunitaria de limpieza y reforestación en las riberas del río.",
                socialLink: "https://www.facebook.com/share/p/1AeQyU4SFX/",
                platform: "Facebook"
              },
              {
                title: "Menos Basura, Más Naturaleza",
                date: "6 de Noviembre de 2025",
                location: "Mexico",
                description: "El Gobierno impulsa la limpieza de ríos, caminos y espacios naturales para devolverle vida a nuestro entorno.",
                socialLink: "https://www.facebook.com/share/p/1Bz4HZGUx7/",
                platform: "Facebook"
              },
              {
                title: "Plan de Saneamiento y Restauración Ecológica",
                date: "6 de Noviembre de 2025",
                location: "Estado de México",
                description: "Primera Etapa del Plan de Saneamiento y Restauración Ecológica del Río Lerma-Santiago.",
                socialLink: "https://www.youtube.com/live/vTnUqqrlccw?si=dLIedAZHNPo9kbWv",
                platform: "YouTube"
              }
            ].map((event, index) => (
              <div key={index} className="group">
                <div className="p-8 rounded-2xl border backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px]" style={{backgroundColor: 'rgba(230, 209, 148, 0.1)', borderColor: 'rgba(165, 127, 44, 0.3)'}} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(155, 34, 71, 0.1)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(230, 209, 148, 0.1)'}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{backgroundColor: '#1e5b4f'}}>
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-xs px-3 py-1 rounded-full font-medium" style={{backgroundColor: 'rgba(155, 34, 71, 0.1)', color: '#9b2247'}}>
                      {event.platform}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-4" style={{color: '#161a1d'}}>{event.title}</h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-4 h-4" style={{color: '#a57f2c'}} />
                      <span className="text-sm font-medium" style={{color: '#98989A'}}>{event.date}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-4 h-4" style={{color: '#a57f2c'}} />
                      <span className="text-sm font-medium" style={{color: '#98989A'}}>{event.location}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm leading-relaxed mb-6" style={{color: '#98989A'}}>{event.description}</p>
                  
                  <div className="flex justify-center pt-4 border-t" style={{borderColor: 'rgba(165, 127, 44, 0.2)'}}>
                    <a 
                      href={event.socialLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105"
                      style={{backgroundColor: '#9b2247', color: 'white'}}
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Ver Campaña</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
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