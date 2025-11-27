'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { LatLngExpression } from 'leaflet';
import { MapPin, Edit3, Trash2, Save, RotateCcw } from 'lucide-react';
import clsx from 'clsx';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Polygon = dynamic(() => import('react-leaflet').then(mod => mod.Polygon), { ssr: false });

interface AreaSelectorProps {
  onAreaSelect: (coordinates: number[][]) => void;
  selectedArea?: number[][];
  className?: string;
}

interface DrawingControlProps {
  onPolygonComplete: (coordinates: LatLngExpression[]) => void;
  isDrawing: boolean;
  setIsDrawing: (drawing: boolean) => void;
}

const DrawingControl = dynamic(() => Promise.resolve(({ onPolygonComplete, isDrawing, setIsDrawing }: DrawingControlProps) => {
  const [currentPolygon, setCurrentPolygon] = useState<LatLngExpression[]>([]);
  const { useMapEvents } = require('react-leaflet');

  const map = useMapEvents({
    click(e: any) {
      if (isDrawing) {
        const newPoint: LatLngExpression = [e.latlng.lat, e.latlng.lng];
        const updatedPolygon = [...currentPolygon, newPoint];
        setCurrentPolygon(updatedPolygon);

        // Complete polygon on 4+ points and close to first point
        if (updatedPolygon.length >= 4) {
          const firstPoint = updatedPolygon[0] as [number, number];
          const lastPoint = newPoint as [number, number];
          const distance = Math.sqrt(
            Math.pow(firstPoint[0] - lastPoint[0], 2) + 
            Math.pow(firstPoint[1] - lastPoint[1], 2)
          );
          
          if (distance < 0.01) { // Close enough to first point
            onPolygonComplete([...updatedPolygon, updatedPolygon[0]]);
            setCurrentPolygon([]);
            setIsDrawing(false);
          }
        }
      }
    }
  });

  const { Polygon } = require('react-leaflet');
  return currentPolygon.length > 0 ? (
    <Polygon 
      positions={currentPolygon} 
      pathOptions={{ 
        color: '#9b2247', 
        fillColor: '#9b2247', 
        fillOpacity: 0.2,
        dashArray: '5, 5'
      }} 
    />
  ) : null;
}), { ssr: false });

export default function AreaSelector({ onAreaSelect, selectedArea, className }: AreaSelectorProps) {
  const [isClient, setIsClient] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnArea, setDrawnArea] = useState<number[][]>(selectedArea || []);

  useEffect(() => {
    setIsClient(true);
  }, []);


  const handlePolygonComplete = (coordinates: LatLngExpression[]) => {
    const coordArray = coordinates.map(coord => {
      const [lat, lng] = coord as [number, number];
      return [lng, lat]; // GeoJSON format: [longitude, latitude]
    });
    setDrawnArea(coordArray);
    onAreaSelect(coordArray);
  };



  const clearArea = () => {
    setDrawnArea([]);
    onAreaSelect([]);
  };

  const startDrawing = () => {
    setIsDrawing(true);
    clearArea();
  };

  // Convert coordinates back to Leaflet format for display
  const leafletCoordinates = drawnArea.length > 0 
    ? drawnArea.map(([lng, lat]) => [lat, lng] as LatLngExpression)
    : [];

  return (
    <div className={clsx("space-y-4", className)}>
      {/* Controls */}
      <div className="bg-[#e6d194]/20 backdrop-blur-sm rounded-xl border border-[#e6d194]/40 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[#161a1d]">Selección de Área de Estudio</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={startDrawing}
              disabled={isDrawing}
              className={clsx(
                "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                isDrawing 
                  ? "bg-[#98989A]/20 text-[#98989A] cursor-not-allowed"
                  : "bg-[#9b2247] text-white hover:bg-[#611232]"
              )}
            >
              <Edit3 className="w-4 h-4" />
              <span>{isDrawing ? 'Dibujando...' : 'Dibujar Área'}</span>
            </button>
            
            {drawnArea.length > 0 && (
              <button
                onClick={clearArea}
                className="flex items-center space-x-2 px-3 py-2 bg-[#161a1d] text-white rounded-lg hover:bg-[#002f2a] transition-colors text-sm font-medium"
              >
                <Trash2 className="w-4 h-4" />
                <span>Limpiar</span>
              </button>
            )}
          </div>
        </div>

        {/* Drawing Instructions */}
        {isDrawing && (
          <div className="mt-4 p-3 bg-[#a57f2c]/10 border border-[#a57f2c]/30 rounded-lg">
            <p className="text-sm text-[#161a1d]">
              <strong>Instrucciones:</strong> Haz clic en el mapa para crear puntos del polígono. 
              Necesitas al menos 4 puntos. Haz clic cerca del primer punto para cerrar el área.
            </p>
          </div>
        )}

        {/* Area Info */}
        {drawnArea.length > 0 && (
          <div className="mt-4 p-3 bg-[#1e5b4f]/10 border border-[#1e5b4f]/30 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#1e5b4f]">Área Seleccionada</p>
                <p className="text-xs text-[#002f2a]">{drawnArea.length} coordenadas definidas</p>
              </div>
              <div className="flex items-center space-x-2">
                <Save className="w-4 h-4 text-[#1e5b4f]" />
                <span className="text-sm text-[#1e5b4f]">Lista para análisis</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Map */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-[#e6d194]/40 overflow-hidden" style={{ height: '400px' }}>
        {isClient ? (
          <>
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
            <MapContainer
              center={[20.23, -102.775]}
              zoom={9}
              style={{ height: '100%', width: '100%' }}
              className="rounded-xl"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              <DrawingControl 
                onPolygonComplete={handlePolygonComplete}
                isDrawing={isDrawing}
                setIsDrawing={setIsDrawing}
              />
              
              {leafletCoordinates.length > 0 && (
                <Polygon 
                  positions={leafletCoordinates}
                  pathOptions={{ 
                    color: '#1e5b4f', 
                    fillColor: '#1e5b4f', 
                    fillOpacity: 0.3,
                    weight: 3
                  }} 
                />
              )}
            </MapContainer>
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-[#9b2247] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
}