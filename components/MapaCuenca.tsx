'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const zonas = {
  alta: {
    coords: [
      [19.6, -99.3], // Norte Toluca
      [19.8, -100.0], // Hacia Michoacán
      [19.1, -100.2], // Valle de Bravo
      [18.9, -99.6], // Sur Toluca
      [19.2, -99.2]  // Lerma
    ] as [number, number][],
    center: [19.4, -99.7] as [number, number],
    zoom: 9,
    color: '#1e5b4f',
    title: 'Cuenca Alta (Río Lerma)',
    subtitle: 'Origen del problema: Zona industrial Toluca y Atlacomulco.'
  },
  media: {
    coords: [
      [19.8, -100.0], // Conecta con Alta
      [20.5, -100.2], // Querétaro
      [21.1, -101.6], // León / Guanajuato (El Bajío industrial)
      [20.3, -102.8], // Chapala Norte
      [19.9, -102.6], // Michoacán (Agricultura)
      [20.2, -101.0]  // Regreso sur
    ] as [number, number][],
    center: [20.3, -101.4] as [number, number],
    zoom: 8,
    color: '#a57f2c',
    title: 'Cuenca Media (Lago Chapala)',
    subtitle: 'El receptor final: Acumulación de sedimentos y contaminantes.'
  },
  baja: {
    coords: [
      [20.3, -102.8], // Conecta con Media (Salida de Chapala)
      [20.7, -103.4], // Guadalajara / Barranca
      [21.8, -104.5], // Sierra Nayarit
      [21.5, -105.4], // Desembocadura San Blas
      [20.8, -105.0]  // Costa
    ] as [number, number][],
    center: [21.0, -104.1] as [number, number],
    zoom: 8,
    color: '#9b2247',
    title: 'Cuenca Baja (Río Santiago)',
    subtitle: 'La zona más crítica: Cascada de Juanacatlán y paso al Pacífico.'
  }
};

function MapController({ activeZone }: { activeZone: string | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (activeZone && activeZone in zonas) {
      const zona = zonas[activeZone as keyof typeof zonas];
      map.flyTo(zona.center, zona.zoom);
    }
  }, [activeZone, map]);
  
  return null;
}

export default function MapaCuenca() {
  const [activeZone, setActiveZone] = useState<string | null>(null);

  return (
    <div className="grid lg:grid-cols-4 gap-8">
      <div className="space-y-4">
        {Object.entries(zonas).map(([key, zona]) => (
          <button
            key={key}
            onClick={() => setActiveZone(activeZone === key ? null : key)}
            className={`w-full p-6 rounded-xl text-left transition-all duration-300 ${
              activeZone === key 
                ? 'bg-white shadow-lg scale-105' 
                : 'bg-gray-100 bg-opacity-10 hover:bg-opacity-20'
            }`}
          >
            <div className="flex items-center space-x-3 mb-3">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: zona.color }}
              ></div>
              <h3 className={`font-bold text-lg ${
                activeZone === key ? 'text-charcoal' : 'text-black'
              }`}>
                {zona.title}
              </h3>
            </div>
            <p className={`text-sm ${
              activeZone === key ? 'text-charcoal opacity-70' : 'text-black opacity-75'
            }`}>
              {zona.subtitle}
            </p>
          </button>
        ))}
      </div>

      <div className="lg:col-span-3 bg-white rounded-2xl p-4 shadow-lg relative z-0">
        <div className="h-96 w-full rounded-xl overflow-hidden">
          <MapContainer 
            center={[20.2, -102.0]} 
            zoom={6} 
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {Object.entries(zonas).map(([key, zona]) => (
              <Polygon
                key={key}
                positions={zona.coords}
                pathOptions={{
                  color: zona.color,
                  fillColor: zona.color,
                  fillOpacity: activeZone === key ? 0.6 : activeZone ? 0.1 : 0.4,
                  weight: activeZone === key ? 3 : 2
                }}
              />
            ))}
            
            <MapController activeZone={activeZone} />
          </MapContainer>
        </div>
      </div>
    </div>
  );
}