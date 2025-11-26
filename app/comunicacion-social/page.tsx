'use client';

import { Play, Download, Share2, Eye, Heart, MessageCircle, ArrowLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const MapaCuenca = dynamic(() => import('../../components/MapaCuenca'), { ssr: false });

export default function ComunicacionSocial() {
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);

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
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-charcoal"></div>
        <video
          className="absolute inset-0 w-full h-full object-cover z-0"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/promoHistoria.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/80"></div>

        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            Historias de Cambio
          </h1>
          <p className="text-2xl mb-12 text-cream opacity-90 max-w-2xl mx-auto">
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
            <h2 className="text-4xl font-bold text-foreground mb-6">Súmate a la Acción</h2>
            <p className="text-lg text-foreground max-w-2xl mx-auto">Participa en las iniciativas que están transformando nuestra realidad.</p>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { title: "#CascaronDeHuevo", engagement: "100k", platform: "Todas las redes", span: "md:col-span-" },
              { title: "#CuencaLermaSantiago", engagement: "50K", platform: "Instagram", span: "md:col-span-2" },
              { title: "#RioLerma", engagement: "2k", platform: "X & Linkedin", span: "md:col-span-1" }
            ].map((campaign, index) => (
              <div key={index} className={`bg-gradient-to-br from-primary to-secondary p-8 rounded-2xl text-white text-center group hover:scale-105 transition-transform cursor-pointer ${campaign.span}`}>
                <h3 className="text-2xl font-bold mb-4">{campaign.title}</h3>
                <div className="text-4xl font-bold text-cream mb-2">{campaign.engagement}</div>
                <div className="text-cream opacity-75 mb-6">interacciones</div>
                <div className="text-sm text-cream">{campaign.platform}</div>
                <button className="mt-6 bg-charcoal bg-opacity-80 px-6 py-2 rounded-full text-sm font-semibold hover:bg-opacity-90 transition-all flex items-center space-x-2 mx-auto text-cream">
                  <Share2 className="w-4 h-4" />
                  <span>Compartir</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-6 bg-charcoal text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-cream">Tu Voz Importa</h2>
          <p className="text-xl mb-8 text-cream opacity-90">
            Comparte tu experiencia, accede a recursos y colabora con nosotros.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button className="btn-primary px-8 py-4 rounded-xl font-semibold shadow-lg flex items-center space-x-2">
              <MessageCircle className="w-5 h-5" />
              <span>Comparte tu Historia</span>
            </button>
            <button className="border-2 border-cream text-cream px-8 py-4 rounded-xl font-semibold hover:bg-cream hover:text-charcoal transition-all flex items-center space-x-2">
              <Download className="w-5 h-5" />
              <span>Descargar Recursos</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}