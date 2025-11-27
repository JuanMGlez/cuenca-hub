'use client';

import { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface RegisterDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RegisterDeviceModal({ isOpen, onClose }: RegisterDeviceModalProps) {
  const [formData, setFormData] = useState({
    device_id: '',
    name: '',
    type: 'water_quality',
    location_lat: '',
    location_lng: '',
    municipality: ''
  });
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const generatedApiKey = `key_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      
      const { error } = await supabase.from('devices').insert({
        device_id: formData.device_id,
        name: formData.name,
        type: formData.type,
        location_lat: parseFloat(formData.location_lat),
        location_lng: parseFloat(formData.location_lng),
        municipality: formData.municipality,
        status: 'active',
        api_key: generatedApiKey
      });

      if (error) throw error;

      setApiKey(generatedApiKey);
    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setFormData({ device_id: '', name: '', type: 'water_quality', location_lat: '', location_lng: '', municipality: '' });
    setApiKey('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[2000] p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-[#161a1d]">Registrar Dispositivo IoT</h2>
          <button onClick={handleClose} className="p-2 hover:bg-slate-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {apiKey ? (
          <div className="p-6 space-y-4">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-[#1e5b4f]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Check className="w-8 h-8 text-[#1e5b4f]" />
              </div>
              <h3 className="text-lg font-bold text-[#161a1d] mb-2">¡Dispositivo Registrado!</h3>
              <p className="text-sm text-[#161a1d]/60">Guarda tu API Key, no podrás verla de nuevo</p>
            </div>

            <div className="bg-[#161a1d] p-4 rounded-xl">
              <p className="text-xs text-[#e6d194] mb-2">API Key</p>
              <div className="flex items-center justify-between">
                <code className="text-sm text-white font-mono">{apiKey}</code>
                <button onClick={copyApiKey} className="ml-2 p-2 hover:bg-white/10 rounded">
                  {copied ? <Check className="w-4 h-4 text-[#1e5b4f]" /> : <Copy className="w-4 h-4 text-white" />}
                </button>
              </div>
            </div>

            <button onClick={handleClose} className="w-full py-3 bg-[#1e5b4f] text-white rounded-xl font-medium hover:bg-[#002f2a]">
              Cerrar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#161a1d] mb-2">ID del Dispositivo</label>
              <input
                type="text"
                value={formData.device_id}
                onChange={(e) => setFormData({ ...formData, device_id: e.target.value })}
                className="w-full p-3 border border-slate-300 rounded-xl focus:border-[#1e5b4f] focus:outline-none"
                placeholder="SENSOR-004"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#161a1d] mb-2">Nombre</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 border border-slate-300 rounded-xl focus:border-[#1e5b4f] focus:outline-none"
                placeholder="Estación Guadalajara"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#161a1d] mb-2">Tipo</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full p-3 border border-slate-300 rounded-xl focus:border-[#1e5b4f] focus:outline-none"
              >
                <option value="water_quality">Calidad de Agua</option>
                <option value="hydrology">Hidrología</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#161a1d] mb-2">Latitud</label>
                <input
                  type="number"
                  step="any"
                  value={formData.location_lat}
                  onChange={(e) => setFormData({ ...formData, location_lat: e.target.value })}
                  className="w-full p-3 border border-slate-300 rounded-xl focus:border-[#1e5b4f] focus:outline-none"
                  placeholder="20.67"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#161a1d] mb-2">Longitud</label>
                <input
                  type="number"
                  step="any"
                  value={formData.location_lng}
                  onChange={(e) => setFormData({ ...formData, location_lng: e.target.value })}
                  className="w-full p-3 border border-slate-300 rounded-xl focus:border-[#1e5b4f] focus:outline-none"
                  placeholder="-103.34"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#161a1d] mb-2">Municipio</label>
              <input
                type="text"
                value={formData.municipality}
                onChange={(e) => setFormData({ ...formData, municipality: e.target.value })}
                className="w-full p-3 border border-slate-300 rounded-xl focus:border-[#1e5b4f] focus:outline-none"
                placeholder="Guadalajara"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#1e5b4f] to-[#002f2a] text-white rounded-xl font-medium hover:shadow-lg disabled:opacity-50"
            >
              {loading ? 'Registrando...' : 'Registrar Dispositivo'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
