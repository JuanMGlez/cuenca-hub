'use client';

import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function ApiDocs() {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(id);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6d194]/5 via-white to-[#1e5b4f]/5 p-8">
      <div className="max-w-5xl mx-auto">
        <Link href="/dashboard" className="text-[#1e5b4f] hover:text-[#002f2a] mb-6 inline-block">← Volver al Dashboard</Link>
        
        <h1 className="text-4xl font-bold text-[#161a1d] mb-2">API de Sensores IoT</h1>
        <p className="text-[#161a1d]/60 mb-8">Documentación para integrar dispositivos de monitoreo ambiental</p>

        <div className="bg-white rounded-2xl border border-[#e6d194]/40 p-6 mb-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-[#1e5b4f]">POST /api/sensor/ingest</h2>
            <span className="px-3 py-1 bg-[#1e5b4f]/10 text-[#1e5b4f] rounded-full text-sm font-medium">Device Ingestion</span>
          </div>
          
          <p className="text-[#161a1d]/70 mb-4">Envía datos desde tu sensor a la plataforma</p>
          
          <div className="bg-[#161a1d] rounded-xl p-4 mb-4 relative">
            <button 
              onClick={() => copyToClipboard('curl -X POST https://cuenca-hub.vercel.app/api/sensor/ingest', 'ingest')}
              className="absolute top-4 right-4 text-white/60 hover:text-white"
            >
              {copiedEndpoint === 'ingest' ? <Check size={20} /> : <Copy size={20} />}
            </button>
            <pre className="text-[#e6d194] text-sm overflow-x-auto">
{`curl -X POST /api/sensor/ingest \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: tu_api_key" \\
  -d '{
    "device_id": "SENSOR-001",
    "ph": 7.2,
    "temperature": 24.5,
    "dissolved_oxygen": 6.8,
    "turbidity": 15.0
  }'`}
            </pre>
          </div>

          <h3 className="font-bold text-[#161a1d] mb-2">Parámetros Soportados</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-[#1e5b4f]/5 p-3 rounded-lg">
              <h4 className="font-bold text-[#1e5b4f] text-sm mb-2">Calidad del Agua</h4>
              <ul className="text-sm text-[#161a1d]/70 space-y-1">
                <li>• ph: 0-14</li>
                <li>• temperature: °C</li>
                <li>• dissolved_oxygen: mg/L</li>
                <li>• turbidity: NTU</li>
                <li>• conductivity: µS/cm</li>
              </ul>
            </div>
            <div className="bg-[#9b2247]/5 p-3 rounded-lg">
              <h4 className="font-bold text-[#9b2247] text-sm mb-2">Hidrología</h4>
              <ul className="text-sm text-[#161a1d]/70 space-y-1">
                <li>• water_level: metros</li>
                <li>• flow_rate: m³/s</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#e6d194]/40 p-6 mb-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-[#1e5b4f]">GET /api/sensor/readings</h2>
            <span className="px-3 py-1 bg-[#9b2247]/10 text-[#9b2247] rounded-full text-sm font-medium">Sensor Data</span>
          </div>
          
          <p className="text-[#161a1d]/70 mb-4">Consulta lecturas históricas de sensores</p>
          
          <div className="bg-[#161a1d] rounded-xl p-4 mb-4 relative">
            <button 
              onClick={() => copyToClipboard('curl /api/sensor/readings?device_id=SENSOR-001&limit=100', 'readings')}
              className="absolute top-4 right-4 text-white/60 hover:text-white"
            >
              {copiedEndpoint === 'readings' ? <Check size={20} /> : <Copy size={20} />}
            </button>
            <pre className="text-[#e6d194] text-sm overflow-x-auto">
{`curl /api/sensor/readings?device_id=SENSOR-001&limit=100`}
            </pre>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#1e5b4f]/10 to-[#9b2247]/10 rounded-2xl border border-[#1e5b4f]/30 p-6">
          <h2 className="text-2xl font-bold text-[#161a1d] mb-4">Protocolos Soportados</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/60 p-4 rounded-xl">
              <h3 className="font-bold text-[#1e5b4f] mb-2">HTTP/HTTPS</h3>
              <p className="text-sm text-[#161a1d]/70">REST API estándar con JSON</p>
            </div>
            <div className="bg-white/60 p-4 rounded-xl">
              <h3 className="font-bold text-[#1e5b4f] mb-2">MQTT</h3>
              <p className="text-sm text-[#161a1d]/70">Próximamente para IoT</p>
            </div>
            <div className="bg-white/60 p-4 rounded-xl">
              <h3 className="font-bold text-[#1e5b4f] mb-2">WebSocket</h3>
              <p className="text-sm text-[#161a1d]/70">Streaming en tiempo real</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
