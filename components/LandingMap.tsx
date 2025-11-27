'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { LatLngExpression } from 'leaflet';
import { AlertTriangle, Droplets, Recycle, Play, MapPin, Calendar, Users } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import ReportIncidentModal from './ReportIncidentModal';

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

export default function LandingMap() {
  const [isClient, setIsClient] = useState(false);
  const [leafletReady, setLeafletReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const [layers, setLayers] = useState<LayerState>({
    alerts: false,
    projects: true,
    stories: false
  });
  const [showReportModal, setShowReportModal] = useState(false);

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

    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
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
    setShowReportModal(true);
  };

  const closeReportModal = () => {
    setShowReportModal(false);
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
                  <div className={`mt-2 px-2 py-1 rounded text-xs font-medium ${zone.level === 'red' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
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
                      <div className={`w-4 h-4 rounded-full`} style={{ backgroundColor: color }}></div>
                      <h3 className="font-bold text-slate-800">{project.name}</h3>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm"><span className="font-medium">Adoptado por:</span> {project.leader}</p>
                      <p className="text-sm text-slate-600">{project.description}</p>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full animate-pulse`} style={{ backgroundColor: color }}></div>
                        <span className="text-xs font-medium" style={{ color: color }}>Tramo Adoptado</span>
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
      <ReportIncidentModal
        isOpen={showReportModal}
        onClose={closeReportModal}
        user={user}
      />
    </div>
  );
}