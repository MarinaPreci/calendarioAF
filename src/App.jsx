import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import CalendarGrid from './components/CalendarGrid';
import AddRaceModal from './components/AddRaceModal';
import RaceDetailsModal from './components/RaceDetailsModal';

export default function App() {
  const [races, setRaces] = useState([]);
  const [selectedRace, setSelectedRace] = useState(null);
  const [addingDate, setAddingDate] = useState(null); // 👈 almacena la fecha donde se clicó
  const YEAR = 2026;

  async function fetchRaces() {
    const { data, error } = await supabase
      .from('races')
      .select('*')
      .order('date', { ascending: true });
    if (error) console.error('fetchRaces', error);
    else setRaces(data || []);
  }

  useEffect(() => {
    fetchRaces();

    const racesChannel = supabase
      .channel('public:races')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'races' }, () => {
        fetchRaces();
      })
      .subscribe();

    const partsChannel = supabase
      .channel('public:participants')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'participants' }, () => {
        fetchRaces();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(racesChannel);
      supabase.removeChannel(partsChannel);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-blue-200 border-b p-3 flex items-center justify-between shadow-md">
        <h1 className="text-lg font-semibold text-gray-900">
          Calendario de Carreras {YEAR}
        </h1>
      </header>

      <main className="p-2">
        <CalendarGrid
          races={races}
          onOpenRace={(race) => setSelectedRace(race)}
          onAddRace={(date) => setAddingDate(date)} // 👈 clic en día => abre modal con fecha
        />
      </main>

      {addingDate && (
        <AddRaceModal
          defaultDate={addingDate} // 👈 le pasamos la fecha clicada
          onClose={() => setAddingDate(null)}
          onSaved={() => {
            setAddingDate(null);
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
