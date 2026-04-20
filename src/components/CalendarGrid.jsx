import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { RACE_TYPES } from '../utils/raceTypes';
import dayjs from 'dayjs';

function getColorForType(type) {
  const t = RACE_TYPES.find(r => r.id === type);
  return t ? t.color : '#555';
}

const MONTH_COLORS = [
  'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-400',
  'bg-teal-400', 'bg-blue-400', 'bg-indigo-400', 'bg-purple-400',
  'bg-pink-400', 'bg-slate-400', 'bg-lime-400', 'bg-rose-400'
];

export default function CalendarGrid({ races = [], onOpenRace = () => {}, onAddRace = () => {} }) {
  const [selectedType, setSelectedType] = useState('');

  // 1. Calculamos el mes y año actual
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // 2. Generamos 12 meses empezando desde el actual
  const months = Array.from({ length: 12 }, (_, i) => {
    return new Date(currentYear, currentMonth + i, 1);
  });

  const filteredRaces = selectedType
    ? races.filter(r => r.type === selectedType)
    : races;

  const eventsByMonth = Array.from({ length: months.length }, () => []);

  filteredRaces.forEach(r => {
    const d = new Date(r.date);
    const monthIndex = months.findIndex(
      m => m.getFullYear() === d.getFullYear() && m.getMonth() === d.getMonth()
    );
    if (monthIndex !== -1) {
      eventsByMonth[monthIndex].push({
        id: r.id,
        title: r.name,
        start: r.date,
        extendedProps: r,
        backgroundColor: getColorForType(r.type) + '44',
        borderColor: getColorForType(r.type),
        textColor: '#111827',
      });
    }
  });

  return (
    // Fondo gris oscuro aplicado aquí 🔽
    <div className="bg-gray-900 min-h-screen p-4">
      
      <div className="mb-4 flex items-center gap-2">
        <label className="text-sm font-semibold text-gray-200">
          Filtrar por tipo:
        </label>
        <select
          className="border border-gray-600 bg-gray-800 text-white rounded p-1 text-sm outline-none"
          value={selectedType}
          onChange={e => setSelectedType(e.target.value)}
        >
          <option value="">Todas</option>
          {RACE_TYPES.map(t => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {months.map((monthStart, idx) => (
          <div
            key={idx}
            className="bg-gray-800 rounded-2xl shadow-xl p-2 border border-gray-700 hover:border-blue-500 transition-all duration-300 w-full"
          >
            <div
              className={`text-center text-sm font-bold mb-2 p-2 rounded-xl ${MONTH_COLORS[idx % MONTH_COLORS.length]} text-gray-900 uppercase tracking-wider`}
            >
              {dayjs(monthStart).locale('es').format('MMMM YYYY')}
            </div>

            <div className="calendar-dark-theme">
                <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                locale={esLocale}
                firstDay={1}
                headerToolbar={false}
                height="auto"
                dayMaxEvents={2}
                fixedWeekCount={false}
                initialDate={monthStart}
                events={eventsByMonth[idx]}
                selectable={true}
                dateClick={(info) => onAddRace(info.dateStr || info.date)}
                eventClick={(info) => {
                    info.jsEvent.preventDefault();
                    onOpenRace(info.event.extendedProps);
                }}
                // Ajuste de colores internos del calendario
                eventClassNames={() => 'rounded-md cursor-pointer text-xs font-medium'}
                dayCellClassNames={() => 'text-gray-300 border-gray-700'}
                />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}