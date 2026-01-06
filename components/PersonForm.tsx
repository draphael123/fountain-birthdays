'use client';

import { useState, useEffect } from 'react';
import { BirthdayPerson } from '@/lib/types';

interface PersonFormProps {
  person?: BirthdayPerson | null;
  onSave: (person: Omit<BirthdayPerson, 'id'>) => void;
  onClose: () => void;
}

export default function PersonForm({ person, onSave, onClose }: PersonFormProps) {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');

  useEffect(() => {
    if (person) {
      setName(person.name);
      // Format date as YYYY-MM-DD for input
      const date = new Date(person.dob);
      setDob(formatDateForInput(date));
    } else {
      setName('');
      setDob('');
    }
  }, [person]);

  const formatDateForInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !dob) {
      alert('Please fill in all fields');
      return;
    }

    const dobDate = new Date(dob);
    if (isNaN(dobDate.getTime())) {
      alert('Please enter a valid date');
      return;
    }

    onSave({
      name: name.trim(),
      dob: dobDate,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {person ? 'Edit Person' : 'Add Person'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth
            </label>
            <input
              id="dob"
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              {person ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

