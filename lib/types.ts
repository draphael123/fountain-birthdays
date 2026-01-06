export interface BirthdayPerson {
  id: string;
  name: string;
  dob: Date;
  team?: string;
}

export type FilterType = 'all' | 'today' | 'thisMonth' | 'next30Days';

export type ViewType = 'card' | 'calendar';


