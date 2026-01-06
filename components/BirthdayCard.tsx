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
      className="card-hover bg-white rounded-xl shadow-md p-6 text-left w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
      aria-label={`${person.name}'s birthday`}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div
          className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white ${
            isToday
              ? 'bg-gradient-to-br from-pink-500 to-purple-600 animate-pulse'
              : 'bg-gradient-to-br from-purple-400 to-pink-400'
          }`}
        >
          {initials}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg text-gray-800 truncate">{person.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{getFormattedBirthday(person.dob)}</p>
          <p
            className={`text-sm font-medium mt-2 ${
              isToday
                ? 'text-pink-600 font-bold'
                : daysUntil <= 7
                ? 'text-purple-600'
                : 'text-gray-500'
            }`}
          >
            {isToday ? '🎉 Today!' : `${daysUntil} day${daysUntil !== 1 ? 's' : ''} away`}
          </p>
        </div>
      </div>
    </button>
  );
}

