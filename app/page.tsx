'use client';

import { useState, useEffect, useMemo } from 'react';
import { BirthdayPerson, FilterType, ViewType } from '@/lib/types';
import { loadDefaultCsv } from '@/lib/loadDefaultCsv';
import { loadBirthdaysFromStorage, saveBirthdaysToStorage } from '@/lib/storage';
import {
  filterBirthdays,
  sortBySoonestBirthday,
  getUpcomingBirthdays,
  isBirthdayToday,
} from '@/lib/birthdayUtils';
import HeaderControls from '@/components/HeaderControls';
import BirthdayCard from '@/components/BirthdayCard';
import BirthdayModal from '@/components/BirthdayModal';
import CalendarView from '@/components/CalendarView';
import UpcomingList from '@/components/UpcomingList';
import CsvDropzone from '@/components/CsvDropzone';
import PersonForm from '@/components/PersonForm';
import { format } from 'date-fns';

export default function Home() {
  const [people, setPeople] = useState<BirthdayPerson[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [teamFilter, setTeamFilter] = useState<string>('all');
  const [view, setView] = useState<ViewType>('card');
  const [selectedPerson, setSelectedPerson] = useState<BirthdayPerson | null>(null);
  const [showCsvDropzone, setShowCsvDropzone] = useState(false);
  const [showPersonForm, setShowPersonForm] = useState(false);
  const [editingPerson, setEditingPerson] = useState<BirthdayPerson | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      // Try loading from localStorage first
      const stored = loadBirthdaysFromStorage();
      if (stored.length > 0) {
        setPeople(stored);
      } else {
        // Load default CSV
        const defaultData = await loadDefaultCsv();
        if (defaultData.length > 0) {
          setPeople(defaultData);
          saveBirthdaysToStorage(defaultData);
        }
      }
    };

    loadData();

    // Check for reduced motion preference and localStorage setting
    const storedMotion = localStorage.getItem('fountain-birthdays-reduced-motion');
    if (storedMotion !== null) {
      setReducedMotion(storedMotion === 'true');
    } else {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReducedMotion(mediaQuery.matches);
      const handleChange = (e: MediaQueryListEvent) => {
        if (localStorage.getItem('fountain-birthdays-reduced-motion') === null) {
          setReducedMotion(e.matches);
        }
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  // Save reduced motion preference
  const handleToggleReducedMotion = () => {
    const newValue = !reducedMotion;
    setReducedMotion(newValue);
    localStorage.setItem('fountain-birthdays-reduced-motion', String(newValue));
  };

  // Save to localStorage whenever people change
  useEffect(() => {
    if (people.length > 0) {
      saveBirthdaysToStorage(people);
    }
  }, [people]);

  // Get unique teams
  const uniqueTeams = useMemo(() => {
    const teams = new Set<string>();
    people.forEach((person) => {
      if (person.team) {
        teams.add(person.team);
      }
    });
    return Array.from(teams).sort();
  }, [people]);

  // Filter and search
  const filteredPeople = useMemo(() => {
    let result = filterBirthdays(people, filter);
    
    // Filter by team
    if (teamFilter !== 'all') {
      result = result.filter((person) => person.team === teamFilter);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((person) =>
        person.name.toLowerCase().includes(query) ||
        (person.team && person.team.toLowerCase().includes(query))
      );
    }

    return sortBySoonestBirthday(result);
  }, [people, filter, teamFilter, searchQuery]);

  // Get upcoming birthdays for sidebar
  const upcomingBirthdays = useMemo(() => {
    return getUpcomingBirthdays(people, 10);
  }, [people]);

  // Check if there are birthdays today
  const hasTodaysBirthdays = useMemo(() => {
    return people.some((person) => isBirthdayToday(person.dob));
  }, [people]);

  // Handle CSV export
  const handleExportCsv = () => {
    const csvContent = [
      'Name,DOB,Team',
      ...people.map((person) => {
        const dob = format(person.dob, 'MM/dd/yyyy');
        const team = person.team || '';
        return `"${person.name}",${dob},"${team}"`;
      }),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'birthdays.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Handle CSV import
  const handleImportCsv = (importedPeople: BirthdayPerson[]) => {
    setPeople(importedPeople);
  };

  // Handle add person
  const handleAddPerson = (personData: Omit<BirthdayPerson, 'id'>) => {
    const newPerson: BirthdayPerson = {
      ...personData,
      id: `${personData.name.toLowerCase().replace(/\s+/g, '-')}-${personData.dob.getTime()}`,
    };
    setPeople([...people, newPerson]);
  };

  // Handle edit person
  const handleEditPerson = (personData: Omit<BirthdayPerson, 'id'>) => {
    if (!editingPerson) return;
    const updatedPerson: BirthdayPerson = {
      ...personData,
      id: editingPerson.id,
    };
    setPeople(people.map((p) => (p.id === editingPerson.id ? updatedPerson : p)));
    setEditingPerson(null);
  };

  // Handle delete person
  const handleDeletePerson = (id: string) => {
    setPeople(people.filter((p) => p.id !== id));
  };

  // Handle calendar day click
  const handleCalendarDayClick = (date: Date, birthdays: BirthdayPerson[]) => {
    if (birthdays.length === 1) {
      setSelectedPerson(birthdays[0]);
    } else if (birthdays.length > 1) {
      // For multiple birthdays, show the first one (could be enhanced to show a list)
      setSelectedPerson(birthdays[0]);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Celebration Banner */}
      {hasTodaysBirthdays && (
        <div className={`relative overflow-hidden bg-gradient-to-r from-pink-500 via-purple-600 to-pink-500 text-white text-center py-4 px-4 shadow-lg ${
          !reducedMotion ? 'animate-bounce' : ''
        }`}>
          <div className="absolute inset-0 bg-white/20 animate-pulse" />
          <div className="relative flex items-center justify-center gap-3">
            <span className="text-2xl animate-spin">🎉</span>
            <p className="font-extrabold text-xl tracking-wide">Happy Birthday!</p>
            <span className="text-2xl animate-spin" style={{ animationDirection: 'reverse' }}>🎉</span>
          </div>
        </div>
      )}

      <HeaderControls
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filter={filter}
        onFilterChange={setFilter}
        teamFilter={teamFilter}
        onTeamFilterChange={setTeamFilter}
        teams={uniqueTeams}
        view={view}
        onViewChange={setView}
        onExportCsv={handleExportCsv}
        onImportCsv={() => setShowCsvDropzone(true)}
        reducedMotion={reducedMotion}
        onToggleReducedMotion={handleToggleReducedMotion}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Add Person Button */}
            <div className="mb-6 flex justify-end">
              <button
                onClick={() => {
                  setEditingPerson(null);
                  setShowPersonForm(true);
                }}
                className="group px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white rounded-xl hover:from-purple-700 hover:via-pink-700 hover:to-purple-700 transition-all font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
              >
                <span className="text-2xl group-hover:rotate-90 transition-transform">➕</span>
                <span>Add Person</span>
              </button>
            </div>

            {/* Card Wall View */}
            {view === 'card' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPeople.length === 0 ? (
                  <div className="col-span-full text-center py-16">
                    <div className="inline-block p-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl mb-4">
                      <span className="text-6xl">🎂</span>
                    </div>
                    <p className="text-xl font-bold text-gray-700 mb-2">No birthdays found</p>
                    <p className="text-sm text-gray-500">Try adjusting your search or filter</p>
                  </div>
                ) : (
                  filteredPeople.map((person) => (
                    <BirthdayCard
                      key={person.id}
                      person={person}
                      onClick={() => setSelectedPerson(person)}
                    />
                  ))
                )}
              </div>
            )}

            {/* Calendar View */}
            {view === 'calendar' && (
              <CalendarView
                people={people}
                onDayClick={handleCalendarDayClick}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-80">
            <UpcomingList people={upcomingBirthdays} />
          </div>
        </div>
      </main>

      {/* Modals */}
      {selectedPerson && (
        <BirthdayModal
          person={selectedPerson}
          onClose={() => setSelectedPerson(null)}
          onDelete={handleDeletePerson}
          onEdit={(person) => {
            setEditingPerson(person);
            setShowPersonForm(true);
          }}
        />
      )}

      {showCsvDropzone && (
        <CsvDropzone
          onImport={handleImportCsv}
          onClose={() => setShowCsvDropzone(false)}
        />
      )}

      {showPersonForm && (
        <PersonForm
          person={editingPerson}
          onSave={editingPerson ? handleEditPerson : handleAddPerson}
          onClose={() => {
            setShowPersonForm(false);
            setEditingPerson(null);
          }}
        />
      )}

      {/* Confetti effect for today's birthdays */}
      {hasTodaysBirthdays && !reducedMotion && (
        <div className="fixed inset-0 pointer-events-none z-40">
          <div className="absolute top-0 left-1/4 w-2 h-2 bg-pink-500 rounded-full animate-ping" />
          <div className="absolute top-0 left-1/2 w-2 h-2 bg-purple-500 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
          <div className="absolute top-0 left-3/4 w-2 h-2 bg-pink-500 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
        </div>
      )}
    </div>
  );
}

