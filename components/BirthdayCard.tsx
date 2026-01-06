'use client';

import { BirthdayPerson } from '@/lib/types';
import { getFormattedBirthday, getDaysUntilBirthday, getInitials, isBirthdayToday } from '@/lib/birthdayUtils';

interface BirthdayCardProps {
  person: BirthdayPerson;
  onClick: () => void;
}

export default function BirthdayCard({ person, onClick }: BirthdayCardProps) {
  const daysUntil = getDaysUntilBirthday(person.dob);
  const isToday = isBirthdayToday(person.dob);
  const initials = getInitials(person.name);

  return (
    <button
      onClick={onClick}
      className={`card-hover group relative overflow-hidden rounded-2xl p-6 text-left w-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
        isToday
          ? 'bg-gradient-to-br from-pink-500 via-purple-500 to-pink-600 shadow-lg shadow-pink-500/50'
          : 'bg-white/90 backdrop-blur-sm shadow-lg shadow-purple-100/50 border border-purple-100/50'
      }`}
      aria-label={`${person.name}'s birthday`}
    >
      {/* Decorative gradient overlay */}
      {!isToday && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-transparent to-pink-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
      
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      
      <div className="relative flex items-start gap-4">
        {/* Avatar with enhanced styling */}
        <div
          className={`flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-lg ${
            isToday
              ? 'bg-gradient-to-br from-yellow-300 via-pink-400 to-purple-600 animate-pulse ring-4 ring-white/50'
              : 'bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 group-hover:scale-110 transition-transform duration-300'
          }`}
        >
          {initials}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className={`font-bold text-lg truncate ${
            isToday ? 'text-white' : 'text-gray-800'
          }`}>
            {person.name}
          </h3>
          <p className={`text-sm mt-1 ${
            isToday ? 'text-white/90' : 'text-gray-600'
          }`}>
            {getFormattedBirthday(person.dob)}
          </p>
          <div className="flex items-center gap-2 mt-3">
            <p
              className={`text-sm font-bold ${
                isToday
                  ? 'text-yellow-200'
                  : daysUntil <= 7
                  ? 'text-purple-600'
                  : 'text-gray-500'
              }`}
            >
              {isToday ? '🎉 Today!' : `${daysUntil} day${daysUntil !== 1 ? 's' : ''} away`}
            </p>
            {daysUntil <= 7 && !isToday && (
              <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
            )}
          </div>
        </div>
      </div>
    </button>
  );
}


