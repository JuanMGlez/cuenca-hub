'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { LatLngExpression } from 'leaflet';
import { AlertTriangle, Droplets, Recycle, Play, MapPin, Calendar, Users, X, Upload, Camera } from 'lucide-react';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Polygon = dynamic(() => import('react-leaflet').then(mod => mod.Polygon), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

interface AlertZone {
  id: string;
  name: string;
  position: LatLngExpression;
  level: 'red' | 'yellow';
  description: string;
}

interface Project {
  id: string;
  name: string;
  position: LatLngExpression;
  leader: string;
  description: string;
  status: 'active' | 'completed';
  polygon?: LatLngExpression[];
  type?: 'adopted' | 'regular';
}

interface Story {
  id: string;
  name: string;
  position: LatLngExpression;
  type: 'video' | 'sensor';
  content: string;
}

interface LayerState {
  alerts: boolean;
  projects: boolean;
  stories: boolean;
}

interface ReportForm {
  location: {
    lat: number;
    lng: number;
    reference: string;
    municipality: string;
  };
  incident: {
    type: string;
    urgency: 'info' | 'caution' | 'emergency';
    evidence: File | null;
  };
  measurements: {
    hasSensor: boolean;
    ph?: number;
    temperature?: number;
    turbidity?: number;
  };
  narrative: {
    description: string;
    impact: string;
  };
}

export default function LandingMap() {
  const [isClient, setIsClient] = useState(false);
  const [leafletReady, setLeafletReady] = useState(false);
  const [layers, setLayers] = useState<LayerState>({
    alerts: false,
    projects: true,
    stories: false
  });
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportForm, setReportForm] = useState<ReportForm>({
    location: { lat: 0, lng: 0, reference: '', municipality: '' },
    incident: { type: '', urgency: 'info', evidence: null },
    measurements: { hasSensor: false },
    narrative: { description: '', impact: '' }
  });

  useEffect(() => {
    setIsClient(true);
    
    const loadLeaflet = async () => {
      if (typeof window !== 'undefined') {
        const L = await import('leaflet');
        (window as any).L = L.default || L;
        setLeafletReady(true);
      }
    };
    
    loadLeaflet();
  }, []);

  const createIcon = (color: string, emoji: string) => {
    if (typeof window !== 'undefined' && (window as any).L) {
      return (window as any).L.divIcon({
        html: `<div style="background: ${color}; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3); font-size: 14px;">${emoji}</div>`,
        className: 'custom-marker',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });
    }
    return undefined;
  };

  const center: LatLngExpression = [20.2, -102.8];

  const alertZones: AlertZone[] = [
    {
      id: '1',
      name: 'Zona Crítica Río Lerma',
      position: [19.29, -99.66],
      level: 'red',
      description: '☠️ Descarga tóxica detectada - No pescar'
    },
    {
      id: '2',
      name: 'Precaución Lago Chapala',
      position: [20.30, -103.25],
      level: 'yellow',
      description: '⚠️ Niveles altos de turbidez'
    },
    {
      id: '3',
      name: 'Alerta Río Santiago',
      position: [20.66, -103.35],
      level: 'red',
      description: '🐟 Mortandad de peces reportada'
    },
    {
      id: '4',
      name: 'Monitoreo Presa Solís',
      position: [20.42, -101.83],
      level: 'yellow',
      description: '🗑️ Residuos sólidos flotantes'
    }
  ];

  const projects: Project[] = [
    {
      id: '1',
      name: 'Restauración Ribereña TECNM',
      position: [20.2967, -103.2442],
      leader: 'TECNM Chapala',
      description: '🌱 Reforestación con 500 árboles nativos',
      status: 'active'
    },
    {
      id: '2',
      name: 'Planta de Tratamiento Toluca',
      position: [19.2889, -99.6561],
      leader: 'Gobierno del Estado de México',
      description: '🏭 Tratamiento de 2,000 L/s de aguas residuales',
      status: 'active'
    },
    {
      id: '3',
      name: 'Tramo Adoptado Nestlé - Ocotlán Norte',
      position: [20.356937351033654, -102.78653813057251],
      leader: 'Nestlé México',
      description: '🏢 Adopción corporativa: 2.5 km de ribera cerca de Ocotlán',
      status: 'active',
      type: 'adopted',
      polygon: [
        [20.356937351033654, -102.78653813057251],
        [20.3555, -102.7855],
        [20.3540, -102.7845],
        [20.3525, -102.7835],
        [20.3510, -102.7830],
        [20.3498955703998, -102.78276225400245],
        [20.3500, -102.7825],
        [20.3515, -102.7828],
        [20.3530, -102.7833],
        [20.3545, -102.7843],
        [20.3560, -102.7853],
        [20.356937351033654, -102.78653813057251]
      ]
    },
    {
      id: '4',
      name: 'Tramo Adoptado TECNM - Ocotlán Sur',
      position: [20.374713532523312, -102.79848139245937],
      leader: 'TECNM Ocotlán',
      description: '🎓 Adopción académica: 1.8 km con monitoreo estudiantil',
      status: 'active',
      type: 'adopted',
      polygon: [
        [20.374713532523312, -102.79848139245937],
        [20.3720, -102.7970],
        [20.3695, -102.7955],
        [20.3670, -102.7940],
        [20.3650, -102.7920],
        [20.363247745192254, -102.78776939479862],
        [20.3635, -102.7875],
        [20.3655, -102.7918],
        [20.3675, -102.7938],
        [20.3700, -102.7953],
        [20.3725, -102.7968],
        [20.374713532523312, -102.79848139245937]
      ]
    },
    {
      id: '5',
      name: 'Bioremediación Universidad Guadalajara',
      position: [20.6597, -103.3496],
      leader: 'UdeG - Centro Universitario',
      description: '🔬 Tratamiento biológico de contaminantes',
      status: 'active'
    },
    {
      id: '6',
      name: 'Monitoreo IoT CONACYT',
      position: [20.2167, -101.1333],
      leader: 'CONACYT - Proyecto Nacional',
      description: '📡 Red de 15 sensores inteligentes',
      status: 'active'
    },
    {
      id: '7',
      name: 'Humedales Artificiales Michoacán',
      position: [19.7, -101.2],
      leader: 'Gobierno de Michoacán',
      description: '🌿 Construcción de 3 humedales de tratamiento',
      status: 'active'
    }
  ];

  const stories: Story[] = [
    {
      id: '1',
      name: 'Testimonio Pescador Local',
      position: [20.2967, -103.2442],
      type: 'video',
      content: '🎣 "Antes no había peces, ahora regresan"'
    },
    {
      id: '2',
      name: 'Sensor IoT pH',
      position: [19.2889, -99.6561],
      type: 'sensor',
      content: '📊 pH: 7.2 (Estable) - Actualizado hace 5 min'
    },
    {
      id: '3',
      name: 'Historia Familia Ribereña',
      position: [20.4167, -101.8333],
      type: 'video',
      content: '👨👩👧👦 "Nuestros hijos ya pueden jugar en el río"'
    },
    {
      id: '4',
      name: 'Sensor Turbidez',
      position: [20.6597, -103.3496],
      type: 'sensor',
      content: '🌊 Turbidez: 12 NTU (Mejorado 40%)'
    },
    {
      id: '5',
      name: 'Testimonio Estudiante TECNM',
      position: [20.2167, -101.1333],
      type: 'video',
      content: '🎓 "Mi tesis ayudó a limpiar 2 km de río"'
    },
    {
      id: '6',
      name: 'Sensor Oxígeno Disuelto',
      position: [19.7, -101.2],
      type: 'sensor',
      content: '💨 O₂: 8.5 mg/L (Excelente para vida acuática)'
    }
  ];

  const toggleLayer = (layer: keyof LayerState) => {
    setLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  const openReportModal = () => {
    // Obtener geolocalización automática
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setReportForm(prev => ({
            ...prev,
            location: {
              ...prev.location,
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          }));
        },
        (error) => {
          console.log('Error obteniendo ubicación:', error);
        }
      );
    }
    setShowReportModal(true);
  };

  const closeReportModal = () => {
    setShowReportModal(false);
    // Resetear formulario
    setReportForm({
      location: { lat: 0, lng: 0, reference: '', municipality: '' },
      incident: { type: '', urgency: 'info', evidence: null },
      measurements: { hasSensor: false },
      narrative: { description: '', impact: '' }
    });
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Reporte enviado:', reportForm);
    // Aquí se enviaría el reporte al backend
    alert('¡Reporte enviado exitosamente!');
    closeReportModal();
  };

  const updateReportForm = (section: keyof ReportForm, field: string, value: any) => {
    setReportForm(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  if (!isClient || !leafletReady) {
    return (
      <div className="w-full h-[600px] bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#9b2247] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando mapa de la cuenca...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl z-10">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      
      <MapContainer center={center} zoom={8} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        
        {/* Alertas y Riesgos */}
        {layers.alerts && alertZones.map((zone) => {
          const icon = createIcon(
            zone.level === 'red' ? '#ef4444' : '#f59e0b',
            zone.level === 'red' ? '⚠️' : '⚡'
          );
          return (
            <Marker key={zone.id} position={zone.position} icon={icon}>
              <Popup>
                <div className="p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className={`w-4 h-4 rounded-full ${zone.level === 'red' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                    <h3 className="font-bold text-slate-800">{zone.name}</h3>
                  </div>
                  <p className="text-sm text-slate-600">{zone.description}</p>
                  <div className={`mt-2 px-2 py-1 rounded text-xs font-medium ${
                    zone.level === 'red' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {zone.level === 'red' ? '🔴 Zona Roja' : '🟡 Zona Amarilla'}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Proyectos de Restauración */}
        {layers.projects && projects.map((project) => {
          if (project.type === 'adopted' && project.polygon) {
            // Tramos adoptados como polígonos
            const color = project.name.includes('Nestlé') ? '#0066cc' : '#ff6600';
            return (
              <Polygon
                key={project.id}
                positions={project.polygon}
                pathOptions={{
                  color: color,
                  fillColor: color,
                  fillOpacity: 0.7,
                  weight: 4
                }}
              >
                <Popup>
                  <div className="p-3 min-w-[200px]">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className={`w-4 h-4 rounded-full`} style={{backgroundColor: color}}></div>
                      <h3 className="font-bold text-slate-800">{project.name}</h3>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm"><span className="font-medium">Adoptado por:</span> {project.leader}</p>
                      <p className="text-sm text-slate-600">{project.description}</p>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full animate-pulse`} style={{backgroundColor: color}}></div>
                        <span className="text-xs font-medium" style={{color: color}}>Tramo Adoptado</span>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Polygon>
            );
          } else {
            // Proyectos regulares como markers
            const icon = createIcon('#10b981', '🌱');
            return (
              <Marker key={project.id} position={project.position} icon={icon}>
                <Popup>
                  <div className="p-3 min-w-[200px]">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-4 h-4 rounded-full bg-green-500"></div>
                      <h3 className="font-bold text-[#1e5b4f]">{project.name}</h3>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm"><span className="font-medium">Líder:</span> {project.leader}</p>
                      <p className="text-sm text-slate-600">{project.description}</p>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-xs font-medium text-green-700">Proyecto Activo</span>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          }
        })}

        {/* Narrativas y Ciencia Ciudadana */}
        {layers.stories && stories.map((story) => {
          const icon = createIcon(
            story.type === 'video' ? '#9b2247' : '#3b82f6',
            story.type === 'video' ? '▶️' : '📊'
          );
          return (
            <Marker key={story.id} position={story.position} icon={icon}>
              <Popup>
                <div className="p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className={`w-4 h-4 rounded-full ${story.type === 'video' ? 'bg-[#9b2247]' : 'bg-blue-500'}`}></div>
                    <h3 className="font-bold text-slate-800">{story.name}</h3>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{story.content}</p>
                  {story.type === 'video' && (
                    <button className="text-xs bg-[#9b2247] text-white px-2 py-1 rounded hover:bg-[#611232] transition-colors">
                      ▷ Reproducir Historia
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Controles de Capas */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg z-[1001]">
        <h3 className="text-sm font-bold text-slate-700 mb-3">Capas del Mapa</h3>
        <div className="space-y-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={layers.alerts}
              onChange={() => toggleLayer('alerts')}
              className="rounded border-slate-300"
            />
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm font-medium">Alertas y Riesgos</span>
          </label>
          
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={layers.projects}
              onChange={() => toggleLayer('projects')}
              className="rounded border-slate-300"
            />
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium">Proyectos Activos</span>
          </label>
          
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={layers.stories}
              onChange={() => toggleLayer('stories')}
              className="rounded border-slate-300"
            />
            <div className="w-3 h-3 bg-[#9b2247] rounded-full"></div>
            <span className="text-sm font-medium">Historias y Sensores</span>
          </label>
        </div>
      </div>

      {/* Botón de Acción Rápida */}
      <div className="absolute bottom-4 right-4 z-[1001]">
        <button 
          onClick={openReportModal}
          className="bg-gradient-to-r from-[#9b2247] to-[#611232] text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2"
        >
          <MapPin className="w-4 h-4" />
          <span className="font-medium">¿Estás aquí? ¡Reporta!</span>
        </button>
      </div>

      {/* Información de Adopción */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg z-[1001] max-w-xs">
        <div className="flex items-center space-x-2 mb-2">
          <Users className="w-4 h-4 text-[#1e5b4f]" />
          <span className="text-sm font-bold text-slate-700">Adopta un Tramo</span>
        </div>
        <p className="text-xs text-slate-600 mb-2">14 tramos adoptados, 6 disponibles</p>
        <div className="text-xs text-slate-500 mb-2">
          <div className="flex items-center space-x-1 mb-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Nestlé - Ocotlán Norte</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>TECNM - Ocotlán Sur</span>
          </div>
        </div>
        <button className="text-xs bg-[#1e5b4f] text-white px-3 py-1 rounded hover:bg-[#002f2a] transition-colors">
          Ver Disponibles
        </button>
      </div>

      {/* Modal de Reporte */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[2000] p-4 pt-20">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl w-full max-w-4xl shadow-[0_32px_64px_rgba(22,26,29,0.15)] transform transition-all duration-500 ease-out scale-100 max-h-[70vh] flex flex-col border border-[#98989A]/20 ring-1 ring-white/50">
            {/* Header */}
            <div className="rounded-t-3xl p-6 bg-gradient-to-br from-white via-[#e6d194]/5 to-white/90 border-b border-[#98989A]/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-[#1e5b4f] to-[#002f2a] rounded-2xl shadow-lg">
                    <MapPin className="w-6 h-6 text-[#e6d194]" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-[#161a1d] tracking-tight">Reportar Incidente</h2>
                    <p className="text-[#98989A] text-sm font-medium">Ayuda a proteger nuestra cuenca</p>
                  </div>
                </div>
                <button onClick={closeReportModal} className="p-3 hover:bg-[#98989A]/10 rounded-2xl transition-all duration-300 group border border-[#98989A]/20">
                  <X className="w-5 h-5 text-[#161a1d] group-hover:rotate-90 transition-transform duration-300" />
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 bg-gradient-to-br from-white via-[#e6d194]/5 to-white/90">

              <form onSubmit={handleSubmitReport} className="space-y-8">
                {/* 1. Ubicación */}
                <div className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#1e5b4f] to-[#a57f2c] rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
                  <div className="relative bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-[#98989A]/20 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="p-3 bg-gradient-to-br from-[#1e5b4f] to-[#002f2a] rounded-2xl shadow-lg">
                        <MapPin className="w-6 h-6 text-[#e6d194]" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-[#161a1d] tracking-tight">Ubicación del Incidente</h3>
                        <p className="text-[#98989A] text-sm font-medium">Especifica dónde ocurrió el problema</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-[#161a1d] mb-3 flex items-center">
                          <div className="w-2 h-2 bg-[#1e5b4f] rounded-full mr-2"></div>
                          Coordenadas GPS
                        </label>
                        <div className="relative">
                          <input 
                            type="text" 
                            value={`${reportForm.location.lat.toFixed(6)}, ${reportForm.location.lng.toFixed(6)}`}
                            readOnly
                            className="w-full p-4 bg-gradient-to-r from-[#e6d194]/10 to-[#a57f2c]/5 border-2 border-[#a57f2c]/30 rounded-2xl text-sm font-mono text-[#161a1d] focus:outline-none shadow-inner"
                          />
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div className="w-2 h-2 bg-[#1e5b4f] rounded-full animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-[#161a1d] mb-3 flex items-center">
                          <div className="w-2 h-2 bg-[#9b2247] rounded-full mr-2"></div>
                          Municipio/Zona
                        </label>
                        <select 
                          value={reportForm.location.municipality}
                          onChange={(e) => updateReportForm('location', 'municipality', e.target.value)}
                          className="w-full p-4 bg-white/90 border-2 border-[#98989A]/30 rounded-2xl text-sm text-[#161a1d] focus:border-[#9b2247] focus:outline-none focus:ring-4 focus:ring-[#9b2247]/10 transition-all duration-300 shadow-sm hover:shadow-md"
                          required
                        >
                        <option value="">Seleccionar...</option>
                        <option value="Chapala">Chapala</option>
                        <option value="Ocotlán">Ocotlán</option>
                        <option value="Toluca">Toluca</option>
                        <option value="Guadalajara">Guadalajara</option>
                        <option value="León">León</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-6">
                    <label className="block text-sm font-bold text-[#161a1d] mb-3 flex items-center">
                      <div className="w-2 h-2 bg-[#a57f2c] rounded-full mr-2"></div>
                      Referencia Visual
                    </label>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Ej: Frente a la escuela primaria, cerca del puente..."
                        value={reportForm.location.reference}
                        onChange={(e) => updateReportForm('location', 'reference', e.target.value)}
                        className="w-full p-4 bg-white/90 border-2 border-[#98989A]/30 rounded-2xl text-sm text-[#161a1d] focus:border-[#a57f2c] focus:outline-none focus:ring-4 focus:ring-[#a57f2c]/10 transition-all duration-300 shadow-sm hover:shadow-md placeholder:text-[#98989A]"
                        required
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#98989A]">
                        📍
                      </div>
                    </div>
                  </div>
                </div>
              </div>

                {/* 2. Diagnóstico Visual */}
                <div className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#9b2247] to-[#611232] rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
                  <div className="relative bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-[#98989A]/20 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="p-3 bg-gradient-to-br from-[#9b2247] to-[#611232] rounded-2xl shadow-lg">
                        <AlertTriangle className="w-6 h-6 text-[#e6d194]" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-[#161a1d] tracking-tight">Diagnóstico Visual</h3>
                        <p className="text-[#98989A] text-sm font-medium">Describe el problema observado</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-[#161a1d] mb-3 flex items-center">
                          <div className="w-2 h-2 bg-[#9b2247] rounded-full mr-2"></div>
                          Tipo de Incidente
                        </label>
                        <select 
                          value={reportForm.incident.type}
                          onChange={(e) => updateReportForm('incident', 'type', e.target.value)}
                          className="w-full p-4 bg-white/90 border-2 border-[#98989A]/30 rounded-2xl text-sm text-[#161a1d] focus:border-[#9b2247] focus:outline-none focus:ring-4 focus:ring-[#9b2247]/10 transition-all duration-300 shadow-sm hover:shadow-md"
                          required
                        >
                        <option value="">Seleccionar...</option>
                        <option value="descarga_residual">Descarga de agua residual</option>
                        <option value="basura">Basura acumulada / Obstrucción</option>
                        <option value="olor">Olor ofensivo / Gases</option>
                        <option value="mortandad">Mortandad de peces o fauna</option>
                        <option value="coloracion">Cambio de coloración drástico</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-[#161a1d] mb-3 flex items-center">
                        <div className="w-2 h-2 bg-[#611232] rounded-full mr-2"></div>
                        Nivel de Urgencia
                      </label>
                      <select 
                        value={reportForm.incident.urgency}
                        onChange={(e) => updateReportForm('incident', 'urgency', e.target.value)}
                        className="w-full p-4 bg-white/90 border-2 border-[#98989A]/30 rounded-2xl text-sm text-[#161a1d] focus:border-[#611232] focus:outline-none focus:ring-4 focus:ring-[#611232]/10 transition-all duration-300 shadow-sm hover:shadow-md"
                      >
                        <option value="info">🟢 Informativo</option>
                        <option value="caution">🟡 Precaución</option>
                        <option value="emergency">🔴 Emergencia</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-6">
                    <label className="block text-sm font-bold text-[#161a1d] mb-3 flex items-center">
                      <div className="w-2 h-2 bg-[#9b2247] rounded-full mr-2"></div>
                      Evidencia Multimedia
                    </label>
                    <div className="relative group/upload">
                      <div className="border-2 border-dashed border-[#9b2247]/40 rounded-2xl p-8 text-center bg-gradient-to-br from-[#e6d194]/10 via-white/50 to-[#9b2247]/5 hover:from-[#e6d194]/20 hover:to-[#9b2247]/10 transition-all duration-300 group-hover/upload:border-[#9b2247] group-hover/upload:shadow-lg">
                        <div className="flex flex-col items-center space-y-3">
                          <div className="p-4 bg-gradient-to-br from-[#9b2247] to-[#611232] rounded-2xl shadow-lg group-hover/upload:scale-110 transition-transform duration-300">
                            <Camera className="w-8 h-8 text-[#e6d194]" />
                          </div>
                          <div>
                            <p className="text-base font-bold text-[#161a1d] mb-1">Subir evidencia visual</p>
                            <p className="text-sm text-[#98989A]">Foto o video del incidente (Máx. 10MB)</p>
                          </div>
                          <input type="file" accept="image/*,video/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

                {/* 3. Ciencia Ciudadana */}
                <div className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#1e5b4f] to-[#002f2a] rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
                  <div className="relative bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-[#98989A]/20 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="p-3 bg-gradient-to-br from-[#1e5b4f] to-[#002f2a] rounded-2xl shadow-lg">
                        <Droplets className="w-6 h-6 text-[#e6d194]" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-[#161a1d] tracking-tight">Ciencia Ciudadana</h3>
                        <p className="text-[#98989A] text-sm font-medium">Datos técnicos opcionales</p>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          id="hasSensor"
                          checked={reportForm.measurements.hasSensor}
                          onChange={(e) => updateReportForm('measurements', 'hasSensor', e.target.checked)}
                          className="sr-only peer"
                        />
                        <label htmlFor="hasSensor" className="flex items-center space-x-4 p-4 bg-gradient-to-r from-white/90 to-[#e6d194]/10 rounded-2xl border-2 border-[#98989A]/20 cursor-pointer hover:border-[#1e5b4f]/40 peer-checked:border-[#1e5b4f] peer-checked:bg-gradient-to-r peer-checked:from-[#1e5b4f]/5 peer-checked:to-[#002f2a]/5 transition-all duration-300 group/checkbox">
                          <div className="relative">
                            <div className={`w-6 h-6 border-2 rounded-lg transition-all duration-300 flex items-center justify-center ${
                              reportForm.measurements.hasSensor 
                                ? 'bg-[#1e5b4f] border-[#1e5b4f]' 
                                : 'bg-white border-[#98989A]'
                            }`}>
                              {reportForm.measurements.hasSensor && (
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                          </div>
                          <div className="flex-1">
                            <p className="text-base font-bold text-[#161a1d] group-hover/checkbox:text-[#1e5b4f] transition-colors">¿Cuentas con un kit de medición?</p>
                            <p className="text-sm text-[#98989A]">Agrega datos técnicos para mayor precisión</p>
                          </div>
                        </label>
                      </div>
                    </div>
                    
                    {reportForm.measurements.hasSensor && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in slide-in-from-top-2 duration-300">
                        <div className="space-y-2">
                          <label className="block text-sm font-bold text-[#161a1d] mb-2 flex items-center">
                            <div className="w-2 h-2 bg-[#1e5b4f] rounded-full mr-2"></div>
                            pH
                          </label>
                          <input 
                            type="number" 
                            step="0.1" 
                            min="0" 
                            max="14"
                            value={reportForm.measurements.ph || ''}
                            onChange={(e) => updateReportForm('measurements', 'ph', parseFloat(e.target.value))}
                            className="w-full p-3 bg-white/90 border-2 border-[#98989A]/30 rounded-xl text-sm text-[#161a1d] focus:border-[#1e5b4f] focus:outline-none focus:ring-4 focus:ring-[#1e5b4f]/10 transition-all duration-300 shadow-sm hover:shadow-md"
                            placeholder="7.0"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-bold text-[#161a1d] mb-2 flex items-center">
                            <div className="w-2 h-2 bg-[#002f2a] rounded-full mr-2"></div>
                            Temperatura (°C)
                          </label>
                          <input 
                            type="number" 
                            step="0.1"
                            value={reportForm.measurements.temperature || ''}
                            onChange={(e) => updateReportForm('measurements', 'temperature', parseFloat(e.target.value))}
                            className="w-full p-3 bg-white/90 border-2 border-[#98989A]/30 rounded-xl text-sm text-[#161a1d] focus:border-[#002f2a] focus:outline-none focus:ring-4 focus:ring-[#002f2a]/10 transition-all duration-300 shadow-sm hover:shadow-md"
                            placeholder="25.0"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-bold text-[#161a1d] mb-2 flex items-center">
                            <div className="w-2 h-2 bg-[#a57f2c] rounded-full mr-2"></div>
                            Turbidez (NTU)
                          </label>
                          <input 
                            type="number" 
                            step="0.1" 
                            min="0"
                            value={reportForm.measurements.turbidity || ''}
                            onChange={(e) => updateReportForm('measurements', 'turbidity', parseFloat(e.target.value))}
                            className="w-full p-3 bg-white/90 border-2 border-[#98989A]/30 rounded-xl text-sm text-[#161a1d] focus:border-[#a57f2c] focus:outline-none focus:ring-4 focus:ring-[#a57f2c]/10 transition-all duration-300 shadow-sm hover:shadow-md"
                            placeholder="10.0"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 4. Narrativa */}
                <div className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#a57f2c] to-[#e6d194] rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
                  <div className="relative bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-[#98989A]/20 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="p-3 bg-gradient-to-br from-[#a57f2c] to-[#e6d194] rounded-2xl shadow-lg">
                        <Users className="w-6 h-6 text-[#161a1d]" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-[#161a1d] tracking-tight">Narrativa Comunitaria</h3>
                        <p className="text-[#98989A] text-sm font-medium">Cuenta tu experiencia y el impacto</p>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-[#161a1d] mb-3 flex items-center">
                          <div className="w-2 h-2 bg-[#a57f2c] rounded-full mr-2"></div>
                          Descripción del problema
                        </label>
                        <textarea 
                          value={reportForm.narrative.description}
                          onChange={(e) => updateReportForm('narrative', 'description', e.target.value)}
                          className="w-full p-4 bg-white/90 border-2 border-[#98989A]/30 rounded-2xl text-sm text-[#161a1d] focus:border-[#a57f2c] focus:outline-none focus:ring-4 focus:ring-[#a57f2c]/10 transition-all duration-300 shadow-sm hover:shadow-md resize-none placeholder:text-[#98989A]"
                          placeholder="Describe detalladamente qué estás observando..."
                          rows={4}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-[#161a1d] mb-3 flex items-center">
                          <div className="w-2 h-2 bg-[#e6d194] rounded-full mr-2"></div>
                          Impacto en la comunidad
                        </label>
                        <textarea 
                          value={reportForm.narrative.impact}
                          onChange={(e) => updateReportForm('narrative', 'impact', e.target.value)}
                          className="w-full p-4 bg-white/90 border-2 border-[#98989A]/30 rounded-2xl text-sm text-[#161a1d] focus:border-[#e6d194] focus:outline-none focus:ring-4 focus:ring-[#e6d194]/20 transition-all duration-300 shadow-sm hover:shadow-md resize-none placeholder:text-[#98989A]"
                          placeholder="Ej: Ya no podemos pescar, afecta la salud de los niños, huele mal en la escuela..."
                          rows={4}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botones */}
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-8 border-t border-gradient-to-r from-[#98989A]/20 via-[#a57f2c]/20 to-[#98989A]/20">
                  <button 
                    type="button" 
                    onClick={closeReportModal}
                    className="flex-1 group relative overflow-hidden px-8 py-4 bg-white/90 border-2 border-[#98989A]/40 rounded-2xl hover:border-[#98989A] transition-all duration-300 text-base font-bold text-[#161a1d] hover:bg-[#98989A]/5 shadow-sm hover:shadow-md"
                  >
                    <span className="relative z-10 flex items-center justify-center space-x-2">
                      <span>Cancelar</span>
                    </span>
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-[#1e5b4f] via-[#9b2247] to-[#611232] text-white rounded-2xl hover:shadow-2xl transition-all duration-500 text-base font-bold transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#002f2a] via-[#611232] to-[#161a1d] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <span className="relative z-10 flex items-center justify-center space-x-3">
                      <span>Enviar Reporte</span>
                      <div className="w-2 h-2 bg-[#e6d194] rounded-full animate-pulse"></div>
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}