
export type UserRole = 'tutor' | 'vet';

export interface Pet {
  id: string;
  name: string;
  breed: string;
  age: string;
  imageUrl: string;
  status?: string;
}

export interface Appointment {
  id: string;
  vetName: string;
  vetAvatar: string;
  date: string;
  description: string;
  status: 'Concluída' | 'Pendente' | 'Confirmada';
  type: string;
}

export interface Vaccine {
  id: string;
  name: string;
  description: string;
  status: 'PROTEGIDO' | 'EXPIRADA' | 'EM DIA';
  nextDose: string;
  daysRemaining?: number;
}
