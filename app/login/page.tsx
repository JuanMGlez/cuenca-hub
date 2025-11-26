'use client';

import { useState } from 'react';
import { ArrowLeft, Mail, Lock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (error: any) {
      setError(error.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white shadow-sm border-b border-primary">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 text-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Volver a Cuenca Hub</span>
          </Link>
          <div className="text-sm text-neutral">Iniciar Sesión</div>
        </div>
      </header>

      <div className="py-12 px-6">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">Iniciar Sesión</h1>
            <p className="text-lg text-foreground">Accede a la plataforma científica</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg animate-pulse">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                  ¡Inicio de sesión exitoso! Redirigiendo...
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Correo Electrónico</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-neutral" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-neutral border-opacity-20 rounded-lg focus:border-primary focus:outline-none transition-colors"
                    placeholder="correo@institucion.edu.mx"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-neutral" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-neutral border-opacity-20 rounded-lg focus:border-primary focus:outline-none transition-colors"
                    placeholder="Tu contraseña"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || success}
                className={`w-full py-4 rounded-xl font-semibold shadow-lg transition-all duration-300 ${
                  success 
                    ? 'bg-green-600 text-white' 
                    : 'btn-primary hover:shadow-xl hover:-translate-y-0.5'
                } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
              >
                {success ? '✓ ¡Exitoso!' : loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Iniciando sesión...</span>
                  </div>
                ) : 'Iniciar Sesión'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-neutral">
                ¿No tienes cuenta? 
                <Link href="/registro" className="text-primary hover:underline ml-1 font-semibold">
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}