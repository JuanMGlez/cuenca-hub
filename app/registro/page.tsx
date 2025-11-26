'use client';

import { useState } from 'react';
import { ArrowLeft, User, Mail, Lock, Building, MapPin } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Logo from '@/components/Logo';

export default function Registro() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    password: '',
    confirmPassword: '',
    institucion: '',
    estado: '',
    tipoUsuario: 'comunitario',
    // Campos dinámicos
    ocupacion: '',
    comunidad: '',
    grado: '',
    especialidad: '',
    cargo: '',
    dependencia: '',
    organizacion: '',
    areaInteres: '',
    sector: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      setLoading(false);
      return;
    }

    try {
      console.log('=== REGISTRO DEFINITIVO ===');
      console.log('FormData:', JSON.stringify(formData, null, 2));

      // PASO 1: Crear usuario en auth (sin metadata para evitar triggers)
      console.log('Paso 1: Creando usuario auth...');

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password
      });

      console.log('Auth response:', { data: authData, error: authError });

      if (authError) {
        console.error('❌ Error en auth:', authError);
        setError(`Error de autenticación: ${authError.message}`);
        return;
      }

      if (!authData.user) {
        console.error('❌ No se creó el usuario');
        setError('No se pudo crear el usuario');
        return;
      }

      console.log('✅ Usuario auth creado:', authData.user.id);

      // PASO 2: Crear perfil en tabla users
      console.log('Paso 2: Creando perfil de usuario...');

      const { data: profileData, error: insertError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          nombre: formData.nombre,
          apellidos: formData.apellidos,
          email: formData.email,
          institucion: formData.tipoUsuario !== 'comunitario' ? formData.institucion : null,
          estado: formData.estado,
          tipo_usuario: formData.tipoUsuario,
          ocupacion: formData.ocupacion || null,
          comunidad: formData.comunidad || null,
          grado: formData.grado || null,
          especialidad: formData.especialidad || null,
          cargo: formData.cargo || null,
          dependencia: formData.dependencia || null,
          organizacion: formData.organizacion || null,
          sector: formData.sector || null,
          area_interes: formData.areaInteres || null
        })
        .select()
        .single();

      if (insertError) {
        console.error('❌ Error creando perfil:', insertError);
        setError(`Error guardando datos: ${insertError.message}`);
        return;
      }

      console.log('✅ Perfil creado exitosamente:', profileData);

      setSuccess(true);
      setError('');
      console.log('=== REGISTRO COMPLETADO ===');

    } catch (error: unknown) {
      console.error('❌ Error no controlado:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error en el registro';
      setError(errorMessage);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData(prev => {
      const newData = { ...prev, [name]: value };

      // Limpiar campos específicos al cambiar tipo de usuario
      if (name === 'tipoUsuario') {
        return {
          ...newData,
          ocupacion: '',
          comunidad: '',
          grado: '',
          especialidad: '',
          cargo: '',
          dependencia: '',
          organizacion: '',
          areaInteres: '',
          sector: ''
        };
      }

      return newData;
    });

    // Limpiar errores al escribir
    if (error) setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header simplificado */}
      <header className="bg-white shadow-sm border-b border-primary">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 text-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Regresar al Inicio</span>
          </Link>
          <div className="text-sm text-neutral">Registro a la Plataforma</div>
        </div>
      </header>

      <div className="py-12 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Header del formulario */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <Logo variant="auth" showText={false} />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">Crear Nueva Cuenta</h1>
            <p className="text-lg text-foreground">Únete a la red de colaboración para la restauración de la cuenca.</p>
          </div>

          {/* Formulario */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg animate-pulse">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                  ¡Registro exitoso! Revisa tu email para confirmar tu cuenta.
                </div>
              )}

              {/* Tipo de usuario */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">Perfil de Colaboración <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'comunitario', label: 'Ciudadanía / Comunidad' },
                    { value: 'academico', label: 'Academia / Investigación' },
                    { value: 'institucional', label: 'Gobierno / Institución' },
                    { value: 'organizacional', label: 'Organización / Sector Privado' }
                  ].map((tipo) => (
                    <label key={tipo.value} className="relative">
                      <input
                        type="radio"
                        name="tipoUsuario"
                        value={tipo.value}
                        checked={formData.tipoUsuario === tipo.value}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className={`p-3 text-center rounded-lg border-2 cursor-pointer transition-all ${formData.tipoUsuario === tipo.value
                          ? 'border-primary bg-primary text-white'
                          : 'border-neutral border-opacity-20 hover:border-primary'
                        }`}>
                        <span className="text-sm font-medium">{tipo.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Información personal */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Nombre(s) <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-neutral" />
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-neutral border-opacity-20 rounded-lg focus:border-primary focus:outline-none transition-colors"
                      placeholder="Ingresa tu nombre"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Apellidos <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-neutral border-opacity-20 rounded-lg focus:border-primary focus:outline-none transition-colors"
                    placeholder="Ingresa tus apellidos"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Correo Electrónico <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-neutral" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-neutral border-opacity-20 rounded-lg focus:border-primary focus:outline-none transition-colors"
                    placeholder="investigador@comecyt.mx"
                    required
                  />
                </div>
              </div>

              {/* Contraseñas */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Contraseña <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-neutral" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none transition-colors ${formData.password && formData.password.length < 8
                          ? 'border-red-300 focus:border-red-500'
                          : formData.password && formData.password.length >= 8
                            ? 'border-green-300 focus:border-green-500'
                            : 'border-neutral border-opacity-20 focus:border-primary'
                        }`}
                      placeholder="Mínimo 8 caracteres"
                      required
                    />
                  </div>
                  {formData.password && formData.password.length < 8 && (
                    <p className="text-red-500 text-xs mt-1">Mínimo 8 caracteres</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Confirmar Contraseña <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-neutral" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none transition-colors ${formData.confirmPassword && formData.password !== formData.confirmPassword
                          ? 'border-red-300 focus:border-red-500'
                          : formData.confirmPassword && formData.password === formData.confirmPassword && formData.password
                            ? 'border-green-300 focus:border-green-500'
                            : 'border-neutral border-opacity-20 focus:border-primary'
                        }`}
                      placeholder="Confirma tu contraseña"
                      required
                    />
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">Las contraseñas no coinciden</p>
                  )}
                </div>
              </div>

              {/* Información institucional */}
              <div className="grid md:grid-cols-2 gap-4">
                {formData.tipoUsuario !== 'comunitario' && (
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Institución/Organización <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 w-5 h-5 text-neutral" />
                      <input
                        type="text"
                        name="institucion"
                        value={formData.institucion}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-neutral border-opacity-20 rounded-lg focus:border-primary focus:outline-none transition-colors"
                        placeholder="Nombre de tu institución"
                        required
                      />
                    </div>
                  </div>
                )}
                <div className={formData.tipoUsuario === 'comunitario' ? 'md:col-span-2' : ''}>
                  <label className="block text-sm font-semibold text-foreground mb-2">Estado <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-neutral" />
                    <select
                      name="estado"
                      value={formData.estado}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-neutral border-opacity-20 rounded-lg focus:border-primary focus:outline-none transition-colors appearance-none bg-white"
                      required
                    >
                      <option value="">Selecciona tu estado</option>
                      <option value="mexico">Estado de México</option>
                      <option value="cdmx">Ciudad de México</option>
                      <option value="jalisco">Jalisco</option>
                      <option value="michoacan">Michoacán</option>
                      <option value="guanajuato">Guanajuato</option>
                      <option value="queretaro">Querétaro</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Campos dinámicos según tipo de usuario */}
              {formData.tipoUsuario === 'comunitario' && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Ocupación/Actividad</label>
                    <input
                      type="text"
                      name="ocupacion"
                      value={formData.ocupacion}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-neutral border-opacity-20 rounded-lg focus:border-primary focus:outline-none transition-colors"
                      placeholder="Ej: Agricultor, Estudiante, Líder comunitario"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Comunidad/Localidad</label>
                    <input
                      type="text"
                      name="comunidad"
                      value={formData.comunidad}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-neutral border-opacity-20 rounded-lg focus:border-primary focus:outline-none transition-colors"
                      placeholder="Nombre de tu comunidad o localidad"
                    />
                  </div>
                </div>
              )}

              {formData.tipoUsuario === 'academico' && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Grado Académico <span className="text-red-500">*</span></label>
                    <select
                      name="grado"
                      value={formData.grado}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-neutral border-opacity-20 rounded-lg focus:border-primary focus:outline-none transition-colors appearance-none bg-white"
                      required
                    >
                      <option value="">Selecciona tu grado</option>
                      <option value="licenciatura">Licenciatura</option>
                      <option value="maestria">Maestría</option>
                      <option value="doctorado">Doctorado</option>
                      <option value="posdoctorado">Posdoctorado</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Especialidad <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="especialidad"
                      value={formData.especialidad}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-neutral border-opacity-20 rounded-lg focus:border-primary focus:outline-none transition-colors"
                      placeholder="Ej: Hidrología, Biología"
                      required
                    />
                  </div>
                </div>
              )}

              {formData.tipoUsuario === 'institucional' && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Cargo <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="cargo"
                      value={formData.cargo}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-neutral border-opacity-20 rounded-lg focus:border-primary focus:outline-none transition-colors"
                      placeholder="Ej: Director, Coordinador"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Dependencia <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="dependencia"
                      value={formData.dependencia}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-neutral border-opacity-20 rounded-lg focus:border-primary focus:outline-none transition-colors"
                      placeholder="Ej: CONAGUA, SEMARNAT"
                      required
                    />
                  </div>
                </div>
              )}

              {formData.tipoUsuario === 'organizacional' && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Sector <span className="text-red-500">*</span></label>
                    <select
                      name="sector"
                      value={formData.sector}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-neutral border-opacity-20 rounded-lg focus:border-primary focus:outline-none transition-colors appearance-none bg-white"
                      required
                    >
                      <option value="">Selecciona el sector</option>
                      <option value="privado">Privado</option>
                      <option value="social">Social/ONG</option>
                      <option value="cooperativo">Cooperativo</option>
                      <option value="mixto">Mixto</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Área de Actividad <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="areaInteres"
                      value={formData.areaInteres}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-neutral border-opacity-20 rounded-lg focus:border-primary focus:outline-none transition-colors"
                      placeholder="Ej: Tecnología, Consultoría"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Nota sobre campos obligatorios */}
              <div className="text-sm text-neutral bg-slate-50 p-3 rounded-lg">
                <span className="text-red-500">*</span> Campos obligatorios
              </div>

              {/* Botón de registro */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Registrando...' : 'Completar Registro'}
              </button>

              {/* Link a login */}
              <div className="text-center">
                <p className="text-neutral">
                  ¿Ya tienes cuenta?{' '}
                  <Link href="/login" className="text-primary hover:underline font-semibold">
                    Inicia sesión aquí
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}