'use client';

import { useState, useEffect } from 'react';
import { MapPin, X, AlertTriangle, Camera, Droplets, FileCheck, Trash2, CheckCircle2, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface ReportForm {
    location: {
        lat: number;
        lng: number;
        reference: string;
        municipality: string;
    };
    incident: {
        type: string;
        urgency: 'info' | 'caution' | 'emergency';
        evidence: File | null;
    };
    measurements: {
        hasSensor: boolean;
        ph?: number;
        temperature?: number;
        turbidity?: number;
    };
    narrative: {
        description: string;
        impact: string;
    };
}

interface ReportIncidentModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
}

export default function ReportIncidentModal({ isOpen, onClose, user }: ReportIncidentModalProps) {
    const [reportForm, setReportForm] = useState<ReportForm>({
        location: { lat: 0, lng: 0, reference: '', municipality: '' },
        incident: { type: '', urgency: 'info', evidence: null },
        measurements: { hasSensor: false },
        narrative: { description: '', impact: '' }
    });
    const [isSuccess, setIsSuccess] = useState(false);
    const [loadingLocation, setLoadingLocation] = useState(false);

    const getLocation = () => {
        if (navigator.geolocation) {
            setLoadingLocation(true);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setReportForm(prev => ({
                        ...prev,
                        location: {
                            ...prev.location,
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        }
                    }));
                    setLoadingLocation(false);
                },
                (error) => {
                    console.log('Error obteniendo ubicación:', error);
                    setLoadingLocation(false);
                    alert('No se pudo obtener la ubicación. Por favor verifique los permisos de su navegador.');
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        } else {
            alert('La geolocalización no es soportada por este navegador.');
        }
    };

    useEffect(() => {
        if (isOpen) {
            getLocation();
        }
    }, [isOpen]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateReportForm = (section: keyof ReportForm, field: string, value: any) => {
        setReportForm(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const uploadImage = async (file: File) => {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('reports-evidence')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage
                .from('reports-evidence')
                .getPublicUrl(filePath);

            return data.publicUrl;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    };

    const handleSubmitReport = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            let imageUrl = null;
            if (reportForm.incident.evidence) {
                imageUrl = await uploadImage(reportForm.incident.evidence);
            }

            const { error } = await supabase.from('reports').insert({
                user_id: user ? user.id : null,
                image_url: imageUrl,
                location_lat: reportForm.location.lat,
                location_lng: reportForm.location.lng,
                municipality: reportForm.location.municipality,
                reference: reportForm.location.reference,
                incident_type: reportForm.incident.type,
                urgency: reportForm.incident.urgency,
                has_sensor: reportForm.measurements.hasSensor,
                ph: reportForm.measurements.hasSensor ? reportForm.measurements.ph : null,
                temperature: reportForm.measurements.hasSensor ? reportForm.measurements.temperature : null,
                turbidity: reportForm.measurements.hasSensor ? reportForm.measurements.turbidity : null,
                description: reportForm.narrative.description
            });

            if (error) throw error;

            // alert('¡Reporte enviado exitosamente!');
            // onClose();
            setIsSuccess(true);

            // Resetear formulario
            setReportForm({
                location: { lat: 0, lng: 0, reference: '', municipality: '' },
                incident: { type: '', urgency: 'info', evidence: null },
                measurements: { hasSensor: false },
                narrative: { description: '', impact: '' }
            });
        } catch (error) {
            console.error('Error enviando reporte:', error);
            alert('Error al enviar el reporte. Por favor intente nuevamente.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[2000] p-4 pt-20">
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl w-full max-w-4xl shadow-[0_32px_64px_rgba(22,26,29,0.15)] transform transition-all duration-500 ease-out scale-100 max-h-[70vh] flex flex-col border border-[#98989A]/20 ring-1 ring-white/50">
                {/* Header */}
                {!isSuccess && (
                    <div className="rounded-t-3xl p-6 bg-gradient-to-br from-white via-[#e6d194]/5 to-white/90 border-b border-[#98989A]/20">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-gradient-to-br from-[#1e5b4f] to-[#002f2a] rounded-2xl shadow-lg">
                                    <MapPin className="w-6 h-6 text-[#e6d194]" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-[#161a1d] tracking-tight">Reportar Incidente</h2>
                                    <p className="text-[#98989A] text-sm font-medium">Ayuda a proteger nuestra cuenca</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-3 hover:bg-[#98989A]/10 rounded-2xl transition-all duration-300 group border border-[#98989A]/20">
                                <X className="w-5 h-5 text-[#161a1d] group-hover:rotate-90 transition-transform duration-300" />
                            </button>
                        </div>
                    </div>
                )}

                <div className="p-6 overflow-y-auto flex-1 bg-gradient-to-br from-white via-[#e6d194]/5 to-white/90">
                    {isSuccess ? (
                        <div className="flex flex-col items-center justify-center h-full py-12 animate-in zoom-in duration-500">
                            <div className="w-24 h-24 bg-gradient-to-br from-[#1e5b4f] to-[#002f2a] rounded-full flex items-center justify-center shadow-xl mb-6 animate-bounce">
                                <CheckCircle2 className="w-12 h-12 text-[#e6d194]" />
                            </div>
                            <h2 className="text-3xl font-bold text-[#161a1d] mb-2 text-center">¡Reporte Enviado!</h2>
                            <p className="text-[#98989A] text-center max-w-md mb-8">
                                Gracias por tu contribución. Tu reporte ha sido registrado exitosamente y será analizado por nuestro equipo.
                            </p>
                            <button
                                onClick={() => {
                                    setIsSuccess(false);
                                    onClose();
                                }}
                                className="px-8 py-3 bg-gradient-to-r from-[#1e5b4f] to-[#002f2a] text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                            >
                                Entendido
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmitReport} className="space-y-8">
                            {/* 1. Ubicación */}
                            <div className="group relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-[#1e5b4f] to-[#a57f2c] rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
                                <div className="relative bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-[#98989A]/20 shadow-lg hover:shadow-xl transition-all duration-300">
                                    <div className="flex items-center space-x-4 mb-6">
                                        <div className="p-3 bg-gradient-to-br from-[#1e5b4f] to-[#002f2a] rounded-2xl shadow-lg">
                                            <MapPin className="w-6 h-6 text-[#e6d194]" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-[#161a1d] tracking-tight">Ubicación del Incidente</h3>
                                            <p className="text-[#98989A] text-sm font-medium">Especifica dónde ocurrió el problema</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-bold text-[#161a1d] mb-3 flex items-center">
                                                <div className="w-2 h-2 bg-[#1e5b4f] rounded-full mr-2"></div>
                                                Coordenadas GPS
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={loadingLocation ? 'Obteniendo ubicación...' : `${reportForm.location.lat.toFixed(6)}, ${reportForm.location.lng.toFixed(6)}`}
                                                    readOnly
                                                    className="w-full p-4 pr-12 bg-gradient-to-r from-[#e6d194]/10 to-[#a57f2c]/5 border-2 border-[#a57f2c]/30 rounded-2xl text-sm font-mono text-[#161a1d] focus:outline-none shadow-inner"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={getLocation}
                                                    disabled={loadingLocation}
                                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 hover:bg-[#a57f2c]/10 rounded-xl transition-colors group/refresh"
                                                    title="Actualizar ubicación"
                                                >
                                                    <RefreshCw className={`w-5 h-5 text-[#1e5b4f] ${loadingLocation ? 'animate-spin' : 'group-hover/refresh:rotate-180 transition-transform duration-500'}`} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-bold text-[#161a1d] mb-3 flex items-center">
                                                <div className="w-2 h-2 bg-[#9b2247] rounded-full mr-2"></div>
                                                Municipio/Zona
                                            </label>
                                            <select
                                                value={reportForm.location.municipality}
                                                onChange={(e) => updateReportForm('location', 'municipality', e.target.value)}
                                                className="w-full p-4 bg-white/90 border-2 border-[#98989A]/30 rounded-2xl text-sm text-[#161a1d] focus:border-[#9b2247] focus:outline-none focus:ring-4 focus:ring-[#9b2247]/10 transition-all duration-300 shadow-sm hover:shadow-md"
                                                required
                                            >
                                                <option value="">Seleccionar...</option>
                                                <option value="Chapala">Chapala</option>
                                                <option value="Ocotlán">Ocotlán</option>
                                                <option value="Toluca">Toluca</option>
                                                <option value="Guadalajara">Guadalajara</option>
                                                <option value="León">León</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="mt-6">
                                        <label className="block text-sm font-bold text-[#161a1d] mb-3 flex items-center">
                                            <div className="w-2 h-2 bg-[#a57f2c] rounded-full mr-2"></div>
                                            Referencia Visual
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="Ej: Frente a la escuela primaria, cerca del puente..."
                                                value={reportForm.location.reference}
                                                onChange={(e) => updateReportForm('location', 'reference', e.target.value)}
                                                className="w-full p-4 bg-white/90 border-2 border-[#98989A]/30 rounded-2xl text-sm text-[#161a1d] focus:border-[#a57f2c] focus:outline-none focus:ring-4 focus:ring-[#a57f2c]/10 transition-all duration-300 shadow-sm hover:shadow-md placeholder:text-[#98989A]"
                                                required
                                            />
                                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#98989A]">
                                                📍
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 2. Diagnóstico Visual */}
                            <div className="group relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-[#9b2247] to-[#611232] rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
                                <div className="relative bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-[#98989A]/20 shadow-lg hover:shadow-xl transition-all duration-300">
                                    <div className="flex items-center space-x-4 mb-6">
                                        <div className="p-3 bg-gradient-to-br from-[#9b2247] to-[#611232] rounded-2xl shadow-lg">
                                            <AlertTriangle className="w-6 h-6 text-[#e6d194]" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-[#161a1d] tracking-tight">Diagnóstico Visual</h3>
                                            <p className="text-[#98989A] text-sm font-medium">Describe el problema observado</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-bold text-[#161a1d] mb-3 flex items-center">
                                                <div className="w-2 h-2 bg-[#9b2247] rounded-full mr-2"></div>
                                                Tipo de Incidente
                                            </label>
                                            <select
                                                value={reportForm.incident.type}
                                                onChange={(e) => updateReportForm('incident', 'type', e.target.value)}
                                                className="w-full p-4 bg-white/90 border-2 border-[#98989A]/30 rounded-2xl text-sm text-[#161a1d] focus:border-[#9b2247] focus:outline-none focus:ring-4 focus:ring-[#9b2247]/10 transition-all duration-300 shadow-sm hover:shadow-md"
                                                required
                                            >
                                                <option value="">Seleccionar...</option>
                                                <option value="descarga_residual">Descarga de agua residual</option>
                                                <option value="basura">Basura acumulada / Obstrucción</option>
                                                <option value="olor">Olor ofensivo / Gases</option>
                                                <option value="mortandad">Mortandad de peces o fauna</option>
                                                <option value="coloracion">Cambio de coloración drástico</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-bold text-[#161a1d] mb-3 flex items-center">
                                                <div className="w-2 h-2 bg-[#611232] rounded-full mr-2"></div>
                                                Nivel de Urgencia
                                            </label>
                                            <select
                                                value={reportForm.incident.urgency}
                                                onChange={(e) => updateReportForm('incident', 'urgency', e.target.value)}
                                                className="w-full p-4 bg-white/90 border-2 border-[#98989A]/30 rounded-2xl text-sm text-[#161a1d] focus:border-[#611232] focus:outline-none focus:ring-4 focus:ring-[#611232]/10 transition-all duration-300 shadow-sm hover:shadow-md"
                                            >
                                                <option value="info">🟢 Informativo</option>
                                                <option value="caution">🟡 Precaución</option>
                                                <option value="emergency">🔴 Emergencia</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="mt-6">
                                        <label className="block text-sm font-bold text-[#161a1d] mb-3 flex items-center">
                                            <div className="w-2 h-2 bg-[#9b2247] rounded-full mr-2"></div>
                                            Evidencia Multimedia
                                        </label>
                                        <div className="relative group/upload">
                                            <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${reportForm.incident.evidence
                                                ? 'border-[#1e5b4f] bg-[#1e5b4f]/5'
                                                : 'border-[#9b2247]/40 bg-gradient-to-br from-[#e6d194]/10 via-white/50 to-[#9b2247]/5 hover:from-[#e6d194]/20 hover:to-[#9b2247]/10 group-hover/upload:border-[#9b2247] group-hover/upload:shadow-lg'
                                                }`}>

                                                {reportForm.incident.evidence ? (
                                                    <div className="flex flex-col items-center space-y-3 animate-in fade-in zoom-in duration-300">
                                                        <div className="p-4 bg-gradient-to-br from-[#1e5b4f] to-[#002f2a] rounded-2xl shadow-lg">
                                                            <FileCheck className="w-8 h-8 text-[#e6d194]" />
                                                        </div>
                                                        <div>
                                                            <p className="text-base font-bold text-[#161a1d] mb-1">Archivo seleccionado</p>
                                                            <p className="text-sm text-[#1e5b4f] font-medium break-all px-4">
                                                                {reportForm.incident.evidence.name}
                                                            </p>
                                                            <p className="text-xs text-[#98989A] mt-1">
                                                                {(reportForm.incident.evidence.size / 1024 / 1024).toFixed(2)} MB
                                                            </p>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                updateReportForm('incident', 'evidence', null);
                                                            }}
                                                            className="mt-2 flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                            <span>Eliminar</span>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center space-y-3">
                                                        <div className="p-4 bg-gradient-to-br from-[#9b2247] to-[#611232] rounded-2xl shadow-lg group-hover/upload:scale-110 transition-transform duration-300">
                                                            <Camera className="w-8 h-8 text-[#e6d194]" />
                                                        </div>
                                                        <div>
                                                            <p className="text-base font-bold text-[#161a1d] mb-1">Subir evidencia visual</p>
                                                            <p className="text-sm text-[#98989A]">Foto o video del incidente (Máx. 10MB)</p>
                                                        </div>
                                                        <input
                                                            type="file"
                                                            accept="image/*,video/*"
                                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                            onChange={(e) => {
                                                                if (e.target.files && e.target.files[0]) {
                                                                    updateReportForm('incident', 'evidence', e.target.files[0]);
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 3. Ciencia Ciudadana */}
                            <div className="group relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-[#1e5b4f] to-[#002f2a] rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
                                <div className="relative bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-[#98989A]/20 shadow-lg hover:shadow-xl transition-all duration-300">
                                    <div className="flex items-center space-x-4 mb-6">
                                        <div className="p-3 bg-gradient-to-br from-[#1e5b4f] to-[#002f2a] rounded-2xl shadow-lg">
                                            <Droplets className="w-6 h-6 text-[#e6d194]" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-[#161a1d] tracking-tight">Ciencia Ciudadana</h3>
                                            <p className="text-[#98989A] text-sm font-medium">Datos técnicos opcionales</p>
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                id="hasSensor"
                                                checked={reportForm.measurements.hasSensor}
                                                onChange={(e) => updateReportForm('measurements', 'hasSensor', e.target.checked)}
                                                className="sr-only peer"
                                            />
                                            <label htmlFor="hasSensor" className="flex items-center space-x-4 p-4 bg-gradient-to-r from-white/90 to-[#e6d194]/10 rounded-2xl border-2 border-[#98989A]/20 cursor-pointer hover:border-[#1e5b4f]/40 peer-checked:border-[#1e5b4f] peer-checked:bg-gradient-to-r peer-checked:from-[#1e5b4f]/5 peer-checked:to-[#002f2a]/5 transition-all duration-300 group/checkbox">
                                                <div className="relative">
                                                    <div className={`w-6 h-6 border-2 rounded-lg transition-all duration-300 flex items-center justify-center ${reportForm.measurements.hasSensor
                                                        ? 'bg-[#1e5b4f] border-[#1e5b4f]'
                                                        : 'bg-white border-[#98989A]'
                                                        }`}>
                                                        {reportForm.measurements.hasSensor && (
                                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-base font-bold text-[#161a1d] group-hover/checkbox:text-[#1e5b4f] transition-colors">¿Cuentas con un kit de medición?</p>
                                                    <p className="text-sm text-[#98989A]">Agrega datos técnicos para mayor precisión</p>
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    {reportForm.measurements.hasSensor && (
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in slide-in-from-top-2 duration-300">
                                            <div className="space-y-2">
                                                <label className="block text-sm font-bold text-[#161a1d] mb-2 flex items-center">
                                                    <div className="w-2 h-2 bg-[#1e5b4f] rounded-full mr-2"></div>
                                                    pH
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    min="0"
                                                    max="14"
                                                    value={reportForm.measurements.ph || ''}
                                                    onChange={(e) => updateReportForm('measurements', 'ph', parseFloat(e.target.value))}
                                                    className="w-full p-3 bg-white/90 border-2 border-[#98989A]/30 rounded-xl text-sm text-[#161a1d] focus:border-[#1e5b4f] focus:outline-none focus:ring-4 focus:ring-[#1e5b4f]/10 transition-all duration-300 shadow-sm hover:shadow-md"
                                                    placeholder="7.0"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-bold text-[#161a1d] mb-2 flex items-center">
                                                    <div className="w-2 h-2 bg-[#002f2a] rounded-full mr-2"></div>
                                                    Temperatura (°C)
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    value={reportForm.measurements.temperature || ''}
                                                    onChange={(e) => updateReportForm('measurements', 'temperature', parseFloat(e.target.value))}
                                                    className="w-full p-3 bg-white/90 border-2 border-[#98989A]/30 rounded-xl text-sm text-[#161a1d] focus:border-[#002f2a] focus:outline-none focus:ring-4 focus:ring-[#002f2a]/10 transition-all duration-300 shadow-sm hover:shadow-md"
                                                    placeholder="25.0"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-bold text-[#161a1d] mb-2 flex items-center">
                                                    <div className="w-2 h-2 bg-[#a57f2c] rounded-full mr-2"></div>
                                                    Turbidez (NTU)
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    min="0"
                                                    value={reportForm.measurements.turbidity || ''}
                                                    onChange={(e) => updateReportForm('measurements', 'turbidity', parseFloat(e.target.value))}
                                                    className="w-full p-3 bg-white/90 border-2 border-[#98989A]/30 rounded-xl text-sm text-[#161a1d] focus:border-[#a57f2c] focus:outline-none focus:ring-4 focus:ring-[#a57f2c]/10 transition-all duration-300 shadow-sm hover:shadow-md"
                                                    placeholder="10.0"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 4. Narrativa */}
                            <div className="group relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-[#a57f2c] to-[#e6d194] rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
                                <div className="relative bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-[#98989A]/20 shadow-lg hover:shadow-xl transition-all duration-300">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-bold text-[#161a1d] mb-3 flex items-center">
                                                <div className="w-2 h-2 bg-[#a57f2c] rounded-full mr-2"></div>
                                                Descripción Detallada
                                            </label>
                                            <textarea
                                                rows={4}
                                                value={reportForm.narrative.description}
                                                onChange={(e) => updateReportForm('narrative', 'description', e.target.value)}
                                                className="w-full p-4 bg-white/90 border-2 border-[#98989A]/30 rounded-2xl text-sm text-[#161a1d] focus:border-[#a57f2c] focus:outline-none focus:ring-4 focus:ring-[#a57f2c]/10 transition-all duration-300 shadow-sm hover:shadow-md resize-none"
                                                placeholder="Describe lo que observas con el mayor detalle posible..."
                                                required
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="flex items-center justify-end space-x-4 pt-4 border-t border-[#98989A]/20">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-6 py-3 rounded-xl text-[#161a1d] font-medium hover:bg-[#161a1d]/5 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-8 py-3 bg-gradient-to-r from-[#1e5b4f] to-[#002f2a] text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                                >
                                    Enviar Reporte
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div >
    );
}
