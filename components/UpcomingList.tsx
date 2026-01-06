'use client';

import { BirthdayPerson } from '@/lib/types';
import { getFormattedBirthday, getDaysUntilBirthday, getInitials, isBirthdayToday, getThisMonthBirthdays } from '@/lib/birthdayUtils';

interface UpcomingListProps {
  people: BirthdayPerson[];
}

export default function UpcomingList({ people }: UpcomingListProps) {
  const todaysBirthdays = people.filter(person => isBirthdayToday(person.dob));
  const thisMonthCount = getThisMonthBirthdays(people).length;
  const upcoming = people.slice(0, 10);

  return (
    <aside className="w-full lg:w-80 space-y-6">
      {/* Today's Birthdays */}
      {todaysBirthdays.length > 0 && (
        <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            🎉 Today's Birthdays
          </h2>
          <div className="space-y-3">
            {todaysBirthdays.map((person) => {
              const initials = getInitials(person.name);
              return (
                <div key={person.id} className="bg-white/20 backdrop-blur-sm rounded-lg p-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center font-bold">
                    {initials}
                  </div>
                  <div>
                    <p className="font-semibold">{person.name}</p>
                    <p className="text-sm text-white/90">{getFormattedBirthday(person.dob)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* This Month Count */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">This Month</h3>
        <p className="text-3xl font-bold text-purple-600">{thisMonthCount}</p>
        <p className="text-sm text-gray-500 mt-1">birthdays</p>
      </div>

      {/* Upcoming */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming</h3>
        <div className="space-y-3">
          {upcoming.length === 0 ? (
            <p className="text-gray-500 text-sm">No upcoming birthdays</p>
          ) : (
            upcoming.map((person) => {
              const daysUntil = getDaysUntilBirthday(person.dob);
              const isToday = isBirthdayToday(person.dob);
              const initials = getInitials(person.name);
              
              return (
                <div key={person.id} className="flex items-center gap-3 p-2 hover:bg-purple-50 rounded-lg transition-colors">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-sm">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{person.name}</p>
                    <p className="text-sm text-gray-500">
                      {isToday ? '🎉 Today' : `${daysUntil} day${daysUntil !== 1 ? 's' : ''} away`}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </aside>
  );
}

