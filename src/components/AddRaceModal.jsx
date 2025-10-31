import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { RACE_TYPES } from '../utils/raceTypes';

export default function AddRaceModal({ onClose, onSaved }){
  const [name, setName] = useState('');
  const [date, setDate] = useState('2026-01-01');
  const [type, setType] = useState(RACE_TYPES[0].id);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSave(e){
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from('races').insert([{
      name, date, type, location, description
    }]);
    setSaving(false);
    if (error) {
      alert('Error guardando: ' + error.message);
      console.error(error);
    } else {
      onSaved && onSaved();
    }
  }

  return (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    
    {/* Overlay: cubre toda la pantalla y bloquea clics del calendario */}
    <div className="fixed inset-0 bg-black/60 z-40 pointer-events-auto"></div>

  <form className="w-full max-w-md bg-white rounded-xl p-6 shadow-lg z-50" onSubmit={handleSave}>
    <h2 className="text-lg font-semibold mb-4 text-pink-900">Nueva carrera</h2>

    <label className="block text-sm text-pink-800">Nombre</label>
    <input
      className="w-full border border-pink-200 p-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-pink-300"
      value={name}
      onChange={e => setName(e.target.value)}
      required
    />

    <label className="block text-sm text-pink-800">Fecha</label>
    <input
      type="date"
      className="w-full border border-pink-200 p-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-pink-300"
      value={date}
      onChange={e => setDate(e.target.value)}
      required
    />

    <label className="block text-sm text-pink-800">Tipo</label>
    <select
      className="w-full border border-pink-200 p-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-pink-300"
      value={type}
      onChange={e => setType(e.target.value)}
    >
      {RACE_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
    </select>

    <label className="block text-sm text-pink-800">Ubicación (opcional)</label>
    <input
      className="w-full border border-pink-200 p-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-pink-300"
      value={location}
      onChange={e => setLocation(e.target.value)}
    />

    <label className="block text-sm text-pink-800">Descripción (opcional)</label>
    <textarea
      className="w-full border border-pink-200 p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-pink-300"
      value={description}
      onChange={e => setDescription(e.target.value)}
    />

    <div className="flex gap-2 justify-end">
      <button
        type="button"
        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
        onClick={onClose}
      >
        Cancelar
      </button>
      <button
        type="submit"
        className="px-4 py-2 rounded bg-pink-600 text-white hover:bg-pink-700"
        disabled={saving}
      >
        {saving ? 'Guardando...' : 'Guardar'}
      </button>
    </div>
  </form>
</div>

  )
}