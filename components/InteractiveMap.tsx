'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { LatLngExpression } from 'leaflet';
import { supabase } from '@/lib/supabase';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });
const Polygon = dynamic(() => import('react-leaflet').then(mod => mod.Polygon), { ssr: false });
const Circle = dynamic(() => import('react-leaflet').then(mod => mod.Circle), { ssr: false });
const CircleMarker = dynamic(() => import('react-leaflet').then(mod => mod.CircleMarker), { ssr: false });


interface Report {
  id: string;
  location_lat: number;
  location_lng: number;
  municipality: string;
  reference: string;
  incident_type: string;
  urgency: 'info' | 'caution' | 'emergency';
  created_at: string;
  user_id?: string;
  description?: string;
  has_sensor?: boolean;
  ph?: number;
  temperature?: number;
  turbidity?: number;
  image_url?: string;
}

interface InteractiveMapProps {
  activeLayer: string;
  reports?: Report[];
}

export default function InteractiveMap({ activeLayer, reports: propsReports }: InteractiveMapProps) {
  const [isClient, setIsClient] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [loadingReports, setLoadingReports] = useState(true);

  useEffect(() => {
    setIsClient(true);
    if (!propsReports) {
      loadReports();
    }
  }, []);

  useEffect(() => {
    if (propsReports) {
      setReports(propsReports);
      setLoadingReports(false);
    }
  }, [propsReports]);

  useEffect(() => {
    console.log('📈 [MAP] Estado reportes:', { 
      count: reports.length,
      loading: loadingReports,
      activeLayer,
      showingReports: (activeLayer === 'alertas' || activeLayer === 'calidad'),
      reports: reports.slice(0, 3)
    });
  }, [reports, loadingReports, activeLayer]);



  const loadReports = async () => {
    console.log('🔍 [MAP] Iniciando carga de reportes...');
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });
      
      console.log('📊 [MAP] Respuesta Supabase:', { 
        success: !error, 
        error: error?.message, 
        count: data?.length,
        data: data 
      });
      
      if (error) throw error;
      
      console.log(`✅ [MAP] ${data?.length || 0} reportes cargados`);
      setReports(data || []);
    } catch (error: any) {
      console.error('❌ [MAP] Error:', error.message);
      setReports([]);
    } finally {
      setLoadingReports(false);
    }
  };

  const center: LatLngExpression = [20.243854815980665, -103.03774171403178];

  const cuencaData = {
    lagoChapala: { center: [20.243854815980665, -103.03774171403178] as LatLngExpression, radius: 18000 },
    delimitacion: [[19.25, -99.666], [19.25, -100.5], [19.5, -101.5], [20.0, -102.0], [20.3, -103.5], [21.0, -104.5], [21.5, -105.416], [22.0, -105.0], [21.5, -103.5], [21.0, -102.0], [20.5, -101.0], [20.0, -100.0], [19.5, -99.8], [19.25, -99.666]] as LatLngExpression[]
  };




  
  const getReportColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency': return '#dc2626';
      case 'caution': return '#ea580c';
      default: return '#2563eb';
    }
  };

  const getIncidentIcon = (type: string) => {
    switch (type) {
      case 'descarga_residual': return '🏭';
      case 'basura': return '🗑️';
      case 'olor': return '💨';
      case 'mortandad': return '🐟';
      case 'coloracion': return '🎨';
      default: return '⚠️';
    }
  };

  const getIncidentName = (type: string) => {
    switch (type) {
      case 'descarga_residual': return 'Descarga Residual';
      case 'basura': return 'Basura/Obstrucción';
      case 'olor': return 'Olor Ofensivo';
      case 'mortandad': return 'Mortandad Fauna';
      case 'coloracion': return 'Cambio Coloración';
      default: return 'Incidente';
    }
  };

  const createCustomIcon = (urgency: string, incidentType: string) => {
    if (typeof window === 'undefined') return null;
    
    const L = require('leaflet');
    const color = getReportColor(urgency);
    const icon = getIncidentIcon(incidentType);
    
    return L.divIcon({
      html: `<div style="background: ${color}; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3); font-size: 14px;">${icon}</div>`,
      className: 'custom-marker',
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });
  };



  if (!isClient) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#9b2247] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <style jsx global>{`
        .custom-popup .leaflet-popup-content-wrapper {
          padding: 0;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          max-width: 320px;
        }
        .custom-popup .leaflet-popup-content {
          margin: 0;
          line-height: 1.4;
        }
        .custom-popup .leaflet-popup-tip {
          background: white;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        .custom-report-marker {
          background: transparent !important;
          border: none !important;
        }
        .custom-cluster-marker {
          background: transparent !important;
          border: none !important;
        }
        .leaflet-cluster-anim .leaflet-marker-icon, .leaflet-cluster-anim .leaflet-marker-shadow {
          transition: transform 0.3s ease-out, opacity 0.3s ease-in;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
      
      <MapContainer center={center} zoom={8} style={{ height: '100%', width: '100%' }} className="rounded-2xl">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        
        <Polygon positions={cuencaData.delimitacion} pathOptions={{ color: '#1e5b4f', fillColor: '#1e5b4f', fillOpacity: 0.08, weight: 3, dashArray: '10, 10' }} />
        <Circle center={cuencaData.lagoChapala.center} radius={cuencaData.lagoChapala.radius} pathOptions={{ color: '#1e5b4f', fillColor: '#1e5b4f', fillOpacity: 0.2, weight: 2 }} />
        <CircleMarker center={[19.25, -99.666]} radius={6} pathOptions={{ color: '#9b2247', fillColor: '#9b2247', fillOpacity: 0.8, weight: 2 }} />
        <CircleMarker center={[21.5, -105.416]} radius={6} pathOptions={{ color: '#002f2a', fillColor: '#002f2a', fillOpacity: 0.8, weight: 2 }} />
        
        {(propsReports || reports).map((report) => (
          <Marker
            key={`report-${report.id}`}
            position={[report.location_lat, report.location_lng]}
            icon={createCustomIcon(report.urgency, report.incident_type)}
          >
            <Popup>
              <div className="p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <div className={`w-4 h-4 rounded-full ${
                    report.urgency === 'emergency' ? 'bg-red-500' :
                    report.urgency === 'caution' ? 'bg-orange-500' : 'bg-blue-500'
                  }`}></div>
                  <h3 className="font-bold text-slate-800">{getIncidentName(report.incident_type)}</h3>
                </div>
                <div className="space-y-2">
                  <p className="text-sm"><span className="font-medium">Ubicación:</span> {report.municipality}</p>
                  <p className="text-sm text-slate-600">{report.reference}</p>
                  {report.description && (
                    <p className="text-sm text-slate-600">{report.description}</p>
                  )}
                  {report.has_sensor && (
                    <div className="mt-2 p-2 bg-teal-50 rounded border border-teal-200">
                      <p className="text-xs font-bold text-teal-700 mb-1">🔬 Mediciones</p>
                      <div className="text-xs space-x-2">
                        {report.ph && <span>pH: {report.ph}</span>}
                        {report.temperature && <span>T: {report.temperature}°C</span>}
                        {report.turbidity && <span>Turb: {report.turbidity}</span>}
                      </div>
                    </div>
                  )}
                  <div className={`mt-2 px-2 py-1 rounded text-xs font-medium ${
                    report.urgency === 'emergency' ? 'bg-red-100 text-red-800' :
                    report.urgency === 'caution' ? 'bg-orange-100 text-orange-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {report.urgency === 'emergency' ? '🔴 Emergencia' : 
                     report.urgency === 'caution' ? '🟡 Precaución' : '🟢 Informativo'}
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}