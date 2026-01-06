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
        <div className="relative overflow-hidden bg-gradient-to-br from-pink-500 via-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-2xl shadow-pink-500/50">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
          <div className="relative">
            <h2 className="text-2xl font-extrabold mb-4 flex items-center gap-2">
              <span className="text-3xl animate-bounce">🎉</span>
              <span>Today&apos;s Birthdays</span>
            </h2>
            <div className="space-y-3">
              {todaysBirthdays.map((person) => {
                const initials = getInitials(person.name);
                return (
                  <div key={person.id} className="bg-white/25 backdrop-blur-md rounded-xl p-4 flex items-center gap-3 border border-white/30 shadow-lg hover:bg-white/30 transition-all hover:scale-105">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-300 to-pink-400 flex items-center justify-center font-bold text-lg shadow-lg ring-2 ring-white/50">
                      {initials}
                    </div>
                    <div>
                      <p className="font-bold text-lg">{person.name}</p>
                      <p className="text-sm text-white/90">{getFormattedBirthday(person.dob)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* This Month Count */}
      <div className="relative overflow-hidden bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-lg border border-purple-100 p-6">
        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-200 rounded-full blur-2xl opacity-30" />
        <div className="relative">
          <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
            <span>📅</span>
            <span>This Month</span>
          </h3>
          <p className="text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {thisMonthCount}
          </p>
          <p className="text-sm text-gray-600 mt-2 font-medium">birthdays</p>
        </div>
      </div>

      {/* Upcoming */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-100 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>⏰</span>
          <span>Upcoming</span>
        </h3>
        <div className="space-y-2">
          {upcoming.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">No upcoming birthdays</p>
          ) : (
            upcoming.map((person) => {
              const daysUntil = getDaysUntilBirthday(person.dob);
              const isToday = isBirthdayToday(person.dob);
              const initials = getInitials(person.name);
              
              return (
                <div key={person.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all hover:shadow-md hover:scale-[1.02] border border-transparent hover:border-purple-200">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-md ${
                    isToday ? 'ring-2 ring-yellow-400 ring-offset-2' : ''
                  }`}>
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">{person.name}</p>
                    <p className={`text-sm font-medium ${
                      isToday ? 'text-pink-600' : daysUntil <= 7 ? 'text-purple-600' : 'text-gray-500'
                    }`}>
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

