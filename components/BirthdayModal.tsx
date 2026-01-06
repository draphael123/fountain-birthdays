'use client';

import { BirthdayPerson } from '@/lib/types';
import {
  getFormattedDOB,
  getFormattedNextBirthday,
  getDaysUntilBirthday,
  generateBirthdayMessage,
  isBirthdayToday,
} from '@/lib/birthdayUtils';
import { useEffect, useRef } from 'react';

interface BirthdayModalProps {
  person: BirthdayPerson | null;
  onClose: () => void;
  onDelete?: (id: string) => void;
  onEdit?: (person: BirthdayPerson) => void;
}

export default function BirthdayModal({ person, onClose, onDelete, onEdit }: BirthdayModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (person) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [person, onClose]);

  if (!person) return null;

  const daysUntil = getDaysUntilBirthday(person.dob);
  const isToday = isBirthdayToday(person.dob);
  const message = generateBirthdayMessage(person.name);

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message);
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200"
        role="dialog"
        aria-labelledby="modal-title"
        aria-modal="true"
      >
        <div className="flex justify-between items-start mb-4">
          <h2 id="modal-title" className="text-2xl font-bold text-gray-800">
            {person.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Date of Birth</p>
            <p className="text-lg font-medium text-gray-800">{getFormattedDOB(person.dob)}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Next Birthday</p>
            <p className="text-lg font-medium text-gray-800">{getFormattedNextBirthday(person.dob)}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Days Until</p>
            <p
              className={`text-2xl font-bold ${
                isToday ? 'text-pink-600' : daysUntil <= 7 ? 'text-purple-600' : 'text-gray-800'
              }`}
            >
              {isToday ? '🎉 Today!' : `${daysUntil} day${daysUntil !== 1 ? 's' : ''}`}
            </p>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={handleCopyMessage}
              className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-medium"
            >
              Copy Birthday Message
            </button>
          </div>

          {(onEdit || onDelete) && (
            <div className="pt-4 border-t border-gray-200 flex gap-2">
              {onEdit && (
                <button
                  onClick={() => {
                    onEdit(person);
                    onClose();
                  }}
                  className="flex-1 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                >
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete ${person.name}?`)) {
                      onDelete(person.id);
                      onClose();
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

