'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Map, Activity, Layers, Zap, Settings, Maximize2, Filter, Download, RefreshCw, AlertTriangle, TrendingUp, Droplets, Thermometer, Wind, Eye } from 'lucide-react';
import Link from 'next/link';
import InteractiveMap from '@/components/InteractiveMap';
import Logo from '@/components/Logo';

export default function Argos() {
  const [activeLayer, setActiveLayer] = useState('hidrologia');
  const [isRealTime, setIsRealTime] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState('lerma-chapala');
  const [alertsCount, setAlertsCount] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      setAlertsCount(prev => Math.max(0, prev + Math.floor(Math.random() * 3) - 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const layers = [
    { id: 'hidrologia', name: 'Hidrología', icon: Droplets, color: '#1e5b4f', active: true },
    { id: 'temperatura', name: 'Temperatura', icon: Thermometer, color: '#9b2247', active: false },
    { id: 'viento', name: 'Viento', icon: Wind, color: '#a57f2c', active: false },
    { id: 'calidad', name: 'Calidad del Agua', icon: Eye, color: '#161a1d', active: false }
  ];

  const metrics = [
    { label: 'Nivel del Agua', value: '2.4m', change: '+0.2', trend: 'up', color: '#1e5b4f' },
    { label: 'Temperatura', value: '24.5°C', change: '+1.2', trend: 'up', color: '#9b2247' },
    { label: 'pH del Agua', value: '7.2', change: '-0.1', trend: 'down', color: '#a57f2c' },
    { label: 'Turbidez', value: '15 NTU', change: '+2.1', trend: 'up', color: '#161a1d' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50">
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="flex items-center space-x-3 text-slate-600 hover:text-[#9b2247] transition-colors group">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Dashboard</span>
              </Link>
              
              <div className="w-px h-6 bg-slate-300"></div>
              
              <div className="flex items-center space-x-3">
                <Logo variant="dashboard" showText={false} />
                <div className="w-10 h-10 bg-gradient-to-br from-[#9b2247] to-[#611232] rounded-xl flex items-center justify-center shadow-lg">
                  <Map className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-[#9b2247]">Argos</h1>
                  <p className="text-sm text-slate-500">Sistema de Monitoreo Activo</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 border border-slate-200/60">
                <div className={`w-2 h-2 rounded-full ${isRealTime ? 'bg-green-400 animate-pulse' : 'bg-slate-400'}`}></div>
                <span className="text-sm font-medium text-slate-700">
                  {isRealTime ? 'Tiempo Real' : 'Desconectado'}
                </span>
              </div>

              {alertsCount > 0 && (
                <div className="relative">
                  <button className="flex items-center space-x-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl border border-red-200 hover:bg-red-100 transition-colors">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm font-medium">{alertsCount} Alertas</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        <div className="w-80 bg-white/80 backdrop-blur-sm border-r border-slate-200/60 p-6 overflow-y-auto">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-3">Región de Monitoreo</label>
            <select 
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full px-4 py-3 bg-white/60 border border-slate-200 rounded-xl focus:border-[#9b2247] focus:outline-none transition-colors"
            >
              <option value="lerma-chapala">Lerma-Chapala-Santiago</option>
              <option value="alto-lerma">Alto Lerma</option>
              <option value="medio-lerma">Medio Lerma</option>
              <option value="bajo-lerma">Bajo Lerma</option>
            </select>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-700">Capas de Datos</h3>
              <button className="text-xs text-[#9b2247] hover:text-[#611232] font-medium">
                Configurar
              </button>
            </div>
            
            <div className="space-y-2">
              {layers.map((layer) => (
                <button
                  key={layer.id}
                  onClick={() => setActiveLayer(layer.id)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                    activeLayer === layer.id 
                      ? 'bg-gradient-to-r from-slate-100 to-slate-50 border border-slate-200 shadow-sm' 
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center`} style={{backgroundColor: `${layer.color}20`}}>
                    <layer.icon className="w-4 h-4" style={{color: layer.color}} />
                  </div>
                  <span className="font-medium text-slate-700">{layer.name}</span>
                  <div className={`ml-auto w-2 h-2 rounded-full ${activeLayer === layer.id ? 'bg-[#9b2247]' : 'bg-slate-300'}`}></div>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Métricas en Tiempo Real</h3>
            <div className="space-y-3">
              {metrics.map((metric, index) => (
                <div key={index} className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-slate-200/60">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">{metric.label}</span>
                    <div className={`flex items-center space-x-1 text-xs font-medium ${
                      metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <TrendingUp className={`w-3 h-3 ${metric.trend === 'down' ? 'rotate-180' : ''}`} />
                      <span>{metric.change}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold" style={{color: metric.color}}>{metric.value}</span>
                    <div className="w-12 h-1 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-1000" 
                        style={{backgroundColor: metric.color, width: `${60 + index * 10}%`}}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Acciones Rápidas</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-slate-50 rounded-xl transition-colors">
                <Download className="w-4 h-4 text-[#9b2247]" />
                <span className="text-sm font-medium text-slate-700">Exportar Datos</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-slate-50 rounded-xl transition-colors">
                <Filter className="w-4 h-4 text-[#1e5b4f]" />
                <span className="text-sm font-medium text-slate-700">Filtros Avanzados</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-slate-50 rounded-xl transition-colors">
                <RefreshCw className="w-4 h-4 text-[#a57f2c]" />
                <span className="text-sm font-medium text-slate-700">Actualizar Datos</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-slate-50 rounded-xl transition-colors">
                <Settings className="w-4 h-4 text-[#161a1d]" />
                <span className="text-sm font-medium text-slate-700">Configuración</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex-1 relative bg-white/60 backdrop-blur-sm m-6 rounded-2xl border border-slate-200/60 shadow-xl overflow-hidden">
            <InteractiveMap activeLayer={activeLayer} />

            <div className="absolute top-6 right-6 space-y-3 z-[1000]">
              <button className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-xl border border-slate-200/60 flex items-center justify-center hover:bg-white transition-colors shadow-lg">
                <Maximize2 className="w-5 h-5 text-slate-600" />
              </button>
              <button className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-xl border border-slate-200/60 flex items-center justify-center hover:bg-white transition-colors shadow-lg">
                <Layers className="w-5 h-5 text-slate-600" />
              </button>
              <button className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-xl border border-slate-200/60 flex items-center justify-center hover:bg-white transition-colors shadow-lg">
                <Zap className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-slate-200/60 p-4 z-[1000]">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-[#1e5b4f] rounded-full"></div>
                    <span className="text-sm font-medium text-slate-700">Coordenadas: 19.4326° N, 99.1332° W</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-[#9b2247] rounded-full"></div>
                    <span className="text-sm font-medium text-slate-700">Zoom: 12x</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-[#a57f2c] rounded-full"></div>
                    <span className="text-sm font-medium text-slate-700">Última actualización: {new Date().toLocaleTimeString()}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button className="px-4 py-2 bg-[#9b2247] text-white rounded-lg hover:bg-[#611232] transition-colors text-sm font-medium">
                    Exportar Vista
                  </button>
                  <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
                    Compartir
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}