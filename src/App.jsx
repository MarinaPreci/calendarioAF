import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import CalendarGrid from './components/CalendarGrid';
import AddRaceModal from './components/AddRaceModal';
import RaceDetailsModal from './components/RaceDetailsModal';

export default function App(){
  const [races, setRaces] = useState([]);
  const [selectedRace, setSelectedRace] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const YEAR = 2026;

  async function fetchRaces(){
    const { data, error } = await supabase
      .from('races')
      .select('*')
      .order('date', { ascending: true });
    if (error) console.error('fetchRaces', error);
    else setRaces(data || []);
  }

  useEffect(()=>{
    fetchRaces();

    const racesChannel = supabase.channel('public:races')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'races' }, payload => {
        fetchRaces();
      })
      .subscribe();

    const partsChannel = supabase.channel('public:participants')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'participants' }, payload => {
        fetchRaces();
      })
      .subscribe();

    return ()=>{
      supabase.removeChannel(racesChannel);
      supabase.removeChannel(partsChannel);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
     <header className="sticky top-0 z-10 bg-blue-200 border-b p-3 flex items-center justify-between shadow-md">
  <h1 className="text-lg font-semibold text-gray-900">Calendario de Carreras {YEAR}</h1>
  <div className="flex gap-2">
    <button
      className="px-3 py-1 rounded bg-blue-500 text-white text-sm hover:bg-blue-600"
      onClick={() => setShowAdd(true)}
    >
      + Añadir
    </button>
  </div>
</header>


      <main className="p-2">
        <CalendarGrid
          year={YEAR}
          races={races}
          onOpenRace={(race) => setSelectedRace(race)}
        />
      </main>

      {showAdd && (
        <AddRaceModal
          onClose={() => setShowAdd(false)}
          onSaved={() => {
            setShowAdd(false);
            fetchRaces();
          }}
        />
      )}

      {selectedRace && (
        <RaceDetailsModal
          race={selectedRace}
          onClose={() => setSelectedRace(null)}
          onChanged={() => {
            setSelectedRace(null);
            fetchRaces();
          }}
        />
      )}
    </div>
  );
}