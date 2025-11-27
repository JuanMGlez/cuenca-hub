'use client';

import { useState, useEffect } from 'react';
import './styles.css';
import { ArrowLeft, Map, AlertTriangle, TrendingUp, Droplets, Thermometer, Eye, BarChart3, Activity, RefreshCw, Plus, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';
import InteractiveMap from '@/components/InteractiveMap';
import WaterQualityDashboard from '@/components/WaterQualityDashboard';
import ReportIncidentModal from '@/components/ReportIncidentModal';
import Logo from '@/components/Logo';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export default function Argos() {
  const [activeLayer, setActiveLayer] = useState('alertas');
  const [activeView, setActiveView] = useState<'map' | 'water-quality'>('map');
  const [filterUrgency, setFilterUrgency] = useState<'all' | 'emergency' | 'caution' | 'info'>('all');
  const [timeFilter, setTimeFilter] = useState<'24h' | '7d' | '30d' | 'all'>('all');
  const [isRealTime, setIsRealTime] = useState(true);

  const [waterQualityData, setWaterQualityData] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reports, setReports] = useState<any[]>([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [sensorDevices, setSensorDevices] = useState<any[]>([]);
  const [sensorReadings, setSensorReadings] = useState<any[]>([]);

  useEffect(() => {
    
    // Obtener usuario actual
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
    
    loadReports();
    loadSensorData();

  }, []);
  
  const loadReports = async () => {
    setLoadingReports(true);
    console.log('🔍 [SIDEBAR] Iniciando carga de reportes...');
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });
      
      console.log('📊 [SIDEBAR] Respuesta Supabase:', { 
        success: !error, 
        error: error?.message, 
        count: data?.length,
        data: data 
      });
      
      if (error) throw error;
      
      console.log(`✅ [SIDEBAR] ${data?.length || 0} reportes cargados`);
      setReports(data || []);
    } catch (error: any) {
      console.error('❌ [SIDEBAR] Error:', error.message);
      setReports([]);
    } finally {
      setLoadingReports(false);
    }
  };

  const loadSensorData = async () => {
    try {
      const { data: devices, error: devicesError } = await supabase
        .from('devices')
        .select('*')
        .eq('status', 'active');
      
      if (!devicesError && devices) {
        setSensorDevices(devices);
      }

      const { data: readings, error: readingsError } = await supabase
        .from('sensor_readings')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);
      
      if (!readingsError && readings) {
        setSensorReadings(readings);
      }
    } catch (error: any) {
      console.error('❌ Error cargando datos de sensores:', error.message);
    }
  };



  const views = [
    { id: 'map', name: 'Mapa de Reportes', icon: Map },
    { id: 'water-quality', name: 'Análisis Sentinel-2', icon: BarChart3 }
  ];

  const getFilteredReports = () => {
    let filtered = reports;
    
    if (filterUrgency !== 'all') {
      filtered = filtered.filter(r => r.urgency === filterUrgency);
    }
    
    if (timeFilter !== 'all') {
      const now = Date.now();
      const timeMap = {
        '24h': 24 * 60 * 60 * 1000,
        '7d': 7 * 24 * 60 * 60 * 1000,
        '30d': 30 * 24 * 60 * 60 * 1000
      };
      const cutoff = now - timeMap[timeFilter];
      filtered = filtered.filter(r => new Date(r.created_at).getTime() > cutoff);
    }
    
    return filtered;
  };

  const filteredReports = getFilteredReports();
  const emergencyCount = reports.filter(r => r.urgency === 'emergency').length;
  const cautionCount = reports.filter(r => r.urgency === 'caution').length;
  const reportsLast24h = reports.filter(r => 
    Date.now() - new Date(r.created_at).getTime() < 24 * 60 * 60 * 1000
  ).length;

  const getLatestReadings = () => {
    if (sensorReadings.length === 0) {
      return {
        waterQuality: {
          ph: { value: 7.2, status: 'normal', range: '6.5-8.5', trend: 'stable' },
          dissolvedOxygen: { value: 6.8, status: 'good', range: '>5 mg/L', trend: 'up' },
          turbidity: { value: 15, status: 'warning', range: '<10 NTU', trend: 'up' },
          temperature: { value: 24.5, status: 'normal', range: '18-28°C', trend: 'stable' }
        },
        hydrology: {
          waterLevel: { value: 2.4, status: 'normal', unit: 'm', location: 'Lago Chapala' },
          flow: { value: 45, status: 'low', unit: 'm³/s', location: 'Río Lerma' }
        },
        lastUpdate: new Date()
      };
    }

    const latest = sensorReadings[0];
    return {
      waterQuality: {
        ph: { value: latest.ph || 7.2, status: 'normal', range: '6.5-8.5', trend: 'stable' },
        dissolvedOxygen: { value: latest.dissolved_oxygen || 6.8, status: 'good', range: '>5 mg/L', trend: 'up' },
        turbidity: { value: latest.turbidity || 15, status: 'warning', range: '<10 NTU', trend: 'up' },
        temperature: { value: latest.temperature || 24.5, status: 'normal', range: '18-28°C', trend: 'stable' }
      },
      hydrology: {
        waterLevel: { value: latest.water_level || 2.4, status: 'normal', unit: 'm', location: 'Lago Chapala' },
        flow: { value: latest.flow_rate || 45, status: 'low', unit: 'm³/s', location: 'Río Lerma' }
      },
      lastUpdate: new Date(latest.timestamp || Date.now())
    };
  };

  const environmentalData = getLatestReadings();



  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6d194]/5 via-white to-[#1e5b4f]/5">
      <header className="glass-panel sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="flex items-center space-x-2 px-3 py-2 rounded-xl text-[#161a1d]/70 hover:text-[#9b2247] hover:bg-[#e6d194]/10 transition-all group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">Volver</span>
              </Link>
              
              <div className="w-px h-8 bg-gradient-to-b from-transparent via-[#e6d194] to-transparent"></div>
              
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#1e5b4f] to-[#002f2a] rounded-2xl blur-sm opacity-20"></div>
                  <Logo variant="dashboard" showText={false} />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-[#1e5b4f] to-[#002f2a] bg-clip-text text-transparent">Argos</h1>
                  <p className="text-xs text-[#161a1d]/60 font-medium">Sistema de Monitoreo Inteligente</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* View Selector */}
              <div className="flex items-center bg-gradient-to-r from-white to-[#e6d194]/5 backdrop-blur-sm rounded-2xl border border-[#e6d194]/40 p-1 shadow-sm">
                {views.map((view) => (
                  <button
                    key={view.id}
                    onClick={() => setActiveView(view.id as any)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                      activeView === view.id 
                        ? 'gradient-teal text-white shadow-lg shadow-[#1e5b4f]/20' 
                        : 'text-[#161a1d]/60 hover:text-[#1e5b4f] hover:bg-[#e6d194]/10'
                    }`}
                  >
                    <view.icon className="w-4 h-4" />
                    <span className="text-sm">{view.name}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center space-x-2 bg-gradient-to-r from-[#1e5b4f]/10 to-[#002f2a]/10 backdrop-blur-sm rounded-full px-4 py-2 border border-[#1e5b4f]/20">
                <div className={`w-2 h-2 rounded-full ${isRealTime ? 'bg-[#1e5b4f] pulse-indicator' : 'bg-[#161a1d]/30'}`}></div>
                <span className="text-sm font-medium text-[#161a1d]">
                  {isRealTime ? 'Tiempo Real' : 'Desconectado'}
                </span>
              </div>

              <div className="flex items-center space-x-3">
                {reports.length > 0 && (
                  <div className="relative group">
                    <div className="absolute inset-0 gradient-burgundy rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                    <button className="relative flex items-center space-x-2 gradient-burgundy text-white px-4 py-2 rounded-xl shadow-lg shadow-[#9b2247]/20 hover-lift">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm font-semibold">{reports.length}</span>
                      <span className="text-xs opacity-90">Reportes</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        <div className="w-80 bg-gradient-to-b from-white via-[#e6d194]/5 to-white backdrop-blur-sm border-r border-[#e6d194]/30 p-6 overflow-y-auto shadow-xl">
          {/* Panel de Monitoreo Ambiental */}
          <div className="mb-6">
            <div className="bg-gradient-to-r from-[#1e5b4f]/10 to-[#9b2247]/10 p-4 rounded-xl border border-[#1e5b4f]/20">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-[#1e5b4f]">Monitoreo Ambiental</h3>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-[#1e5b4f] rounded-full animate-pulse"></div>
                  <span className="text-xs text-[#161a1d]/60">En vivo</span>
                </div>
              </div>
              
              <div className="space-y-2">
                {/* Calidad del Agua */}
                <div className="bg-white/60 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#161a1d]/70">Calidad del Agua</span>
                    <Droplets className="w-3 h-3 text-[#1e5b4f]" />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <div className="text-[#161a1d]/50">pH</div>
                      <div className="font-bold text-[#1e5b4f]">{environmentalData.waterQuality.ph.value}</div>
                    </div>
                    <div>
                      <div className="text-[#161a1d]/50">O₂ Disuelto</div>
                      <div className="font-bold text-[#1e5b4f]">{environmentalData.waterQuality.dissolvedOxygen.value} mg/L</div>
                    </div>
                    <div>
                      <div className="text-[#161a1d]/50">Turbidez</div>
                      <div className="font-bold text-[#a57f2c]">{environmentalData.waterQuality.turbidity.value} NTU</div>
                    </div>
                    <div>
                      <div className="text-[#161a1d]/50">Temperatura</div>
                      <div className="font-bold text-[#002f2a]">{environmentalData.waterQuality.temperature.value}°C</div>
                    </div>
                  </div>
                </div>

                {/* Hidrología */}
                <div className="bg-white/60 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#161a1d]/70">Hidrología</span>
                    <Activity className="w-3 h-3 text-[#9b2247]" />
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#161a1d]/50">Nivel Chapala</span>
                      <span className="font-bold text-[#1e5b4f]">{environmentalData.hydrology.waterLevel.value}m</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#161a1d]/50">Caudal Lerma</span>
                      <span className="font-bold text-[#a57f2c]">{environmentalData.hydrology.flow.value} m³/s</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-3 text-xs text-[#161a1d]/50 text-center">
                Última actualización: {environmentalData.lastUpdate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="bg-gradient-to-r from-[#e6d194]/20 to-[#1e5b4f]/10 p-4 rounded-xl border border-[#e6d194]/40">
              <div className="flex items-center space-x-2 mb-2">
                <BarChart3 className="w-4 h-4 text-[#1e5b4f]" />
                <h3 className="text-sm font-bold text-[#002f2a]">Estado de la Cuenca</h3>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white/60 p-2 rounded">
                  <div className="text-[#161a1d]/50">Calidad General</div>
                  <div className="font-bold text-[#a57f2c]">Moderada</div>
                </div>
                <div className="bg-white/60 p-2 rounded">
                  <div className="text-[#161a1d]/50">Nivel Hídrico</div>
                  <div className="font-bold text-[#1e5b4f]">Normal</div>
                </div>
                <div className="bg-white/60 p-2 rounded">
                  <div className="text-[#161a1d]/50">Área Monitoreada</div>
                  <div className="font-bold text-[#002f2a]">47,116 km²</div>
                </div>
                <div className="bg-white/60 p-2 rounded">
                  <div className="text-[#161a1d]/50">Población</div>
                  <div className="font-bold text-[#611232]">15M hab</div>
                </div>
              </div>
            </div>
          </div>



          <div>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-[#161a1d]/70">Reportes Activos</h3>
                <button 
                  onClick={() => setShowReportModal(true)}
                  className="text-xs text-[#1e5b4f] hover:text-[#002f2a] font-medium flex items-center space-x-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Nuevo</span>
                </button>
              </div>
              
              {/* Estadísticas rápidas */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="bg-[#9b2247]/10 p-2 rounded-lg text-center">
                  <div className="text-lg font-bold text-[#9b2247]">{emergencyCount}</div>
                  <div className="text-xs text-[#611232]">Emergencias</div>
                </div>
                <div className="bg-[#a57f2c]/10 p-2 rounded-lg text-center">
                  <div className="text-lg font-bold text-[#a57f2c]">{cautionCount}</div>
                  <div className="text-xs text-[#a57f2c]">Precaución</div>
                </div>
                <div className="bg-[#1e5b4f]/10 p-2 rounded-lg text-center">
                  <div className="text-lg font-bold text-[#1e5b4f]">{reportsLast24h}</div>
                  <div className="text-xs text-[#002f2a]">Últimas 24h</div>
                </div>
              </div>

              {/* Filtros */}
              <div className="space-y-2 mb-3">
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setFilterUrgency('all')}
                    className={`flex-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                      filterUrgency === 'all' ? 'bg-[#161a1d] text-white' : 'bg-[#e6d194]/20 text-[#161a1d]/70 hover:bg-[#e6d194]/30'
                    }`}
                  >
                    Todos
                  </button>
                  <button
                    onClick={() => setFilterUrgency('emergency')}
                    className={`flex-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                      filterUrgency === 'emergency' ? 'bg-[#9b2247] text-white' : 'bg-[#9b2247]/10 text-[#9b2247] hover:bg-[#9b2247]/20'
                    }`}
                  >
                    🔴
                  </button>
                  <button
                    onClick={() => setFilterUrgency('caution')}
                    className={`flex-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                      filterUrgency === 'caution' ? 'bg-[#a57f2c] text-white' : 'bg-[#a57f2c]/10 text-[#a57f2c] hover:bg-[#a57f2c]/20'
                    }`}
                  >
                    🟡
                  </button>
                  <button
                    onClick={() => setFilterUrgency('info')}
                    className={`flex-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                      filterUrgency === 'info' ? 'bg-[#1e5b4f] text-white' : 'bg-[#1e5b4f]/10 text-[#1e5b4f] hover:bg-[#1e5b4f]/20'
                    }`}
                  >
                    🟢
                  </button>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setTimeFilter('24h')}
                    className={`flex-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                      timeFilter === '24h' ? 'bg-[#1e5b4f] text-white' : 'bg-[#e6d194]/20 text-[#161a1d]/70 hover:bg-[#e6d194]/30'
                    }`}
                  >
                    24h
                  </button>
                  <button
                    onClick={() => setTimeFilter('7d')}
                    className={`flex-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                      timeFilter === '7d' ? 'bg-[#1e5b4f] text-white' : 'bg-[#e6d194]/20 text-[#161a1d]/70 hover:bg-[#e6d194]/30'
                    }`}
                  >
                    7d
                  </button>
                  <button
                    onClick={() => setTimeFilter('30d')}
                    className={`flex-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                      timeFilter === '30d' ? 'bg-[#1e5b4f] text-white' : 'bg-[#e6d194]/20 text-[#161a1d]/70 hover:bg-[#e6d194]/30'
                    }`}
                  >
                    30d
                  </button>
                  <button
                    onClick={() => setTimeFilter('all')}
                    className={`flex-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                      timeFilter === 'all' ? 'bg-[#1e5b4f] text-white' : 'bg-[#e6d194]/20 text-[#161a1d]/70 hover:bg-[#e6d194]/30'
                    }`}
                  >
                    Todo
                  </button>
                </div>
              </div>
            </div>
            
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {loadingReports ? (
                <div className="bg-[#e6d194]/10 border border-[#e6d194]/40 p-4 rounded-xl text-center">
                  <RefreshCw className="w-4 h-4 text-[#161a1d]/40 mx-auto mb-2 animate-spin" />
                  <p className="text-xs text-[#161a1d]/60">Cargando reportes...</p>
                </div>
              ) : filteredReports.length > 0 ? filteredReports.map((report) => {
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
                
                return (
                  <div key={report.id} className={`p-3 rounded-xl border transition-all hover:shadow-md ${
                    report.urgency === 'emergency' ? 'bg-[#9b2247]/10 border-[#9b2247]/30 hover:bg-[#9b2247]/15' :
                    report.urgency === 'caution' ? 'bg-[#a57f2c]/10 border-[#a57f2c]/30 hover:bg-[#a57f2c]/15' :
                    'bg-[#1e5b4f]/10 border-[#1e5b4f]/30 hover:bg-[#1e5b4f]/15'
                  }`}>
                    <div className="flex items-start space-x-3">
                      <div className="text-lg">{getIncidentIcon(report.incident_type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className={`text-xs font-bold ${
                            report.urgency === 'emergency' ? 'text-[#611232]' :
                            report.urgency === 'caution' ? 'text-[#a57f2c]' :
                            'text-[#002f2a]'
                          }`}>
                            {getIncidentName(report.incident_type)}
                          </p>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            report.urgency === 'emergency' ? 'bg-[#9b2247]/20 text-[#611232]' :
                            report.urgency === 'caution' ? 'bg-[#a57f2c]/20 text-[#a57f2c]' :
                            'bg-[#1e5b4f]/20 text-[#002f2a]'
                          }`}>
                            {report.urgency === 'emergency' ? '🔴' : report.urgency === 'caution' ? '🟡' : '🟢'}
                          </span>
                        </div>
                        <p className="text-xs text-[#161a1d]/70 mb-1 font-medium">
                          📍 {report.municipality}
                        </p>
                        <p className="text-xs text-[#161a1d]/50 truncate mb-2">
                          {report.reference}
                        </p>
                        {report.has_sensor && (
                          <div className="flex items-center space-x-2 mb-2">
                            <Droplets className="w-3 h-3 text-[#1e5b4f]" />
                            <span className="text-xs text-[#1e5b4f] font-medium">Con mediciones</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-2 h-2 text-[#161a1d]/40" />
                            <span className="text-xs text-[#161a1d]/50">
                              {new Date(report.created_at).toLocaleDateString('es-ES')}
                            </span>
                          </div>
                          {report.image_url && (
                            <div className="text-xs text-[#161a1d]/50">📷</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }) : filterUrgency !== 'all' || timeFilter !== 'all' ? (
                <div className="bg-[#e6d194]/10 border border-[#e6d194]/40 p-4 rounded-xl text-center">
                  <MapPin className="w-6 h-6 text-[#161a1d]/40 mx-auto mb-2" />
                  <p className="text-xs text-[#161a1d]/60 mb-2">No hay reportes con estos filtros</p>
                  <button 
                    onClick={() => {
                      setFilterUrgency('all');
                      setTimeFilter('all');
                    }}
                    className="text-xs text-[#1e5b4f] hover:text-[#002f2a] font-medium"
                  >
                    Limpiar filtros
                  </button>
                </div>
              ) : (
                <div className="bg-[#e6d194]/10 border border-[#e6d194]/40 p-4 rounded-xl text-center">
                  <MapPin className="w-6 h-6 text-[#161a1d]/40 mx-auto mb-2" />
                  <p className="text-xs text-[#161a1d]/60 mb-2">No hay reportes registrados</p>
                  <button 
                    onClick={() => setShowReportModal(true)}
                    className="text-xs text-[#1e5b4f] hover:text-[#002f2a] font-medium"
                  >
                    Crear primer reporte
                  </button>
                </div>
              )}
            </div>
            
            {filteredReports.length > 0 && (
              <div className="mt-3 pt-3 border-t border-[#e6d194]/40">
                <div className="text-xs text-[#161a1d]/50 text-center">
                  Mostrando {filteredReports.length} de {reports.length} reportes
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          {activeView === 'map' ? (
            <div className="flex-1 relative bg-white/60 backdrop-blur-sm m-6 rounded-2xl border border-[#e6d194]/30 shadow-xl overflow-hidden">
              <InteractiveMap activeLayer={activeLayer} reports={filteredReports} />



            <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-[#e6d194]/40 p-4 z-[1000]">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-[#1e5b4f] rounded-full"></div>
                    <span className="text-sm font-medium text-[#161a1d]/70">Cuenca: Lerma-Chapala-Santiago</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-[#9b2247] rounded-full"></div>
                    <span className="text-sm font-medium text-[#161a1d]/70">Reportes: {reports.length}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-[#a57f2c] rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-[#161a1d]/70">Emergencias: {reports.filter(r => r.urgency === 'emergency').length}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    reports.filter(r => r.urgency === 'emergency').length > 0 ? 'bg-[#9b2247]/10 text-[#611232]' : 'bg-[#1e5b4f]/10 text-[#002f2a]'
                  }`}>
                    {reports.filter(r => r.urgency === 'emergency').length > 0 ? 
                      `${reports.filter(r => r.urgency === 'emergency').length} Emergencias Activas` : 
                      `${reports.length} Reportes Activos`}
                  </div>
                </div>
              </div>
            </div>
          </div>
          ) : (
            <div className="flex-1 overflow-hidden">
              <WaterQualityDashboard onDataUpdate={setWaterQualityData} />
            </div>
          )}
        </div>
      </div>
      
      {/* Modal de Reportes */}
      <ReportIncidentModal 
        isOpen={showReportModal} 
        onClose={() => {
          setShowReportModal(false);
          loadReports(); // Recargar reportes después de cerrar el modal
        }} 
        user={user}
      />
    </div>
  );
}