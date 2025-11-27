'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Calendar, Users, Target, Clock, Shield, MessageSquare, ThumbsUp, Lightbulb, Send, MapPin, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

interface Project {
    id: string;
    title: string;
    description: string;
    status: string;
    start_date: string | null;
    location: string | null;
    created_at: string;
    owner_id: string;
}

interface Member {
    id: string;
    user_id: string;
    role: string;
    user?: {
        email: string;
    };
}

interface Comment {
    id: string;
    user_id: string;
    content: string;
    sentiment: 'support' | 'critique' | 'neutral';
    created_at: string;
    user?: {
        nombre: string;
        apellidos: string;
    };
}

export default function ProjectDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [project, setProject] = useState<Project | null>(null);
    const [members, setMembers] = useState<Member[]>([]);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    // Comment Form State
    const [newComment, setNewComment] = useState('');
    const [sentiment, setSentiment] = useState<'support' | 'critique'>('support');
    const [submittingComment, setSubmittingComment] = useState(false);

    useEffect(() => {
        if (params.id) {
            fetchProjectDetails(params.id as string);
            fetchComments(params.id as string);
        }
    }, [params.id]);

    useEffect(() => {
        const checkUserRole = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user && members.length > 0) {
                const member = members.find(m => m.user_id === user.id);
                setCurrentUserRole(member?.role || null);
            }
        };
        checkUserRole();
    }, [members]);

    const fetchProjectDetails = async (id: string) => {
        try {
            // 1. Fetch Project Info
            const { data: projectData, error: projectError } = await supabase
                .from('projects')
                .select('*')
                .eq('id', id)
                .single();

            if (projectError) throw projectError;
            setProject(projectData);

            // 2. Fetch Members
            const { data: membersData, error: membersError } = await supabase
                .from('project_members')
                .select('*')
                .eq('project_id', id);

            if (membersError) throw membersError;
            setMembers(membersData || []);

        } catch (error) {
            console.error('Error fetching project details:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async (id: string) => {
        try {
            const { data: commentsData, error } = await supabase
                .from('project_comments')
                .select('*')
                .eq('project_id', id)
                .order('created_at', { ascending: false });

            if (error) {
                console.warn('Could not fetch comments:', error);
                return;
            }

            if (commentsData && commentsData.length > 0) {
                // Fetch user profiles for these comments
                const userIds = [...new Set(commentsData.map(c => c.user_id))];
                const { data: usersData } = await supabase
                    .from('users')
                    .select('id, nombre, apellidos')
                    .in('id', userIds);

                const commentsWithUsers = commentsData.map(comment => ({
                    ...comment,
                    user: usersData?.find(u => u.id === comment.user_id)
                }));
                setComments(commentsWithUsers);
            } else {
                setComments([]);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const handleStatusChange = async (newStatus: string) => {
        if (!project) return;
        setUpdatingStatus(true);
        try {
            const { error } = await supabase
                .from('projects')
                .update({ status: newStatus })
                .eq('id', project.id);

            if (error) throw error;
            setProject(prev => prev ? { ...prev, status: newStatus } : null);
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Error al actualizar el estado');
        } finally {
            setUpdatingStatus(false);
        }
    };

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !project) return;

        setSubmittingComment(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                alert('Debes iniciar sesión para comentar.');
                return;
            }

            const { error } = await supabase
                .from('project_comments')
                .insert({
                    project_id: project.id,
                    user_id: user.id,
                    content: newComment,
                    sentiment: sentiment
                });

            if (error) throw error;

            setNewComment('');
            fetchComments(project.id);
        } catch (error) {
            console.error('Error submitting comment:', error);
            alert('Error al publicar el comentario. Asegúrate de haber creado la tabla en Supabase.');
        } finally {
            setSubmittingComment(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#1e5b4f] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center p-4 text-center">
                <div className="w-20 h-20 bg-[#f8f9fa] rounded-full flex items-center justify-center mb-6 border-2 border-[#161a1d]/10">
                    <Target className="w-10 h-10 text-[#98989A]" />
                </div>
                <h2 className="text-2xl font-bold text-[#161a1d] mb-2">Proyecto no encontrado</h2>
                <p className="text-[#161a1d]/60 mb-8 max-w-md">El proyecto que buscas no existe o no tienes permisos para verlo.</p>
                <Link href="/dashboard/projects/explore">
                    <button className="bg-[#161a1d] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#161a1d]/90 transition-all shadow-lg hover:-translate-y-0.5">
                        Volver a Explorar
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f9fa] relative">
            {/* Header Background */}
            <div className="h-80 bg-[#161a1d] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1e5b4f]/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#f8f9fa] to-transparent"></div>
            </div>

            <div className="max-w-6xl mx-auto px-6 -mt-64 relative z-10 pb-20">
                {/* Navigation */}
                <Link href="/dashboard/projects/explore" className="inline-flex items-center text-sm font-medium text-white/80 hover:text-white mb-8 transition-colors group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Volver a Explorar
                </Link>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Project Header Card */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-[#161a1d]/5 border border-[#161a1d]/5">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-3">
                                    {currentUserRole === 'admin' ? (
                                        <div className="relative group/status">
                                            <button className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase flex items-center space-x-2 transition-all ${project.status === 'active' ? 'bg-[#1e5b4f]/10 text-[#1e5b4f] hover:bg-[#1e5b4f]/20' :
                                                project.status === 'planning' ? 'bg-[#a57f2c]/10 text-[#a57f2c] hover:bg-[#a57f2c]/20' :
                                                    'bg-[#161a1d]/5 text-[#161a1d]/60 hover:bg-[#161a1d]/10'
                                                }`}>
                                                <span>
                                                    {project.status === 'active' && 'Activo'}
                                                    {project.status === 'planning' && 'Planeación'}
                                                    {project.status === 'completed' && 'Completado'}
                                                </span>
                                                {updatingStatus ? <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <MoreHorizontal className="w-3 h-3" />}
                                            </button>

                                            {/* Status Dropdown */}
                                            <div className="absolute top-full left-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-[#161a1d]/5 overflow-hidden hidden group-hover/status:block z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                                {['planning', 'active', 'completed'].map((s) => (
                                                    <button
                                                        key={s}
                                                        onClick={() => handleStatusChange(s)}
                                                        className={`w-full text-left px-4 py-2 text-xs font-bold uppercase hover:bg-[#f8f9fa] transition-colors ${project.status === s ? 'text-[#1e5b4f] bg-[#1e5b4f]/5' : 'text-[#98989A]'
                                                            }`}
                                                    >
                                                        {s === 'active' && 'Activo'}
                                                        {s === 'planning' && 'Planeación'}
                                                        {s === 'completed' && 'Completado'}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase ${project.status === 'active' ? 'bg-[#1e5b4f]/10 text-[#1e5b4f]' :
                                            project.status === 'planning' ? 'bg-[#a57f2c]/10 text-[#a57f2c]' :
                                                'bg-[#161a1d]/5 text-[#161a1d]/60'
                                            }`}>
                                            {project.status === 'active' && 'Activo'}
                                            {project.status === 'planning' && 'Planeación'}
                                            {project.status === 'completed' && 'Completado'}
                                        </span>
                                    )}

                                    <span className="text-[#98989A] text-sm flex items-center font-medium">
                                        <Clock className="w-4 h-4 mr-1.5" />
                                        {new Date(project.created_at).toLocaleDateString()}
                                    </span>
                                </div>

                            </div>

                            <h1 className="text-4xl font-bold text-[#161a1d] mb-6 leading-tight">{project.title}</h1>
                            <p className="text-[#161a1d]/70 text-lg leading-relaxed">{project.description}</p>
                        </div>

                        {/* Goals Section */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#161a1d]/5">
                            <h3 className="text-xl font-bold text-[#161a1d] mb-6 flex items-center">
                                <div className="w-10 h-10 rounded-xl bg-[#a57f2c]/10 flex items-center justify-center mr-4">
                                    <Target className="w-5 h-5 text-[#a57f2c]" />
                                </div>
                                Objetivos del Proyecto
                            </h3>
                            <div className="prose prose-slate max-w-none text-[#161a1d]/70">
                                <p className="leading-relaxed">
                                    Este proyecto tiene como finalidad restaurar y preservar el ecosistema local mediante acciones comunitarias y científicas.
                                    Los objetivos específicos incluyen:
                                </p>
                                <ul className="mt-4 space-y-2 list-disc pl-5 marker:text-[#a57f2c]">
                                    <li>Monitoreo continuo de la calidad del agua.</li>
                                    <li>Reforestación de zonas ribereñas con especies nativas.</li>
                                    <li>Educación ambiental para las comunidades locales.</li>
                                </ul>
                            </div>
                        </div>

                        {/* Comments Section */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#161a1d]/5">
                            <h3 className="text-xl font-bold text-[#161a1d] mb-8 flex items-center">
                                <div className="w-10 h-10 rounded-xl bg-[#1e5b4f]/10 flex items-center justify-center mr-4">
                                    <MessageSquare className="w-5 h-5 text-[#1e5b4f]" />
                                </div>
                                Comentarios de la Comunidad
                            </h3>

                            {/* Comment Form */}
                            <form onSubmit={handleSubmitComment} className="mb-10 bg-[#f8f9fa] p-6 rounded-2xl border border-[#161a1d]/5">
                                <div className="mb-4">
                                    <label className="text-xs font-bold text-[#98989A] uppercase tracking-wider mb-2 block">Tu opinión</label>
                                    <div className="flex space-x-4 mb-4">
                                        <button
                                            type="button"
                                            onClick={() => setSentiment('support')}
                                            className={`flex-1 py-3 rounded-xl flex items-center justify-center space-x-2 transition-all border-2 ${sentiment === 'support'
                                                ? 'bg-[#1e5b4f]/10 border-[#1e5b4f] text-[#1e5b4f]'
                                                : 'bg-white border-transparent text-[#98989A] hover:bg-white/50'
                                                }`}
                                        >
                                            <ThumbsUp className="w-4 h-4" />
                                            <span className="font-bold text-sm">Apoyo el proyecto</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setSentiment('critique')}
                                            className={`flex-1 py-3 rounded-xl flex items-center justify-center space-x-2 transition-all border-2 ${sentiment === 'critique'
                                                ? 'bg-[#a57f2c]/10 border-[#a57f2c] text-[#a57f2c]'
                                                : 'bg-white border-transparent text-[#98989A] hover:bg-white/50'
                                                }`}
                                        >
                                            <Lightbulb className="w-4 h-4" />
                                            <span className="font-bold text-sm">Crítica Constructiva</span>
                                        </button>
                                    </div>
                                    <textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Comparte tus ideas, sugerencias o mensajes de apoyo..."
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-xl bg-white border-none focus:ring-2 focus:ring-[#1e5b4f]/20 text-[#161a1d] placeholder-[#98989A] resize-none"
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={submittingComment || !newComment.trim()}
                                        className="bg-[#161a1d] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#161a1d]/90 transition-all disabled:opacity-50 flex items-center space-x-2"
                                    >
                                        {submittingComment ? (
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <span>Publicar</span>
                                                <Send className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>

                            {/* Comments List */}
                            <div className="space-y-6">
                                {comments.length > 0 ? (
                                    comments.map((comment) => (
                                        <div key={comment.id} className="flex space-x-4">
                                            <div className="flex-shrink-0">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f8f9fa] to-[#e2e8f0] flex items-center justify-center text-[#161a1d] font-bold text-xs border border-white shadow-sm">
                                                    {comment.user?.nombre ? comment.user.nombre.substring(0, 2).toUpperCase() : comment.user_id.substring(0, 2).toUpperCase()}
                                                </div>
                                            </div>
                                            <div className="flex-1 bg-[#f8f9fa] rounded-2xl p-4 rounded-tl-none">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-xs font-bold text-[#161a1d]">
                                                        {comment.user ? `${comment.user.nombre} ${comment.user.apellidos}` : 'Miembro de la Comunidad'}
                                                    </span>
                                                    <span className="text-xs text-[#98989A]">{new Date(comment.created_at).toLocaleDateString()}</span>
                                                </div>
                                                <div className="mb-2">
                                                    {comment.sentiment === 'support' && (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-[#1e5b4f]/10 text-[#1e5b4f] text-[10px] font-bold uppercase tracking-wide mb-2">
                                                            <ThumbsUp className="w-3 h-3 mr-1" /> Apoyo
                                                        </span>
                                                    )}
                                                    {comment.sentiment === 'critique' && (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-[#a57f2c]/10 text-[#a57f2c] text-[10px] font-bold uppercase tracking-wide mb-2">
                                                            <Lightbulb className="w-3 h-3 mr-1" /> Crítica Constructiva
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-[#161a1d]/80 text-sm leading-relaxed">{comment.content}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-[#98989A] text-sm">Aún no hay comentarios. ¡Sé el primero en participar!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">


                        {/* Info Card */}
                        {(project.start_date || project.location) && (
                            <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#161a1d]/5">
                                <h3 className="text-sm font-bold text-[#98989A] uppercase tracking-wider mb-4">Detalles</h3>
                                <div className="space-y-3">
                                    {project.location && (
                                        <div className="flex items-center p-4 bg-[#f8f9fa] rounded-2xl">
                                            <MapPin className="w-5 h-5 text-[#1e5b4f] mr-3" />
                                            <div>
                                                <p className="text-xs font-bold text-[#98989A] uppercase">Ubicación</p>
                                                <p className="text-[#161a1d] font-bold">{project.location}</p>
                                            </div>
                                        </div>
                                    )}
                                    {project.start_date && (
                                        <div className="flex items-center p-4 bg-[#f8f9fa] rounded-2xl">
                                            <Calendar className="w-5 h-5 text-[#1e5b4f] mr-3" />
                                            <div>
                                                <p className="text-xs font-bold text-[#98989A] uppercase">Fecha de Inicio</p>
                                                <p className="text-[#161a1d] font-bold">{new Date(project.start_date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Team Card */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#161a1d]/5">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-sm font-bold text-[#98989A] uppercase tracking-wider">Equipo</h3>
                                <span className="bg-[#161a1d]/5 text-[#161a1d] text-xs font-bold px-2 py-1 rounded-lg">{members.length}</span>
                            </div>

                            <div className="space-y-4">
                                {members.map((member) => (
                                    <div key={member.id} className="flex items-center justify-between group">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-[#f8f9fa] to-[#e2e8f0] rounded-full flex items-center justify-center text-[#161a1d] font-bold text-xs border border-white shadow-sm">
                                                {member.role.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-[#161a1d]">
                                                    {member.role === 'admin' ? 'Administrador' : 'Colaborador'}
                                                </p>
                                                <p className="text-xs text-[#98989A]">Miembro del equipo</p>
                                            </div>
                                        </div>
                                        {member.role === 'admin' && (
                                            <Shield className="w-4 h-4 text-[#a57f2c]" />
                                        )}
                                    </div>
                                ))}

                                {members.length === 0 && (
                                    <p className="text-sm text-[#98989A] italic text-center py-4">No hay miembros visibles.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
