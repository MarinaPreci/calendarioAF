import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { RACE_TYPES } from '../utils/raceTypes';

function getTypeLabel(t){
  const it = RACE_TYPES.find(r=>r.id===t);
  return it ? it.label : t;
}

export default function RaceDetailsModal({ race, onClose, onChanged }){
  const [participants, setParticipants] = useState([]);
  const [name, setName] = useState('');
  const [joining, setJoining] = useState(false);

  useEffect(()=>{
    fetchParticipants();
    const existing = localStorage.getItem('participantName') || '';
    setName(existing);
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

  async function handleJoin(){
    if (!name || name.trim().length < 1) {
      alert('Introduce un nombre para apuntarte (se guardará localmente).');
      return;
    }
    setJoining(true);
    localStorage.setItem('participantName', name.trim());

    const { error } = await supabase.from('participants').insert([{
      race_id: race.id,
      display_name: name.trim()
    }]);

    setJoining(false);
    if (error) {
      alert('Error al apuntarse: ' + error.message);
      console.error(error);
    } else {
      fetchParticipants();
      onChanged && onChanged();
    }
  }

  async function handleLeave(participantId){
    if (!confirm('¿Eliminar tu inscripción?')) return;
    const { error } = await supabase.from('participants').delete().eq('id', participantId);
    if (error) {
      alert('Error al eliminar: ' + error.message);
    } else {
      fetchParticipants();
      onChanged && onChanged();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

  {/* Overlay: cubre todo el fondo y bloquea clics */}
  <div className="fixed inset-0 bg-black/60 z-40 pointer-events-auto"></div>

  {/* Modal / contenido */}
  <div className="w-full max-w-md bg-green-50 rounded-xl p-6 shadow-lg z-50">
    
    <div className="flex justify-between items-start">
      <div>
        <h2 className="text-lg font-semibold text-green-900">{race.name}</h2>
        <div className="text-sm text-green-700">{getTypeLabel(race.type)} • {race.date}</div>
        {race.location && <div className="text-sm text-green-600">{race.location}</div>}
      </div>
      <button onClick={onClose} className="text-green-700">✕</button>
    </div>

    {race.description && <p className="mt-2 text-sm text-green-800">{race.description}</p>}

    <div className="mt-3">
      <h3 className="font-medium text-green-900">Participantes ({participants.length})</h3>
      <ul className="mt-2 max-h-40 overflow-auto">
        {participants.map(p => (
          <li key={p.id} className="flex justify-between items-center py-1 border-b border-green-200">
            <span className="text-sm">{p.display_name}</span>
            <button className="text-xs text-red-600" onClick={() => handleLeave(p.id)}>Eliminar</button>
          </li>
        ))}
        {participants.length === 0 && <li className="text-sm text-green-600">Nadie aún</li>}
      </ul>
    </div>

    <div className="mt-3">
      <label className="block text-sm text-green-800">Tu nombre</label>
      <input
        className="w-full border border-green-200 p-2 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-green-300 bg-white"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <div className="flex gap-2 justify-end mt-3">
        <button className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300" onClick={onClose}>Cerrar</button>
        <button className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700" onClick={handleJoin} disabled={joining}>
          {joining ? 'Apuntando...' : 'Apuntarme'}
        </button>
      </div>
    </div>

  </div>
</div>

  );
}