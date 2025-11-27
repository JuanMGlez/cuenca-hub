'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Search, Calendar, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Project {
    id: string;
    title: string;
    description: string;
    status: string;
    visibility: 'public' | 'private';
    owner_id: string;
    created_at: string;
    owner?: {
        email: string;
    };
}

export default function ExploreProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');


    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('visibility', 'public')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProjects(data || []);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredProjects = projects.filter(project => {
        const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.description?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    return (
        <div className="min-h-screen bg-[#f8f9fa] relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[#e6d194]/20 to-transparent -z-10" />

            <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
                {/* Header */}
                <div className="space-y-6">
                    <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-[#98989A] hover:text-[#161a1d] transition-colors group">
                        <ArrowRight className="w-4 h-4 mr-2 rotate-180 group-hover:-translate-x-1 transition-transform" />
                        Volver al Dashboard
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-4xl font-bold text-[#161a1d] tracking-tight mb-3">
                                Explorar Proyectos
                            </h1>
                            <p className="text-lg text-[#161a1d]/70 max-w-2xl">
                                Descubre iniciativas de restauración, únete a equipos multidisciplinarios y colabora en la regeneración de la cuenca.
                            </p>
                        </div>
                        <Link href="/dashboard/projects/create">
                            <button className="bg-gradient-to-r from-[#1e5b4f] to-[#002f2a] text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#1e5b4f]/30 hover:-translate-y-0.5 transition-all duration-300 flex items-center space-x-2">
                                <span>+ Nuevo Proyecto</span>
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Search */}
                <div className="bg-white/80 backdrop-blur-xl p-2 rounded-2xl shadow-xl shadow-[#161a1d]/5 border border-white/50 flex flex-col md:flex-row gap-2">
                    <div className="flex-1 relative group">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#98989A] group-focus-within:text-[#1e5b4f] transition-colors">
                            <Search className="w-5 h-5" />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar por nombre, descripción o palabras clave..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-transparent border-none focus:ring-0 text-[#161a1d] placeholder-[#98989A] font-medium"
                        />
                    </div>
                </div>

                {/* Projects Grid */}
                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-white rounded-3xl p-8 shadow-sm border border-[#161a1d]/5 h-72 animate-pulse flex flex-col">
                                <div className="w-12 h-12 bg-[#f8f9fa] rounded-2xl mb-6"></div>
                                <div className="h-6 bg-[#f8f9fa] rounded-lg w-3/4 mb-4"></div>
                                <div className="h-4 bg-[#f8f9fa] rounded-lg w-full mb-2"></div>
                                <div className="h-4 bg-[#f8f9fa] rounded-lg w-2/3 mb-auto"></div>
                                <div className="h-10 bg-[#f8f9fa] rounded-xl w-32"></div>
                            </div>
                        ))}
                    </div>
                ) : filteredProjects.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProjects.map((project) => (
                            <div key={project.id} className="group bg-white rounded-3xl p-8 shadow-sm border border-[#161a1d]/5 hover:shadow-2xl hover:shadow-[#161a1d]/5 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative overflow-hidden">
                                {/* Decorative Gradient */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#e6d194]/20 to-transparent rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />

                                <div className="flex items-start justify-between mb-6 relative">
                                    {/* Status and Globe removed */}
                                </div>

                                <h3 className="text-2xl font-bold text-[#161a1d] mb-3 line-clamp-2 group-hover:text-[#9b2247] transition-colors">
                                    {project.title}
                                </h3>
                                <p className="text-[#161a1d]/60 text-base leading-relaxed mb-8 line-clamp-3 flex-1">
                                    {project.description || 'Sin descripción disponible.'}
                                </p>

                                <div className="mt-auto pt-6 border-t border-[#161a1d]/5 flex items-center justify-between relative">
                                    <div className="flex items-center space-x-2 text-xs font-medium text-[#98989A]">
                                        <Calendar className="w-4 h-4" />
                                        <span>{new Date(project.created_at).toLocaleDateString()}</span>
                                    </div>

                                    <Link href={`/dashboard/projects/${project.id}`}>
                                        <button className="text-[#1e5b4f] font-bold text-sm flex items-center space-x-2 group/btn">
                                            <span>Ver Detalles</span>
                                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white/50 rounded-3xl border border-dashed border-[#161a1d]/10">
                        <div className="w-20 h-20 bg-[#f8f9fa] rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="w-10 h-10 text-[#98989A]" />
                        </div>
                        <h3 className="text-xl font-bold text-[#161a1d] mb-2">No se encontraron proyectos</h3>
                        <p className="text-[#161a1d]/60">Intenta ajustar tu búsqueda o sé el primero en crear una iniciativa.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
