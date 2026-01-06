'use client';

import { FilterType, ViewType } from '@/lib/types';

interface HeaderControlsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
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
  view,
  onViewChange,
  onExportCsv,
  onImportCsv,
  reducedMotion,
  onToggleReducedMotion,
}: HeaderControlsProps) {
  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-md sticky top-0 z-50 border-b border-purple-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col gap-4">
          {/* Title */}
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            🎉 Fountain Birthdays
          </h1>

          {/* Controls Row */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            {/* Search */}
            <div className="flex-1 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Filter Dropdown */}
            <select
              value={filter}
              onChange={(e) => onFilterChange(e.target.value as FilterType)}
              className="px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
            >
              <option value="all">All</option>
              <option value="today">Today</option>
              <option value="thisMonth">This month</option>
              <option value="next30Days">Next 30 days</option>
            </select>

            {/* View Toggle */}
            <div className="flex gap-2 bg-purple-50 p-1 rounded-lg">
              <button
                onClick={() => onViewChange('card')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  view === 'card'
                    ? 'bg-white shadow-sm text-purple-600 font-medium'
                    : 'text-purple-600 hover:bg-white/50'
                }`}
              >
                Card Wall
              </button>
              <button
                onClick={() => onViewChange('calendar')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  view === 'calendar'
                    ? 'bg-white shadow-sm text-purple-600 font-medium'
                    : 'text-purple-600 hover:bg-white/50'
                }`}
              >
                Calendar
              </button>
            </div>

            {/* Export/Import Buttons */}
            <div className="flex gap-2">
              <button
                onClick={onExportCsv}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
              >
                Export CSV
              </button>
              <button
                onClick={onImportCsv}
                className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors text-sm"
              >
                Import CSV
              </button>
              <button
                onClick={onToggleReducedMotion}
                className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                  reducedMotion
                    ? 'bg-gray-600 text-white hover:bg-gray-700'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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

