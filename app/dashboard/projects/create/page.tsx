'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, ArrowRight, Check, Users, Target, FileText, Calendar, Sparkles, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function CreateProjectPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        visibility: 'public',
        status: 'planning',
        team_members: '', // Comma separated emails
        goals: '',
        start_date: '',
        location: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('No authenticated user found');

            // 1. Create Project
            const { data: project, error: projectError } = await supabase
                .from('projects')
                .insert({
                    title: formData.title,
                    description: formData.description,
                    visibility: formData.visibility,
                    status: formData.status,
                    start_date: formData.start_date || null,
                    location: formData.location || null,
                    owner_id: user.id
                })
                .select()
                .single();

            if (projectError) throw projectError;

            // 2. Add Owner as Admin
            const { error: memberError } = await supabase
                .from('project_members')
                .insert({
                    project_id: project.id,
                    user_id: user.id,
                    role: 'admin'
                });

            if (memberError) throw memberError;

            // 3. Process Invitations
            if (formData.team_members.trim()) {
                const emails = formData.team_members.split(',').map(e => e.trim()).filter(e => e);
                if (emails.length > 0) {
                    const invitations = emails.map(email => ({
                        project_id: project.id,
                        email: email,
                        invited_by: user.id,
                        role: 'collaborator'
                    }));
                    await supabase.from('project_invitations').insert(invitations);
                }
            }

            router.push('/dashboard');
        } catch (error) {
            console.error('Error creating project:', error);
            alert('Error al crear el proyecto. Por favor intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f9fa] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-full h-96 bg-gradient-to-bl from-[#1e5b4f]/5 to-transparent -z-10" />

            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-10">
                    {/* Botón volver alineado a la izquierda */}
                    <div className="mb-6">
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center text-sm font-medium text-[#98989A] hover:text-[#161a1d] transition-colors group"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Cancelar y Volver
                        </Link>
                    </div>

                    {/* Títulos centrados */}
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-[#161a1d] tracking-tight mb-3">
                            Crear Nuevo Proyecto
                        </h1>
                        <p className="text-[#161a1d]/60 text-lg">
                            Configura tu espacio de colaboración en 3 sencillos pasos.
                        </p>
                    </div>
                </div>


                {/* Progress Steps */}
                <div className="mb-12 relative">
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-[#e2e8f0] rounded-full -z-10"></div>
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-[#1e5b4f] rounded-full -z-10 transition-all duration-500 ease-out" style={{ width: `${((step - 1) / 2) * 100}%` }}></div>

                    <div className="flex justify-between w-full px-4">
                        {[
                            { num: 1, icon: FileText, label: 'Detalles' },
                            { num: 2, icon: Users, label: 'Equipo' },
                            { num: 3, icon: Target, label: 'Objetivos' }
                        ].map((s) => (
                            <div key={s.num} className="flex flex-col items-center group">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-4 transition-all duration-300 shadow-lg ${step >= s.num
                                    ? 'bg-[#1e5b4f] border-[#f8f9fa] text-white scale-110'
                                    : 'bg-white border-[#f8f9fa] text-[#98989A]'
                                    }`}>
                                    <s.icon className="w-5 h-5" />
                                </div>
                                <span className={`mt-3 text-xs font-bold uppercase tracking-wider transition-colors ${step >= s.num ? 'text-[#1e5b4f]' : 'text-[#98989A]'
                                    }`}>{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Content */}
                <div className="bg-white rounded-3xl shadow-xl shadow-[#161a1d]/5 border border-[#161a1d]/5 overflow-hidden relative">
                    <div className="p-8 md:p-10 min-h-[400px]">
                        {step === 1 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-[#161a1d] uppercase tracking-wide">Nombre del Proyecto</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        placeholder="Ej. Restauración de Humedales Lerma"
                                        className="w-full px-5 py-4 rounded-xl bg-[#f8f9fa] border-2 border-transparent focus:bg-white focus:border-[#1e5b4f]/20 focus:ring-4 focus:ring-[#1e5b4f]/10 outline-none transition-all text-[#161a1d] placeholder-[#98989A] font-medium"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-[#161a1d] uppercase tracking-wide">Descripción Corta</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows={4}
                                        placeholder="Describe el propósito y alcance..."
                                        className="w-full px-5 py-4 rounded-xl bg-[#f8f9fa] border-2 border-transparent focus:bg-white focus:border-[#1e5b4f]/20 focus:ring-4 focus:ring-[#1e5b4f]/10 outline-none transition-all text-[#161a1d] placeholder-[#98989A] font-medium resize-none"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-sm font-bold text-[#161a1d] uppercase tracking-wide">Ubicación</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-5 top-1/2 transform -translate-y-1/2 text-[#98989A] w-5 h-5" />
                                            <input
                                                type="text"
                                                name="location"
                                                value={formData.location}
                                                onChange={handleInputChange}
                                                placeholder="Ej. Cuenca Alta"
                                                className="w-full pl-12 pr-5 py-4 rounded-xl bg-[#f8f9fa] border-2 border-transparent focus:bg-white focus:border-[#1e5b4f]/20 focus:ring-4 focus:ring-[#1e5b4f]/10 outline-none transition-all text-[#161a1d] font-medium"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-sm font-bold text-[#161a1d] uppercase tracking-wide">Fecha de Inicio</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-5 top-1/2 transform -translate-y-1/2 text-[#98989A] w-5 h-5" />
                                            <input
                                                type="date"
                                                name="start_date"
                                                value={formData.start_date}
                                                onChange={handleInputChange}
                                                className="w-full pl-12 pr-5 py-4 rounded-xl bg-[#f8f9fa] border-2 border-transparent focus:bg-white focus:border-[#1e5b4f]/20 focus:ring-4 focus:ring-[#1e5b4f]/10 outline-none transition-all text-[#161a1d] font-medium"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                                <div className="bg-[#1e5b4f]/5 border border-[#1e5b4f]/10 rounded-2xl p-6 flex items-start space-x-4">
                                    <div className="p-2 bg-[#1e5b4f]/10 rounded-lg">
                                        <Users className="w-6 h-6 text-[#1e5b4f]" />
                                    </div>
                                    <div>
                                        <h4 className="text-base font-bold text-[#1e5b4f]">Trabajo en Equipo</h4>
                                        <p className="text-sm text-[#1e5b4f]/80 mt-1 leading-relaxed">
                                            Invita a investigadores, estudiantes o miembros de la comunidad. Puedes agregar más personas después.
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-[#161a1d] uppercase tracking-wide">Correos Electrónicos</label>
                                    <textarea
                                        name="team_members"
                                        value={formData.team_members}
                                        onChange={handleInputChange}
                                        rows={4}
                                        placeholder="correo@ejemplo.com, investigador@universidad.edu..."
                                        className="w-full px-5 py-4 rounded-xl bg-[#f8f9fa] border-2 border-transparent focus:bg-white focus:border-[#1e5b4f]/20 focus:ring-4 focus:ring-[#1e5b4f]/10 outline-none transition-all text-[#161a1d] placeholder-[#98989A] font-medium resize-none"
                                    />
                                    <p className="text-xs font-medium text-[#98989A] flex items-center">
                                        <Sparkles className="w-3 h-3 mr-1 text-[#a57f2c]" />
                                        Separa los correos con comas
                                    </p>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-[#161a1d] uppercase tracking-wide">Objetivos Iniciales</label>
                                    <textarea
                                        name="goals"
                                        value={formData.goals}
                                        onChange={handleInputChange}
                                        rows={6}
                                        placeholder="- Realizar muestreo de calidad de agua...&#10;- Analizar datos históricos...&#10;- Publicar resultados..."
                                        className="w-full px-5 py-4 rounded-xl bg-[#f8f9fa] border-2 border-transparent focus:bg-white focus:border-[#1e5b4f]/20 focus:ring-4 focus:ring-[#1e5b4f]/10 outline-none transition-all text-[#161a1d] placeholder-[#98989A] font-medium resize-none"
                                    />
                                </div>

                                <div className="bg-[#a57f2c]/5 border border-[#a57f2c]/10 rounded-2xl p-6 flex items-start space-x-4">
                                    <div className="p-2 bg-[#a57f2c]/10 rounded-lg">
                                        <Target className="w-6 h-6 text-[#a57f2c]" />
                                    </div>
                                    <div>
                                        <h4 className="text-base font-bold text-[#a57f2c]">¡Casi listo!</h4>
                                        <p className="text-sm text-[#a57f2c]/80 mt-1 leading-relaxed">
                                            Al crear el proyecto, serás asignado automáticamente como Administrador y tu proyecto será visible para la comunidad.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="bg-[#f8f9fa]/50 backdrop-blur-sm px-10 py-6 border-t border-[#161a1d]/5 flex justify-between items-center">
                        <button
                            onClick={handleBack}
                            disabled={step === 1}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${step === 1
                                ? 'text-[#98989A]/50 cursor-not-allowed'
                                : 'text-[#161a1d] hover:bg-[#161a1d]/5'
                                }`}
                        >
                            Atrás
                        </button>

                        {step < 3 ? (
                            <button
                                onClick={handleNext}
                                disabled={!formData.title && step === 1}
                                className="group flex items-center space-x-2 bg-[#161a1d] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#161a1d]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                            >
                                <span>Siguiente</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="group flex items-center space-x-2 bg-gradient-to-r from-[#1e5b4f] to-[#002f2a] text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-[#1e5b4f]/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Check className="w-4 h-4" />
                                        <span>Crear Proyecto</span>
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
