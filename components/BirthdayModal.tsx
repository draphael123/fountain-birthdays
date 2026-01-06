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
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className={`relative overflow-hidden rounded-3xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in duration-300 ${
          isToday 
            ? 'bg-gradient-to-br from-pink-500 via-purple-500 to-pink-600 text-white' 
            : 'bg-white/95 backdrop-blur-lg border-2 border-purple-100'
        }`}
        role="dialog"
        aria-labelledby="modal-title"
        aria-modal="true"
      >
        {/* Decorative elements */}
        {isToday && (
          <>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/20 rounded-full blur-3xl" />
          </>
        )}
        
        <div className="relative flex justify-between items-start mb-6">
          <div>
            <h2 id="modal-title" className={`text-3xl font-extrabold ${
              isToday ? 'text-white' : 'text-gray-800'
            }`}>
              {person.name}
            </h2>
            {isToday && (
              <p className="text-yellow-200 text-sm font-semibold mt-1 flex items-center gap-1">
                <span className="animate-bounce">🎉</span>
                <span>Celebrating Today!</span>
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className={`text-3xl leading-none hover:scale-110 transition-transform ${
              isToday ? 'text-white/80 hover:text-white' : 'text-gray-400 hover:text-gray-600'
            }`}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className="relative space-y-5">
          <div className={`p-4 rounded-xl ${
            isToday ? 'bg-white/20 backdrop-blur-sm' : 'bg-purple-50'
          }`}>
            <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${
              isToday ? 'text-white/80' : 'text-gray-500'
            }`}>Date of Birth</p>
            <p className={`text-lg font-bold ${
              isToday ? 'text-white' : 'text-gray-800'
            }`}>{getFormattedDOB(person.dob)}</p>
          </div>

          <div className={`p-4 rounded-xl ${
            isToday ? 'bg-white/20 backdrop-blur-sm' : 'bg-pink-50'
          }`}>
            <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${
              isToday ? 'text-white/80' : 'text-gray-500'
            }`}>Next Birthday</p>
            <p className={`text-lg font-bold ${
              isToday ? 'text-white' : 'text-gray-800'
            }`}>{getFormattedNextBirthday(person.dob)}</p>
          </div>

          <div className={`p-5 rounded-xl ${
            isToday 
              ? 'bg-gradient-to-br from-yellow-300/30 to-pink-400/30 backdrop-blur-sm border-2 border-yellow-200/50' 
              : 'bg-gradient-to-br from-purple-100 to-pink-100'
          }`}>
            <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${
              isToday ? 'text-white/90' : 'text-gray-500'
            }`}>Days Until</p>
            <p
              className={`text-4xl font-extrabold ${
                isToday 
                  ? 'text-yellow-200' 
                  : daysUntil <= 7 
                  ? 'text-purple-600' 
                  : 'text-gray-800'
              }`}
            >
              {isToday ? '🎉 Today!' : `${daysUntil} day${daysUntil !== 1 ? 's' : ''}`}
            </p>
          </div>

          <div className="pt-4 border-t border-gray-200/50">
            <button
              onClick={handleCopyMessage}
              className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white rounded-xl hover:from-purple-700 hover:via-pink-700 hover:to-purple-700 transition-all font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105"
            >
              📋 Copy Birthday Message
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


