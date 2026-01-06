'use client';

import { useState } from 'react';
import { BirthdayPerson } from '@/lib/types';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { getNextBirthday } from '@/lib/birthdayUtils';

interface CalendarViewProps {
  people: BirthdayPerson[];
  onDayClick: (date: Date, birthdays: BirthdayPerson[]) => void;
}

export default function CalendarView({ people, onDayClick }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get first day of week for the month (0 = Sunday)
  const firstDayOfWeek = monthStart.getDay();

  // Create empty cells for days before month starts
  const emptyCells = Array(firstDayOfWeek).fill(null);

  // Group birthdays by day
  const birthdaysByDay = new Map<string, BirthdayPerson[]>();
  people.forEach((person) => {
    const nextBirthday = getNextBirthday(person.dob);
    const dayKey = format(nextBirthday, 'yyyy-MM-dd');
    if (!birthdaysByDay.has(dayKey)) {
      birthdaysByDay.set(dayKey, []);
    }
    birthdaysByDay.get(dayKey)!.push(person);
  });

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleJumpToCurrent = () => {
    setCurrentMonth(new Date());
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100 p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handlePreviousMonth}
          className="px-4 py-2 text-purple-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 rounded-xl transition-all hover:scale-110 font-bold text-lg shadow-md hover:shadow-lg"
          aria-label="Previous month"
        >
          ←
        </button>
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <button
            onClick={handleJumpToCurrent}
            className="px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 text-sm font-bold"
          >
            📅 Today
          </button>
        </div>
        <button
          onClick={handleNextMonth}
          className="px-4 py-2 text-purple-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 rounded-xl transition-all hover:scale-110 font-bold text-lg shadow-md hover:shadow-lg"
          aria-label="Next month"
        >
          →
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Week day headers */}
        {weekDays.map((day) => (
          <div key={day} className="text-center text-sm font-bold text-purple-600 py-3 bg-gradient-to-b from-purple-50 to-transparent rounded-lg">
            {day}
          </div>
        ))}

        {/* Empty cells for days before month */}
        {emptyCells.map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square" />
        ))}

        {/* Days of month */}
        {daysInMonth.map((day) => {
          const dayKey = format(day, 'yyyy-MM-dd');
          const birthdays = birthdaysByDay.get(dayKey) || [];
          const isCurrentDay = isToday(day);
          const isCurrentMonth = isSameMonth(day, currentMonth);

          return (
            <button
              key={dayKey}
              onClick={() => birthdays.length > 0 && onDayClick(day, birthdays)}
              className={`aspect-square p-2 rounded-xl border-2 transition-all hover:scale-105 ${
                isCurrentDay
                  ? 'border-purple-500 bg-gradient-to-br from-purple-100 to-pink-100 font-bold shadow-lg ring-2 ring-purple-300'
                  : 'border-transparent hover:border-purple-300 hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50'
              } ${!isCurrentMonth ? 'opacity-30' : ''} ${
                birthdays.length > 0 ? 'cursor-pointer' : 'cursor-default'
              }`}
              disabled={birthdays.length === 0}
            >
              <div className={`text-sm font-bold mb-1 ${
                isCurrentDay ? 'text-purple-700' : 'text-gray-800'
              }`}>
                {format(day, 'd')}
              </div>
              {birthdays.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {birthdays.slice(0, 2).map((person) => (
                    <span
                      key={person.id}
                      className="text-xs px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full truncate max-w-full font-semibold shadow-sm"
                    >
                      {person.name.split(' ')[0]}
                    </span>
                  ))}
                  {birthdays.length > 2 && (
                    <span className="text-xs px-2 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold shadow-sm">
                      +{birthdays.length - 2}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

