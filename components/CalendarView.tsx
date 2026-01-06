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
    <div className="bg-white rounded-xl shadow-md p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handlePreviousMonth}
          className="px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
          aria-label="Previous month"
        >
          ←
        </button>
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <button
            onClick={handleJumpToCurrent}
            className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm"
          >
            Today
          </button>
        </div>
        <button
          onClick={handleNextMonth}
          className="px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
          aria-label="Next month"
        >
          →
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Week day headers */}
        {weekDays.map((day) => (
          <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
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
              className={`aspect-square p-2 rounded-lg border-2 transition-all ${
                isCurrentDay
                  ? 'border-purple-500 bg-purple-50 font-bold'
                  : 'border-transparent hover:border-purple-200 hover:bg-purple-50'
              } ${!isCurrentMonth ? 'opacity-30' : ''} ${
                birthdays.length > 0 ? 'cursor-pointer' : 'cursor-default'
              }`}
              disabled={birthdays.length === 0}
            >
              <div className="text-sm font-medium text-gray-800 mb-1">
                {format(day, 'd')}
              </div>
              {birthdays.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {birthdays.slice(0, 2).map((person) => (
                    <span
                      key={person.id}
                      className="text-xs px-1.5 py-0.5 bg-purple-200 text-purple-800 rounded-full truncate max-w-full"
                    >
                      {person.name.split(' ')[0]}
                    </span>
                  ))}
                  {birthdays.length > 2 && (
                    <span className="text-xs px-1.5 py-0.5 bg-purple-300 text-purple-800 rounded-full">
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

