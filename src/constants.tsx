
import { Pet, Appointment, Vaccine } from './types';

export const COLORS = {
  primary: '#137fec',
  secondary: '#ee8c2b',
  dark: '#101922',
  surface: '#1c242d',
};

export const MOCK_PETS: Pet[] = [
  {
    id: '1',
    name: 'Rex',
    breed: 'Golden Retriever',
    age: '4 anos',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKBsudbeSg1-VCs6V2BMl4cQoBFlpYThd-suIXZGgniyWU95iscOpZs_uYBh707kdkQp0Uv9-eI0ic_m6YUa8sD4N6YJI1uSejerW63Ena6HWbqJ-r5zgulk75ciD4O9eUaKunLwlQabz7CmMP01SZ3giE-BF8R4lWOgWSwUX5mrFQ9iUGxpM2YJv53pX-r7G6UlUTUjzRYWe01XpSX9Nc1OVRvHwFvZBFzRoE14wytpAdUqscHRc6ZZYi9EgNqAYEQEQ9gaMBbA',
    status: 'Em Atendimento'
  },
  {
    id: '2',
    name: 'Luna',
    breed: 'Siamês',
    age: '3 anos',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1N_ZlAL_NYGOG9zmd_2nJgqjtlWED_WBsu72Kpdc5_mSGAj1sbhp81AqhtAIvWjBVx4YoR1T0hkBIFFSi5ARpz_PYV9xgIbwrQzf3LpelVT_uBqRiifOyrVfQcpOkJXtLOJL49eC-8rLPu_-GitAqN2JtoVATbhWhHug8PNRlLEds02ITZtYwp5RfHqPy1-zzhUIT4gZMiQHd0HS3wtg9dN2Ph2vKcq_GQ5aN5HgKouuegIxmjDlcSxW0AxacSnxhnCxCZIeIng'
  },
  {
    id: '3',
    name: 'Thor',
    breed: 'Golden Retriever',
    age: '3 anos',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrAkzD9p1haRx9E7T3QpeVP-AE4IZ8jaHzmwF6EfQ06V3P0wxHhUIq2CRZtDMCY-B9EI1itSA4MZAapC-YuhlZAYjHYAxvzwvsYXou34KrcEynaND3k_WYspm7JFrJe5lph1YMts1iZwc9gcFQhKl5mnxlV0Y6oeXqrGw5stXpfPapg6ZelMPaqtnBkb12O0sCBxv4kZiAAldDmNrfNad987HYSXWp1vDCkK_Sxje2GwT_QRjyor1zKBsSz268Th9CMZ6YOxMCmw'
  }
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'a1',
    vetName: 'Dr. Ana Souza',
    vetAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCm2bSISxXXezMKDvC_yH3TDpi9rtARee_nk2RmoqKc8Jro23Zi7OSjnUFc7SvCu4cgf0j7VOVMgcxGnHQXyqRehlzdFVfepdkyxlXZKc1RZaCpTxPDyEKiSgDBdmW1IEE9nJythadFUobP5qTtn0sWlXTeZYPj6yGk1ELEbfjsWgXAZmgDDVhP9cqAjJnfHIHoaNHt5VV0x3VY75YGBJuGcQ2tXIp1I13gjWA0uOcio1YC3POIZtiKF_N_9M2MJcqBK4z1TC7Xaw',
    date: '12 Out 2023',
    description: 'Check-up Anual e Vacina V10',
    status: 'Concluída',
    type: 'CONSULTA'
  },
  {
    id: 'a2',
    vetName: 'Dr. Carlos Silva',
    vetAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0ocQEHtW0GYt-mPh42JaaO75C8jVAdTQh0YZb6wckDdOdhWaR_h9n1JYHCXyhUWJ2hCI9uYkG4AanMG1PyueK79VeBvcZ42qDieFtUM0GonngbtQZMusu8UWXz4gJzaHUGeGpdA5VgkxYXQ2WKKyzrI65BV9ldra4QztmWIYQZcVGN7K2P7AXC-wKNIYpCeOck3o23Kjqaxmbvn1RBER5efgShE7bvhh91Tfj6wJ59gizTbF9gkBCgL3xyLM9OMNiKBa8itnTdQ',
    date: '28 Set 2023',
    description: 'Consulta Dermatológica',
    status: 'Concluída',
    type: 'CONSULTA'
  }
];

export const MOCK_VACCINES: Vaccine[] = [
  {
    id: 'v1',
    name: 'Giardíase (V1)',
    description: 'Prevenção contra giárdia',
    status: 'PROTEGIDO',
    nextDose: '15 Out 2024',
    daysRemaining: 5
  },
  {
    id: 'v2',
    name: 'V10 (Polivalente)',
    description: 'Reforço Anual • Dose 2/3',
    status: 'EM DIA',
    nextDose: '12 Dez 2024'
  },
  {
    id: 'v3',
    name: 'Bronchi-Shield',
    description: 'Tosse dos Canis',
    status: 'EXPIRADA',
    nextDose: '15 Set 2024'
  }
];
