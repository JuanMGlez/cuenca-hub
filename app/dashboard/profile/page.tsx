'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { Save, ArrowLeft, User as UserIcon, Building, MapPin, Briefcase, Award, Camera, Loader2 } from 'lucide-react';
import Link from 'next/link';

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
    cargo?: string;
    dependencia?: string;
    organizacion?: string;
    sector?: string;
    area_interes?: string;
    avatar_url?: string;
}

export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push('/login');
                return;
            }

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

        getUser();
    }, [router]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !profile) return;

        setSaving(true);
        setMessage(null);

        try {
            const { error } = await supabase
                .from('users')
                .update({
                    nombre: profile.nombre,
                    apellidos: profile.apellidos,
                    estado: profile.estado,
                    // Dynamic fields
                    institucion: profile.institucion,
                    ocupacion: profile.ocupacion,
                    comunidad: profile.comunidad,
                    grado: profile.grado,
                    cargo: profile.cargo,
                    dependencia: profile.dependencia,
                    organizacion: profile.organizacion,
                    sector: profile.sector,
                    area_interes: profile.area_interes,
                })
                .eq('id', user.id);

            if (error) throw error;

            setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });
            router.refresh();
        } catch (error) {
            console.error('Error actualizando perfil:', error);
            setMessage({ type: 'error', text: 'Error al actualizar el perfil' });
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (!profile) return;
        const { name, value } = e.target;
        setProfile({ ...profile, [name]: value });
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0 || !user || !profile) {
            return;
        }

        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}-${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        setUploading(true);
        setMessage(null);

        try {
            // 1. Upload image to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            // 3. Update User Profile
            const { error: updateError } = await supabase
                .from('users')
                .update({ avatar_url: publicUrl })
                .eq('id', user.id);

            if (updateError) {
                throw updateError;
            }

            setProfile({ ...profile, avatar_url: publicUrl });
            setMessage({ type: 'success', text: 'Foto de perfil actualizada' });
            router.refresh();

        } catch (error: any) {
            console.error('Error uploading avatar:', error);
            setMessage({
                type: 'error',
                text: `Error al subir la imagen: ${error.message || 'Error desconocido'}`
            });
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 py-8 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center text-slate-600 hover:text-primary transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver al Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold text-foreground">Editar Perfil</h1>
                    <p className="text-slate-500">Actualiza tu información personal y profesional</p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-xl p-8">
                    {message && (
                        <div className={`mb-6 p-4 rounded-xl ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                            }`}>
                            {message.text}
                        </div>
                    )}

                    <div className="flex flex-col items-center mb-8">
                        <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-slate-100 flex items-center justify-center">
                                {profile?.avatar_url ? (
                                    <img
                                        src={profile.avatar_url}
                                        alt="Avatar"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <UserIcon className="w-10 h-10 text-slate-400" />
                                )}
                                {uploading && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                                    </div>
                                )}
                            </div>
                            <div className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-md group-hover:scale-110 transition-transform">
                                <Camera className="w-4 h-4" />
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/*"
                            />
                        </div>
                        <p className="text-sm text-slate-500 mt-2">Click para cambiar foto</p>
                    </div>

                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Nombre</label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={profile?.nombre || ''}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white/50"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Apellidos</label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        name="apellidos"
                                        value={profile?.apellidos || ''}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white/50"
                                    />
                                </div>
                            </div>

                            {/* Dynamic Fields based on User Type */}
                            {profile?.tipo_usuario === 'comunitario' && (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Ocupación</label>
                                        <div className="relative">
                                            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type="text"
                                                name="ocupacion"
                                                value={profile?.ocupacion || ''}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white/50"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Comunidad</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type="text"
                                                name="comunidad"
                                                value={profile?.comunidad || ''}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white/50"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Área de Interés</label>
                                        <div className="relative">
                                            <Award className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type="text"
                                                name="area_interes"
                                                value={profile?.area_interes || ''}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white/50"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {profile?.tipo_usuario === 'academico' && (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Grado Académico</label>
                                        <div className="relative">
                                            <Award className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type="text"
                                                name="grado"
                                                value={profile?.grado || ''}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white/50"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Institución</label>
                                        <div className="relative">
                                            <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type="text"
                                                name="institucion"
                                                value={profile?.institucion || ''}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white/50"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Área de Interés</label>
                                        <div className="relative">
                                            <Award className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type="text"
                                                name="area_interes"
                                                value={profile?.area_interes || ''}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white/50"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {profile?.tipo_usuario === 'institucional' && (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Cargo</label>
                                        <div className="relative">
                                            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type="text"
                                                name="cargo"
                                                value={profile?.cargo || ''}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white/50"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Dependencia</label>
                                        <div className="relative">
                                            <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type="text"
                                                name="dependencia"
                                                value={profile?.dependencia || ''}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white/50"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Institución</label>
                                        <div className="relative">
                                            <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type="text"
                                                name="institucion"
                                                value={profile?.institucion || ''}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white/50"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {profile?.tipo_usuario === 'organizacional' && (
                                <>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Organización</label>
                                        <div className="relative">
                                            <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type="text"
                                                name="organizacion"
                                                value={profile?.organizacion || ''}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white/50"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Sector</label>
                                        <div className="relative">
                                            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type="text"
                                                name="sector"
                                                value={profile?.sector || ''}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white/50"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Cargo</label>
                                        <div className="relative">
                                            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type="text"
                                                name="cargo"
                                                value={profile?.cargo || ''}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white/50"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-medium shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save className="w-4 h-4" />
                                <span>{saving ? 'Guardando...' : 'Guardar Cambios'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
