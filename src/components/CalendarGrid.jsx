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

const MONTH_COLORS = [
  'bg-red-200', 'bg-orange-200', 'bg-yellow-200', 'bg-green-200',
  'bg-teal-200', 'bg-blue-200', 'bg-indigo-200', 'bg-purple-200',
  'bg-pink-200', 'bg-gray-200', 'bg-lime-200', 'bg-rose-200'
];

export default function CalendarGrid({ year, races, onOpenRace }) {
  const eventsByMonth = Array.from({ length: 12 }, () => []);

  races.forEach(r => {
    const d = new Date(r.date);
    const month = d.getMonth();
    eventsByMonth[month].push({
      id: r.id,
      title: r.name,
      start: r.date,
      extendedProps: r,
      backgroundColor: getColorForType(r.type) + '44',
      borderColor: getColorForType(r.type),
      textColor: '#111827',
    });
  });

  return (
    <div className="grid gap-4 p-2
                    grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 12 }, (_, idx) => {
        const monthStart = new Date(year, idx, 1);
        return (
          <div
            key={idx}
            className="bg-gray-50 rounded-2xl shadow-sm p-2 hover:shadow-lg transition-shadow duration-200 w-full"
          >
            <div
              className={`text-center text-sm font-semibold mb-2 p-2 rounded ${MONTH_COLORS[idx]} text-gray-900 bg-gradient-to-r from-white/30 to-white/10`}
            >
              {dayjs(monthStart).locale('es').format('MMMM YYYY')}
            </div>

            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              locale={esLocale}
              firstDay={1}
              headerToolbar={false}
              height="auto"           // importante para móvil
              dayMaxEvents={3}
              fixedWeekCount={false}
              initialDate={monthStart}
              events={eventsByMonth[idx]}
              selectable={false}
              eventClick={(info) => {
                info.jsEvent.preventDefault();
                const race = info.event.extendedProps;
                onOpenRace(race);
              }}
              eventClassNames={() => 'rounded-md cursor-pointer hover:scale-105 transform transition duration-200 ease-out shadow-sm hover:shadow-md'}
              dayCellClassNames={() => 'p-1'}
            />
          </div>
        );
      })}
    </div>
  );
}
