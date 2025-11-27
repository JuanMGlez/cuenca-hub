'use client';

import { useState, useEffect } from 'react';
import { Calendar, Play, AlertTriangle, Droplets, Activity, TrendingUp, TrendingDown, Loader2, RefreshCw, MapPin, Thermometer, Eye, Waves, CheckCircle, XCircle, Map, Settings, Info } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, RadialBarChart, RadialBar, Legend, Tooltip } from 'recharts';
import { DashboardSkeleton } from './SkeletonLoader';
import AreaSelector from './AreaSelector';
import clsx from 'clsx';

interface WaterQualityData {
  metadata: {
    satellite_id: string;
    acquisition_date: string;
    processing_level: string;
    spatial_resolution_m: number;
    aoi_water_area_ha: number;
  };
  diagnostic_image_url?: string;
  indicators: {
    eutrophication_ndci: {
      mean_value: number;
      max_value: number;
      classification_breakdown_ha: {
        clean_oligotrophic: number;
        moderate_mesotrophic: number;
        high_eutrophic: number;
        critical_hypertrophic: number;
      };
    };
    macrophytes_fai: {
      mean_value: number;
      floating_vegetation_area_ha: number;
      percentage_coverage: number;
      invasion_status: string;
    };
    turbidity_ndti: {
      mean_value: number;
      sediment_load_status: string;
    };
    cyanobacteria_risk: {
      mean_ratio_2bda: number;
      high_risk_area_ha: number;
    };
  };
  quality_control: {
    cloud_probability_percent: number;
    valid_water_pixels: number;
  };
}

interface WaterQualityDashboardProps {
  onDataUpdate?: (data: WaterQualityData | null) => void;
}

