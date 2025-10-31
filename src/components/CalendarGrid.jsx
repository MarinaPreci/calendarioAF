import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { RACE_TYPES } from '../utils/raceTypes';
import dayjs from 'dayjs';

function getColorForType(type){
  const t = RACE_TYPES.find(r => r.id === type);
  return t ? t.color : '#555';
}

// Colores para los encabezados de cada mes
const MONTH_COLORS = [
  'bg-red-200', 'bg-orange-200', 'bg-yellow-200', 'bg-green-200',
  'bg-teal-200', 'bg-blue-200', 'bg-indigo-200', 'bg-purple-200',
  'bg-pink-200', 'bg-gray-200', 'bg-lime-200', 'bg-rose-200'
];

export default function CalendarGrid({ races, onOpenRace }) {
  // Meses: noviembre y diciembre 2025 + todos 2026
  const months = [
    new Date(2025, 10, 1),
    new Date(2025, 11, 1),
    ...Array.from({ length: 12 }, (_, i) => new Date(2026, i, 1))
  ];

  const eventsByMonth = Array.from({ length: months.length }, () => []);

  races.forEach(r => {
    const d = new Date(r.date);
    const monthIndex = months.findIndex(m => m.getFullYear() === d.getFullYear() && m.getMonth() === d.getMonth());
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
    // Fondo pastel de todo el calendario
    <div className="grid gap-4 p-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 bg-blue-50 min-h-screen">
      {months.map((monthStart, idx) => (
        <div
          key={idx}
          className="bg-white/80 rounded-2xl shadow-sm p-2 hover:shadow-lg transition-shadow duration-200 w-full"
        >
          {/* Encabezado del mes con color suave */}
          <div
            className={`text-center text-sm font-semibold mb-2 p-2 rounded ${MONTH_COLORS[idx % MONTH_COLORS.length]} text-gray-900 bg-gradient-to-r from-white/30 to-white/10`}
          >
            {dayjs(monthStart).locale('es').format('MMMM YYYY')}
          </div>

          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale={esLocale}
            firstDay={1}
            headerToolbar={false}
            height="auto"
            dayMaxEvents={3}
            fixedWeekCount={false}
            initialDate={monthStart}
            events={eventsByMonth[idx]}
            selectable={false}
            eventClick={(info) => {
              info.jsEvent.preventDefault();
              onOpenRace(info.event.extendedProps);
            }}
            eventClassNames={() => 'rounded-md cursor-pointer hover:scale-105 transform transition duration-200 ease-out shadow-sm hover:shadow-md'}
            dayCellClassNames={() => 'p-1'}
          />
        </div>
      ))}
    </div>
  );
}
