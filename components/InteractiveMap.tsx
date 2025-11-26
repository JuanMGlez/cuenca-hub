'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { LatLngExpression } from 'leaflet';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Circle = dynamic(() => import('react-leaflet').then(mod => mod.Circle), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

interface MonitoringPoint {
  id: string;
  name: string;
  position: LatLngExpression;
  type: 'hidrologia' | 'temperatura' | 'calidad' | 'viento';
  value: string;
  status: 'normal' | 'warning' | 'critical';
}

interface InteractiveMapProps {
  activeLayer: string;
}

export default function InteractiveMap({ activeLayer }: InteractiveMapProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const center: LatLngExpression = [20.2, -102.8];

  const monitoringPoints: MonitoringPoint[] = [
    { id: '1', name: 'Lago de Chapala', position: [20.2967, -103.2442], type: 'hidrologia', value: '2.4m', status: 'normal' },
    { id: '2', name: 'Río Lerma - Toluca', position: [19.2889, -99.6561], type: 'calidad', value: 'pH 7.2', status: 'warning' },
    { id: '3', name: 'Presa Solís', position: [20.4167, -101.8333], type: 'hidrologia', value: '85%', status: 'normal' },
    { id: '4', name: 'Río Santiago', position: [20.6597, -103.3496], type: 'temperatura', value: '24.5°C', status: 'normal' },
    { id: '5', name: 'Laguna de Yuriria', position: [20.2167, -101.1333], type: 'calidad', value: '18 NTU', status: 'critical' }
  ];

  const getPointColor = (point: MonitoringPoint) => {
    if (activeLayer !== point.type) return '#e2e8f0';
    return point.status === 'normal' ? '#10b981' : point.status === 'warning' ? '#f59e0b' : '#ef4444';
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
      
      <MapContainer center={center} zoom={8} style={{ height: '100%', width: '100%' }} className="rounded-2xl">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        
        {monitoringPoints.map((point) => (
          <Circle
            key={point.id}
            center={point.position}
            radius={1000}
            pathOptions={{
              color: getPointColor(point),
              fillColor: getPointColor(point),
              fillOpacity: 0.6,
              weight: 2
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-[#9b2247] mb-2">{point.name}</h3>
                <p className="text-sm"><span className="font-medium">Valor:</span> {point.value}</p>
                <p className="text-sm">
                  <span className="font-medium">Estado:</span> 
                  <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                    point.status === 'normal' ? 'bg-green-100 text-green-800' :
                    point.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {point.status === 'normal' ? 'Normal' : point.status === 'warning' ? 'Alerta' : 'Crítico'}
                  </span>
                </p>
              </div>
            </Popup>
          </Circle>
        ))}
      </MapContainer>
    </div>
  );
}