export default function WaterQualityDashboard({ onDataUpdate }: WaterQualityDashboardProps) {
  const today = new Date();
  const oneMonthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
  const [dateStart, setDateStart] = useState(oneMonthAgo.toISOString().split('T')[0]);
  const [dateEnd, setDateEnd] = useState(today.toISOString().split('T')[0]);
  const [data, setData] = useState<WaterQualityData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState<number[][]>([]);
  const [showAreaSelector, setShowAreaSelector] = useState(false);

  const analyzeWaterQuality = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let response;
      
      if (selectedArea.length > 0) {
        const requestBody = {
          coordinates: selectedArea,
          date_start: dateStart,
          date_end: dateEnd,
          include_dashboard: true
        };
        console.log('POST Request:', requestBody);
        response = await fetch('http://localhost:8000/sentinel2/analisis', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        });
      } else {
        return; // Require area selection
      }
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
          body: errorText
        });
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: errorText };
        }
        throw new Error(errorData.error || `HTTP ${response.status}: ${errorText}`);
      }
      
      const analysisData: WaterQualityData = await response.json();
      console.log('Analysis data received:', analysisData);
      setData(analysisData);
      onDataUpdate?.(analysisData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar las bandas espectrales. Cobertura de nubes demasiado alta.');
    } finally {
      setLoading(false);
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return { color: '#1e5b4f', bg: 'from-[#1e5b4f] to-[#002f2a]' };
    if (score >= 60) return { color: '#a57f2c', bg: 'from-[#a57f2c] to-[#e6d194]' };
    return { color: '#9b2247', bg: 'from-[#9b2247] to-[#611232]' };
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'BAJO': 
      case 'MONITOR': return { color: '#1e5b4f', bg: 'bg-[#1e5b4f]/10', text: 'text-[#1e5b4f]', border: 'border-[#1e5b4f]/30' };
      case 'MEDIO': return { color: '#a57f2c', bg: 'bg-[#a57f2c]/10', text: 'text-[#a57f2c]', border: 'border-[#a57f2c]/30' };
      case 'ALTO': return { color: '#9b2247', bg: 'bg-[#9b2247]/10', text: 'text-[#9b2247]', border: 'border-[#9b2247]/30' };
      case 'CRITICO': return { color: '#611232', bg: 'bg-[#611232]/10', text: 'text-[#611232]', border: 'border-[#611232]/30' };
      default: return { color: '#98989A', bg: 'bg-[#98989A]/10', text: 'text-[#98989A]', border: 'border-[#98989A]/30' };
    }
  };

  // Calculate health score from eutrophication data
  const healthScore = data?.indicators?.eutrophication_ndci ? 
    Math.round((data.indicators.eutrophication_ndci.classification_breakdown_ha.clean_oligotrophic / 
    (data.indicators.eutrophication_ndci.classification_breakdown_ha.clean_oligotrophic + 
     data.indicators.eutrophication_ndci.classification_breakdown_ha.moderate_mesotrophic + 
     data.indicators.eutrophication_ndci.classification_breakdown_ha.high_eutrophic + 
     data.indicators.eutrophication_ndci.classification_breakdown_ha.critical_hypertrophic)) * 100) : 0;

  // Prepare chart data
  const eutrophicationData = data?.indicators?.eutrophication_ndci ? [
    { name: 'Oligotrófico', value: data.indicators.eutrophication_ndci.classification_breakdown_ha.clean_oligotrophic, color: '#1e5b4f' },
    { name: 'Mesotrófico', value: data.indicators.eutrophication_ndci.classification_breakdown_ha.moderate_mesotrophic, color: '#002f2a' },
    { name: 'Eutrófico', value: data.indicators.eutrophication_ndci.classification_breakdown_ha.high_eutrophic, color: '#a57f2c' },
    { name: 'Hipertrófico', value: data.indicators.eutrophication_ndci.classification_breakdown_ha.critical_hypertrophic, color: '#9b2247' }
  ] : [];

  const healthScoreData = healthScore ? [
    { name: 'Score', value: healthScore, fill: getHealthScoreColor(healthScore).color }
  ] : [];

  return (
    <div className="h-full flex flex-col">
      {/* Integrated Controls Bar */}
      <div className="flex items-center justify-between p-4 bg-white/90 backdrop-blur-sm border-b border-[#1e5b4f]/20">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-[#1e5b4f] rounded-full"></div>
            <span className="text-sm font-semibold text-[#1e5b4f]">Análisis Sentinel-2 - Cuenca Lerma-Chapala-Santiago</span>
          </div>
          <div className="flex items-center space-x-2 bg-[#1e5b4f]/10 rounded-lg px-3 py-2">
            <Calendar className="w-4 h-4 text-[#1e5b4f]" />
            <input
              type="date"
              value={dateStart}
              onChange={(e) => setDateStart(e.target.value)}
              className="bg-transparent text-xs font-medium text-[#161a1d] border-none outline-none w-24"
            />
            <span className="text-[#98989A] text-xs">—</span>
            <input
              type="date"
              value={dateEnd}
              onChange={(e) => setDateEnd(e.target.value)}
              className="bg-transparent text-xs font-medium text-[#161a1d] border-none outline-none w-24"
            />
          </div>
          
          <button
            onClick={() => setShowAreaSelector(!showAreaSelector)}
            className={clsx(
              "flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium transition-all",
              selectedArea.length > 0
                ? "bg-[#1e5b4f] text-white"
                : "bg-[#1e5b4f]/20 text-[#1e5b4f] hover:bg-[#1e5b4f]/30"
            )}
          >
            <Map className="w-4 h-4" />
            <span>{selectedArea.length > 0 ? 'Zona Seleccionada' : 'Seleccionar Zona'}</span>
          </button>
        </div>
        
        <button
          onClick={analyzeWaterQuality}
          disabled={loading || selectedArea.length === 0}
          className={clsx(
            "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all",
            loading || selectedArea.length === 0
              ? "bg-[#98989A]/30 text-[#98989A] cursor-not-allowed"
              : "bg-[#1e5b4f] text-white hover:bg-[#002f2a]"
          )}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analizando Cuenca...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>Analizar Calidad Hídrica</span>
            </>
          )}
        </button>
      </div>

      {/* Area Selector Modal */}
      {showAreaSelector && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] relative overflow-hidden">
            <div className="absolute top-2 right-2 z-20">
              <button
                onClick={() => setShowAreaSelector(false)}
                className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4">
              <AreaSelector 
                onAreaSelect={setSelectedArea}
                selectedArea={selectedArea}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {error && (
          <div className="m-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <XCircle className="w-5 h-5 text-red-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">Error en el análisis de la cuenca</p>
                <p className="text-xs text-red-600 mt-1">{error}</p>
              </div>
              <button onClick={analyzeWaterQuality} className="text-xs text-red-600 hover:underline font-medium">
                Reintentar
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div className="p-8">
            <DashboardSkeleton />
          </div>
        )}

        {data && !loading && data.indicators && (
          <div className="p-6 space-y-6">
            {/* Main Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Health Score */}
              <div className="bg-gradient-to-br from-[#1e5b4f]/5 to-[#1e5b4f]/10 backdrop-blur-sm p-4 rounded-xl border border-[#1e5b4f]/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#1e5b4f] font-medium">Salud de la Cuenca</span>
                  <div className={`flex items-center space-x-1 text-xs font-medium ${
                    healthScore >= 80 ? 'text-green-600' : healthScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    <TrendingUp className="w-3 h-3" />
                    <span>NDCI</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-[#1e5b4f]">{healthScore}%</span>
                  <div className={`w-3 h-3 rounded-full ${
                    healthScore >= 80 ? 'bg-green-500' : healthScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                </div>
              </div>

              {/* Vegetation */}
              <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-slate-200/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Vegetación</span>
                  <div className={clsx(
                    "text-xs font-medium px-2 py-1 rounded",
                    data?.indicators?.macrophytes_fai ? getRiskColor(data.indicators.macrophytes_fai.invasion_status).bg : 'bg-[#98989A]/10',
                    data?.indicators?.macrophytes_fai ? getRiskColor(data.indicators.macrophytes_fai.invasion_status).text : 'text-[#98989A]'
                  )}>
                    {data?.indicators?.macrophytes_fai?.invasion_status || 'N/A'}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-[#a57f2c]">
                    {data?.indicators?.macrophytes_fai?.floating_vegetation_area_ha?.toFixed(0) || '0'} ha
                  </span>
                  <div className="w-12 h-1 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 bg-[#a57f2c]" 
                      style={{width: `${Math.min(100, (data?.indicators?.macrophytes_fai?.percentage_coverage || 0) * 2)}%`}}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Area */}
              <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-slate-200/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Área Analizada</span>
                  <div className="text-xs text-[#9b2247] font-medium">
                    {data?.metadata?.satellite_id || 'S2'}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-[#9b2247]">
                    {(data?.metadata?.aoi_water_area_ha / 100)?.toFixed(1) || '0'} km²
                  </span>
                  <div className="w-12 h-1 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-1000 bg-[#9b2247] w-full"></div>
                  </div>
                </div>
              </div>

              {/* Quality Control */}
              <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-slate-200/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Calidad</span>
                  <div className={`flex items-center space-x-1 text-xs font-medium ${
                    (data?.quality_control?.cloud_probability_percent || 0) < 20 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <Eye className="w-3 h-3" />
                    <span>Nubes</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-[#161a1d]">
                    {data?.quality_control?.cloud_probability_percent || 0}%
                  </span>
                  <div className="w-12 h-1 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 bg-[#161a1d]" 
                      style={{width: `${100 - (data?.quality_control?.cloud_probability_percent || 0)}%`}}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Eutrophication Chart */}
              <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-slate-200/60">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-[#1e5b4f]">Estado Trófico - Cuenca Lerma-Chapala-Santiago</h3>
                  <span className="text-xs text-slate-500">
                    {data?.metadata?.acquisition_date ? new Date(data.metadata.acquisition_date).toLocaleDateString('es-ES') : 'N/A'}
                  </span>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={eutrophicationData}>
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip formatter={(value: number) => [`${value.toFixed(0)} ha`, 'Área']} />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {eutrophicationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Health Score Radial */}
              <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-slate-200/60">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-[#1e5b4f]">Índice de Salud Hídrica</h3>
                  <span className="text-xs text-slate-500">
                    NDCI: {data?.indicators?.eutrophication_ndci?.mean_value?.toFixed(3) || 'N/A'}
                  </span>
                </div>
                <div className="relative h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart cx="50%" cy="50%" innerRadius="40%" outerRadius="80%" data={healthScoreData}>
                      <RadialBar dataKey="value" cornerRadius={8} fill={getHealthScoreColor(healthScore).color} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[#1e5b4f]">{healthScore}</div>
                      <div className="text-sm text-[#1e5b4f] font-medium">Cuenca L-C-S</div>
                      <div className="text-xs text-slate-500 mt-1">
                        {healthScore >= 80 ? 'Excelente' : healthScore >= 60 ? 'Buena' : 'Requiere Atención'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-slate-200/60 text-center">
                <div className="text-lg font-bold text-[#1e5b4f]">
                  {data?.indicators?.eutrophication_ndci?.classification_breakdown_ha?.clean_oligotrophic?.toFixed(0) || '0'}
                </div>
                <div className="text-xs text-slate-600 mt-1">Hectáreas Limpias</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-slate-200/60 text-center">
                <div className="text-lg font-bold text-[#a57f2c]">
                  {((data?.indicators?.eutrophication_ndci?.classification_breakdown_ha?.high_eutrophic || 0) + (data?.indicators?.eutrophication_ndci?.classification_breakdown_ha?.critical_hypertrophic || 0)).toFixed(0)}
                </div>
                <div className="text-xs text-slate-600 mt-1">Hectáreas Eutróficas</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-slate-200/60 text-center">
                <div className="text-lg font-bold text-[#9b2247]">
                  {data?.indicators?.turbidity_ndti?.mean_value?.toFixed(2) || 'N/A'}
                </div>
                <div className="text-xs text-slate-600 mt-1">NDTI Turbidez</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-slate-200/60 text-center">
                <div className="text-lg font-bold text-[#161a1d]">
                  {data?.quality_control?.valid_water_pixels?.toLocaleString() || '0'}
                </div>
                <div className="text-xs text-slate-600 mt-1">Píxeles Válidos</div>
              </div>
            </div>

            {/* Diagnostic Image */}
            {data.diagnostic_image_url && (
              <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-slate-200/60">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-[#1e5b4f]">Imagen de Diagnóstico Sentinel-2</h3>
                  <a href={data.diagnostic_image_url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#1e5b4f] hover:text-[#002f2a] font-medium">
                    Abrir en nueva pestaña →
                  </a>
                </div>
                <img src={data.diagnostic_image_url} alt="Diagnóstico Sentinel-2" className="w-full rounded-lg" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}