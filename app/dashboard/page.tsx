'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { LogOut, BarChart3, Users, FileText, Settings, User as UserIcon, Building, MapPin, Map, MessageCircle, Activity, Brain, Activity as ActivityIcon } from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import ReportIncidentModal from '@/components/ReportIncidentModal';
import RegisterDeviceModal from '@/components/RegisterDeviceModal';

interface UserProfile {
  id: string;
  nombre: string;
  apellidos: string;
  email: string;
  institucion?: string;
  estado: string;
  tipo_usuario: 'comunitario' | 'academico' | 'institucional' | 'organizacional';
  ocupacion?: string;
  comunidad?: string;
  grado?: string;
  especialidad?: string;
  cargo?: string;
  dependencia?: string;
  organizacion?: string;
  sector?: string;
  area_interes?: string;
  avatar_url?: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [showReportModal, setShowReportModal] = useState(false);
  const [sensorDevices, setSensorDevices] = useState<any[]>([]);
  const [showRegisterDevice, setShowRegisterDevice] = useState(false);

  const closeReportModal = () => setShowReportModal(false);

  const loadSensorDevices = async () => {
    try {
      const { data, error } = await supabase
        .from('devices')
        .select('*')
        .eq('status', 'active');
      
      if (!error && data) {
        setSensorDevices(data);
      }
    } catch (error) {
      console.error('Error cargando sensores:', error);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      // Obtener perfil del usuario
      const { data: profileData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error obteniendo perfil:', error);
      } else {
        setProfile(profileData);
      }

      setUser(user);
      setLoading(false);
    };

    loadSensorDevices();
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        router.push('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-opacity-20 mx-auto mb-6"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent absolute top-0 left-1/2 transform -translate-x-1/2"></div>
          </div>
          <p className="text-foreground font-medium">Verificando acceso...</p>
          <p className="text-neutral text-sm mt-2">Cargando tu panel de control</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50">
      {/* Modern Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Logo variant="dashboard" />
              <div>
                <h1 className="text-xl font-bold text-foreground">Dashboard Científico</h1>
                <div className="flex items-center space-x-2">
                  <div className="gov-badge text-xs">COMECyT</div>
                  <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                  <span className="text-xs text-slate-500">Cuenca Lerma-Chapala-Santiago</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* User Avatar & Info */}
              <Link href="/dashboard/profile" className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 border border-slate-200/60 hover:bg-white/80 transition-all cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center overflow-hidden">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="w-4 h-4 text-primary" />
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">
                    {profile ? `${profile.nombre} ${profile.apellidos}` : user?.email}
                  </p>
                  <p className="text-xs text-slate-500">
                    {profile?.tipo_usuario === 'comunitario' && 'Comunitario'}
                    {profile?.tipo_usuario === 'academico' && 'Académico'}
                    {profile?.tipo_usuario === 'institucional' && 'Institucional'}
                    {profile?.tipo_usuario === 'organizacional' && 'Organizacional'}
                  </p>
                </div>
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group"
              >
                <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" />
                <span className="text-sm font-medium">Salir</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="py-8 px-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Modern Welcome Section */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#161a1d]/5 via-[#9b2247]/5 to-[#1e5b4f]/5 rounded-3xl"></div>
            <div className="relative bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-white/60 shadow-xl">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-[#9b2247] to-[#1e5b4f] bg-clip-text text-transparent">
                      Hola, {profile?.nombre || 'Usuario'}
                    </h2>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-600 font-medium">En línea</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 mb-6">
                    <div className={`px-4 py-2 rounded-full text-sm font-medium ${profile?.tipo_usuario === 'comunitario' ? 'bg-[#1e5b4f]/10 text-[#1e5b4f]' :
                      profile?.tipo_usuario === 'academico' ? 'bg-[#9b2247]/10 text-[#9b2247]' :
                        profile?.tipo_usuario === 'institucional' ? 'bg-[#161a1d]/10 text-[#161a1d]' :
                          'bg-[#a57f2c]/10 text-[#a57f2c]'
                      }`}>
                      {profile?.tipo_usuario === 'comunitario' && '🌱 Participante Comunitario/Ciudadano'}
                      {profile?.tipo_usuario === 'academico' && '🎓 Investigador/Académico'}
                      {profile?.tipo_usuario === 'institucional' && '🏛️ Representante Institucional/Gubernamental'}
                      {profile?.tipo_usuario === 'organizacional' && '🏢 Representante Organizacional/Sectorial'}
                    </div>
                  </div>

                  <p className="text-lg text-slate-600 leading-relaxed">
                    Gestiona tu participación en la red científica de restauración de cuencas
                  </p>
                </div>

                {profile && (
                  <Link href="/dashboard/profile" className="block bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-white/60 shadow-lg min-w-[280px] hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#9b2247]/20 to-[#1e5b4f]/20 rounded-xl flex items-center justify-center overflow-hidden">
                        {profile.avatar_url ? (
                          <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <UserIcon className="w-5 h-5 text-[#9b2247]" />
                        )}
                      </div>
                      <span className="font-bold text-foreground">Mi Perfil</span>
                    </div>

                    <div className="space-y-3">
                      {profile.institucion && (
                        <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                          <Building className="w-4 h-4 text-slate-500" />
                          <span className="text-sm text-foreground font-medium">{profile.institucion}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                        <MapPin className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-foreground font-medium capitalize">{profile.estado}</span>
                      </div>
                      {profile.especialidad && (
                        <div className="p-2 rounded-lg bg-slate-50">
                          <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1">Especialidad</p>
                          <p className="text-sm text-foreground font-medium">{profile.especialidad}</p>
                        </div>
                      )}
                      {profile.cargo && (
                        <div className="p-2 rounded-lg bg-slate-50">
                          <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-1">Cargo</p>
                          <p className="text-sm text-foreground font-medium">{profile.cargo}</p>
                        </div>
                      )}
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Modern Stats Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: BarChart3,
                title: 'Proyectos',
                value: '3',
                subtitle: 'Proyectos activos',
                color: 'from-[#9b2247] to-[#611232]',
                bgColor: 'bg-[#9b2247]/10',
                textColor: 'text-[#9b2247]',
                trend: '+12%'
              },
              {
                icon: Users,
                title: 'Colaboradores',
                value: '12',
                subtitle: 'Red de contactos',
                color: 'from-[#1e5b4f] to-[#002f2a]',
                bgColor: 'bg-[#1e5b4f]/10',
                textColor: 'text-[#1e5b4f]',
                trend: '+8%'
              },
              {
                icon: FileText,
                title: 'Publicaciones',
                value: '8',
                subtitle: 'Artículos compartidos',
                color: 'from-[#a57f2c] to-[#e6d194]',
                bgColor: 'bg-[#a57f2c]/10',
                textColor: 'text-[#a57f2c]',
                trend: '+24%'
              },
              {
                icon: Settings,
                title: 'Configuración',
                value: '95%',
                subtitle: 'Perfil completado',
                color: 'from-[#161a1d] to-[#98989A]',
                bgColor: 'bg-[#161a1d]/10',
                textColor: 'text-[#161a1d]',
                trend: 'Actualizar'
              }
            ].map((card, index) => (
              <div key={index} className="group relative">
                <div className="relative bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-white/60 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <card.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className={`px-2 py-1 ${card.bgColor} ${card.textColor} rounded-full text-xs font-medium`}>
                      {card.trend}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-semibold text-slate-700">{card.title}</h3>
                    <p className={`text-3xl font-bold ${card.textColor}`}>{card.value}</p>
                    <p className="text-sm text-slate-500">{card.subtitle}</p>
                  </div>

                  <div className="mt-4 h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${card.color} rounded-full transition-all duration-1000`} style={{ width: `${60 + index * 10}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* API IoT Section */}
          <div className="bg-gradient-to-r from-[#1e5b4f]/10 via-[#002f2a]/5 to-[#1e5b4f]/10 rounded-2xl border border-[#1e5b4f]/30 p-6 mb-8">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#1e5b4f] to-[#002f2a] rounded-xl flex items-center justify-center shadow-lg">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1e5b4f]">API Abierta para Dispositivos IoT</h3>
                  <p className="text-sm text-[#161a1d]/60">Conecta tus sensores y balizas de monitoreo</p>
                </div>
              </div>
              <div className="px-3 py-1 bg-[#1e5b4f]/10 text-[#1e5b4f] rounded-full text-xs font-medium">Beta</div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white/60 p-4 rounded-xl border border-[#1e5b4f]/20">
                <div className="text-2xl mb-2">📡</div>
                <h4 className="font-bold text-[#161a1d] text-sm mb-1">Device Ingestion API</h4>
                <p className="text-xs text-[#161a1d]/60">Envía datos desde cualquier sensor compatible con HTTP/MQTT/WebSocket</p>
              </div>
              <div className="bg-white/60 p-4 rounded-xl border border-[#1e5b4f]/20">
                <div className="text-2xl mb-2">📊</div>
                <h4 className="font-bold text-[#161a1d] text-sm mb-1">Sensor Data API</h4>
                <p className="text-xs text-[#161a1d]/60">Consulta datos históricos y en tiempo real de todos los dispositivos</p>
              </div>
              <div className="bg-white/60 p-4 rounded-xl border border-[#1e5b4f]/20">
                <div className="text-2xl mb-2">⚡</div>
                <h4 className="font-bold text-[#161a1d] text-sm mb-1">Telemetry API</h4>
                <p className="text-xs text-[#161a1d]/60">Monitoreo de estado y salud de dispositivos conectados</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between bg-white/60 p-4 rounded-xl border border-[#1e5b4f]/20">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-[#1e5b4f] rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-[#161a1d]">Protocolos soportados: HTTP, MQTT, WebSocket</span>
              </div>
              <Link href="/api-docs">
                <button className="px-4 py-2 bg-gradient-to-r from-[#1e5b4f] to-[#002f2a] text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all">
                  Ver Documentación
                </button>
              </Link>
            </div>
          </div>

          {/* Tools Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Argos Tool */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-xl p-6 hover:shadow-2xl transition-all duration-300 group cursor-pointer">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-[#9b2247] to-[#611232] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Map className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#9b2247] group-hover:text-[#611232] transition-colors">Argos</h3>
                  <p className="text-sm text-slate-600">Sistema de Monitoreo Activo</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3 text-sm">
                  <Activity className="w-4 h-4 text-[#9b2247]" />
                  <span className="text-slate-700">Mapas interactivos en tiempo real</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <BarChart3 className="w-4 h-4 text-[#9b2247]" />
                  <span className="text-slate-700">Visualización de datos dinámicos</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <MapPin className="w-4 h-4 text-[#9b2247]" />
                  <span className="text-slate-700">Monitoreo de cuencas hidrográficas</span>
                </div>
              </div>

              <Link href="/argos" className="block w-full">
                <button className="w-full bg-gradient-to-r from-[#9b2247] to-[#611232] text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg transition-all duration-200 group-hover:scale-105">
                  Abrir Argos
                </button>
              </Link>
            </div>

            {/* TlamatIA Tool */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-xl p-6 hover:shadow-2xl transition-all duration-300 group cursor-pointer">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-[#1e5b4f] to-[#002f2a] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                  <Brain className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1e5b4f] group-hover:text-[#002f2a] transition-colors">TlamatIA</h3>
                  <p className="text-sm text-slate-600">Agente Conversacional Inteligente</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3 text-sm">
                  <MessageCircle className="w-4 h-4 text-[#1e5b4f]" />
                  <span className="text-slate-700">Consultas científicas especializadas</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <FileText className="w-4 h-4 text-[#1e5b4f]" />
                  <span className="text-slate-700">Base de conocimiento amplia</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Users className="w-4 h-4 text-[#1e5b4f]" />
                  <span className="text-slate-700">Asistencia para investigadores</span>
                </div>
              </div>

              <Link href="/tlamatia" className="block w-full">
                <button className="w-full bg-gradient-to-r from-[#1e5b4f] to-[#002f2a] text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg transition-all duration-200 group-hover:scale-105">
                  Chatear con TlamatIA
                </button>
              </Link>
            </div>
          </div>

          {/* Modern Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Sensor Coverage Report */}
            <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#1e5b4f] to-[#002f2a] rounded-xl flex items-center justify-center">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Cobertura de Sensores</h3>
                </div>
                <button onClick={() => setShowRegisterDevice(true)} className="text-sm text-[#1e5b4f] hover:text-[#002f2a] font-medium">+ Registrar Sensor</button>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-[#1e5b4f]/10 to-[#1e5b4f]/5 p-4 rounded-xl border border-[#1e5b4f]/20">
                  <div className="text-3xl font-bold text-[#1e5b4f] mb-1">{sensorDevices.length}</div>
                  <div className="text-sm text-[#161a1d]/60">Sensores Activos</div>
                </div>
                <div className="bg-gradient-to-br from-[#9b2247]/10 to-[#9b2247]/5 p-4 rounded-xl border border-[#9b2247]/20">
                  <div className="text-3xl font-bold text-[#9b2247] mb-1">{sensorDevices.filter(d => d.type === 'water_quality').length}</div>
                  <div className="text-sm text-[#161a1d]/60">Calidad de Agua</div>
                </div>
                <div className="bg-gradient-to-br from-[#a57f2c]/10 to-[#a57f2c]/5 p-4 rounded-xl border border-[#a57f2c]/20">
                  <div className="text-3xl font-bold text-[#a57f2c] mb-1">{sensorDevices.filter(d => d.type === 'hydrology').length}</div>
                  <div className="text-sm text-[#161a1d]/60">Hidrología</div>
                </div>
              </div>

              <div className="space-y-3">
                {sensorDevices.map((sensor, index) => (
                  <div key={index} className="group flex items-center space-x-4 p-4 rounded-xl hover:bg-slate-50/80 transition-all duration-200 cursor-pointer border border-transparent hover:border-[#1e5b4f]/20">
                    <div className={`w-12 h-12 ${sensor.type === 'water_quality' ? 'bg-[#1e5b4f]' : 'bg-[#9b2247]'} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                      <span className="text-xl">{sensor.type === 'water_quality' ? '💧' : '🌊'}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-foreground">{sensor.name}</h4>
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-[#1e5b4f] rounded-full animate-pulse"></div>
                          <span className="text-xs text-[#1e5b4f] font-medium">
                            {sensor.last_seen ? new Date(sensor.last_seen).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : 'Sin datos'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-[#161a1d]/60">{sensor.type === 'water_quality' ? 'Calidad de Agua' : 'Hidrología'}</span>
                        <span className="w-1 h-1 bg-[#161a1d]/30 rounded-full"></span>
                        <span className="text-sm text-[#161a1d]/60">📍 {sensor.municipality}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-[#1e5b4f]/5 to-[#9b2247]/5 rounded-xl border border-[#1e5b4f]/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-[#1e5b4f] rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-[#161a1d]">Cobertura actual: {new Set(sensorDevices.map(d => d.municipality)).size} municipios monitoreados</span>
                  </div>
                  <Link href="/argos" className="text-sm text-[#1e5b4f] hover:text-[#002f2a] font-medium">Ver en Argos →</Link>
                </div>
              </div>
            </div>

            {/* Enhanced Quick Actions */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-xl p-6">
              <h3 className="text-xl font-bold text-foreground mb-6">Accesos Rápidos</h3>

              <div className="space-y-3">
                {[
                  {
                    title: 'Argos - Monitoreo',
                    subtitle: 'Sistema de monitoreo activo',
                    icon: '🗺️',
                    color: 'from-[#9b2247] to-[#611232]',
                    tool: 'argos',
                    href: '/argos'
                  },
                  {
                    title: 'TlamatIA',
                    subtitle: 'Agente conversacional inteligente',
                    icon: '🧠',
                    color: 'from-[#1e5b4f] to-[#002f2a]',
                    tool: 'tlamatia',
                    href: '/tlamatia'
                  },
                  {
                    title: 'Crear Proyecto',
                    subtitle: 'Nuevo proyecto de investigación',
                    icon: '🔬',
                    color: 'from-[#a57f2c] to-[#e6d194]',
                    href: '/dashboard/projects/create'
                  },
                  {
                    title: 'Explorar Proyectos',
                    subtitle: 'Descubre y colabora',
                    icon: '🌍',
                    color: 'from-[#161a1d] to-[#98989A]',
                    href: '/dashboard/projects/explore'
                  },
                  {
                    title: 'Generar Reporte',
                    subtitle: 'Análisis y métricas',
                    icon: '📋',
                    color: 'from-[#611232] to-[#161a1d]'
                  }
                ].map((action, index) => {
                  const ButtonContent = (
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                        <span className="text-lg">{action.icon}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground group-hover:text-[#9b2247] transition-colors">{action.title}</p>
                        <p className="text-sm text-slate-500">{action.subtitle}</p>
                      </div>
                    </div>
                  );

                  if (action.href) {
                    return (
                      <Link key={index} href={action.href} className="group block w-full text-left p-4 rounded-xl hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 transition-all duration-200 border border-transparent hover:border-slate-200">
                        {ButtonContent}
                      </Link>
                    );
                  }

                  return (
                    <button key={index} onClick={() => setShowReportModal(true)} className="group block w-full text-left p-4 rounded-xl hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 transition-all duration-200 border border-transparent hover:border-slate-200">
                      {ButtonContent}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Reporte */}
      <ReportIncidentModal
        isOpen={showReportModal}
        onClose={closeReportModal}
        user={user}
      />

      {/* Modal de Registro de Dispositivo */}
      <RegisterDeviceModal
        isOpen={showRegisterDevice}
        onClose={() => {
          setShowRegisterDevice(false);
          loadSensorDevices();
        }}
      />
    </div>
  );
}