'use client';

import { FilterType, ViewType } from '@/lib/types';

interface HeaderControlsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  teamFilter: string;
  onTeamFilterChange: (team: string) => void;
  teams: string[];
  view: ViewType;
  onViewChange: (view: ViewType) => void;
  onExportCsv: () => void;
  onImportCsv: () => void;
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
}

export default function HeaderControls({
  searchQuery,
  onSearchChange,
  filter,
  onFilterChange,
  teamFilter,
  onTeamFilterChange,
  teams,
  view,
  onViewChange,
  onExportCsv,
  onImportCsv,
  reducedMotion,
  onToggleReducedMotion,
}: HeaderControlsProps) {
  return (
    <header className="glass-effect sticky top-0 z-50 shadow-lg border-b border-purple-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col gap-5">
          {/* Title */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-2xl shadow-lg">
              🎉
            </div>
            <h1 className="text-4xl font-extrabold gradient-text">
              Fountain Birthdays
            </h1>
          </div>

          {/* Controls Row */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            {/* Search */}
            <div className="flex-1 w-full sm:w-auto relative">
              <input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full px-4 py-2.5 pl-10 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-400 bg-white/80 backdrop-blur-sm shadow-sm transition-all"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            </div>

            {/* Filter Dropdown */}
            <select
              value={filter}
              onChange={(e) => onFilterChange(e.target.value as FilterType)}
              className="px-4 py-2.5 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-400 bg-white/80 backdrop-blur-sm shadow-sm transition-all font-medium"
            >
              <option value="all">All</option>
              <option value="today">Today</option>
              <option value="thisMonth">This month</option>
              <option value="next30Days">Next 30 days</option>
            </select>

            {/* Team Filter Dropdown */}
            {teams.length > 0 && (
              <select
                value={teamFilter}
                onChange={(e) => onTeamFilterChange(e.target.value)}
                className="px-4 py-2.5 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-400 bg-white/80 backdrop-blur-sm shadow-sm transition-all font-medium"
              >
                <option value="all">All Teams</option>
                {teams.map((team) => (
                  <option key={team} value={team}>
                    {team}
                  </option>
                ))}
              </select>
            )}

            {/* View Toggle */}
            <div className="flex gap-2 bg-gradient-to-r from-purple-100 to-pink-100 p-1.5 rounded-xl shadow-inner">
              <button
                onClick={() => onViewChange('card')}
                className={`px-5 py-2.5 rounded-lg transition-all font-semibold ${
                  view === 'card'
                    ? 'bg-white shadow-lg text-purple-600 scale-105'
                    : 'text-purple-600 hover:bg-white/70 hover:scale-105'
                }`}
              >
                🎴 Card Wall
              </button>
              <button
                onClick={() => onViewChange('calendar')}
                className={`px-5 py-2.5 rounded-lg transition-all font-semibold ${
                  view === 'calendar'
                    ? 'bg-white shadow-lg text-purple-600 scale-105'
                    : 'text-purple-600 hover:bg-white/70 hover:scale-105'
                }`}
              >
                📅 Calendar
              </button>
            </div>

            {/* Export/Import Buttons */}
            <div className="flex gap-2">
              <button
                onClick={onExportCsv}
                className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg hover:shadow-xl hover:scale-105 text-sm font-semibold"
              >
                📥 Export CSV
              </button>
              <button
                onClick={onImportCsv}
                className="px-4 py-2.5 bg-gradient-to-r from-pink-600 to-pink-700 text-white rounded-xl hover:from-pink-700 hover:to-pink-800 transition-all shadow-lg hover:shadow-xl hover:scale-105 text-sm font-semibold"
              >
                📤 Import CSV
              </button>
              <button
                onClick={onToggleReducedMotion}
                className={`px-4 py-2.5 rounded-xl transition-all text-sm font-semibold shadow-md hover:shadow-lg hover:scale-105 ${
                  reducedMotion
                    ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800'
                    : 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 hover:from-gray-300 hover:to-gray-400'
                }`}
                title="Reduce motion"
              >
                {reducedMotion ? '🎬' : '🎭'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

