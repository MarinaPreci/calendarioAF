import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { RACE_TYPES } from '../utils/raceTypes';

function getTypeLabel(t){
  const it = RACE_TYPES.find(r=>r.id===t);
  return it ? it.label : t;
}

export default function RaceDetailsModal({ race, onClose, onChanged }){
  const [participants, setParticipants] = useState([]);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(race);

  useEffect(()=>{
    fetchParticipants();
    setForm(race);
  }, [race]);

  async function fetchParticipants(){
    const { data, error } = await supabase
      .from('participants')
      .select('*')
      .eq('race_id', race.id)
      .order('joined_at', { ascending: true });
    if (error) console.error(error);
    else setParticipants(data || []);
  }

  async function handleSaveChanges(){
    setSaving(true);
    const { error } = await supabase
      .from('races')
      .update({
        name: form.name,
        date: form.date,
        type: form.type,
        location: form.location,
        description: form.description
      })
      .eq('id', race.id);
    setSaving(false);
    if (error) {
      alert('Error actualizando: ' + error.message);
    } else {
      setEditing(false);
      onChanged && onChanged();
    }
  }

  async function handleDelete(){
    if (!confirm('¿Eliminar esta carrera?')) return;
    const { error } = await supabase.from('races').delete().eq('id', race.id);
    if (error) {
      alert('Error eliminando: ' + error.message);
    } else {
      onClose();
      onChanged && onChanged();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 z-40 pointer-events-auto"></div>

      <div className="w-full max-w-md bg-green-50 rounded-xl p-6 shadow-lg z-50">
        <div className="flex justify-between items-start">
          <h2 className="text-lg font-semibold text-green-900">
            {editing ? 'Editar carrera' : form.name}
          </h2>
          <button onClick={onClose} className="text-green-700">✕</button>
        </div>

        {editing ? (
          <>
            <label className="block text-sm text-green-800 mt-3">Nombre</label>
            <input
              className="w-full border border-green-200 p-2 rounded"
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
            />

            <label className="block text-sm text-green-800 mt-3">Fecha</label>
            <input
              type="date"
              className="w-full border border-green-200 p-2 rounded"
              value={form.date}
              onChange={e => setForm({...form, date: e.target.value})}
            />

            <label className="block text-sm text-green-800 mt-3">Tipo</label>
            <select
              className="w-full border border-green-200 p-2 rounded"
              value={form.type}
              onChange={e => setForm({...form, type: e.target.value})}
            >
              {RACE_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>

            <label className="block text-sm text-green-800 mt-3">Ubicación</label>
            <input
              className="w-full border border-green-200 p-2 rounded"
              value={form.location || ''}
              onChange={e => setForm({...form, location: e.target.value})}
            />

            <label className="block text-sm text-green-800 mt-3">URL de la prueba</label>
            <textarea
              className="w-full border border-green-200 p-2 rounded"
              value={form.description || ''}
              onChange={e => setForm({...form, description: e.target.value})}
            />
          </>
        ) : (
          <>
            <p className="mt-2 text-sm text-green-700">
              {getTypeLabel(form.type)} • {form.date}
            </p>
            {form.location && <p className="text-sm text-green-600">{form.location}</p>}

            {form.description && (
              form.description.startsWith('http') ? (
                <a
                  href={form.description}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 block text-sm text-blue-600 underline break-words hover:text-blue-800"
                >
                  {form.description}
                </a>
              ) : (
                <p className="mt-2 text-sm text-green-800">{form.description}</p>
              )
            )}
          </>
        )}

        <div className="flex justify-end gap-2 mt-4">
          {!editing ? (
            <>
              <button className="px-3 py-1 rounded bg-red-200 hover:bg-red-300 text-red-800" onClick={handleDelete}>Eliminar</button>
              <button className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700" onClick={() => setEditing(true)}>Editar</button>
            </>
          ) : (
            <>
              <button className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400" onClick={() => setEditing(false)}>Cancelar</button>
              <button className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700" onClick={handleSaveChanges} disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
