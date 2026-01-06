
import { Category } from './types';

export const PRIVATE_EXPENSE_CATEGORIES: Category[] = [
  { id: 'food', name: 'Spesa Alimentare', icon: '🛒', color: 'bg-emerald-50' },
  { id: 'rent', name: 'Affitto/Mutuo', icon: '🏠', color: 'bg-blue-50' },
  { id: 'utilities', name: 'Utenze', icon: '⚡', color: 'bg-amber-50' },
  { id: 'leisure', name: 'Svago', icon: '🎬', color: 'bg-purple-50' },
  { id: 'transport', name: 'Trasporti', icon: '🚗', color: 'bg-slate-50' },
];

export const PRIVATE_INCOME_CATEGORIES: Category[] = [
  { id: 'salary', name: 'Stipendio', icon: '💰', color: 'bg-emerald-50' },
  { id: 'gift', name: 'Regalo', icon: '🎁', color: 'bg-pink-50' },
  { id: 'sale', name: 'Vendita', icon: '🏷️', color: 'bg-blue-50' },
  { id: 'refund', name: 'Rimborso', icon: '↩️', color: 'bg-orange-50' },
];

export const BUSINESS_EXPENSE_CATEGORIES: Category[] = [
  { id: 'salaries', name: 'Stipendi', icon: '👥', color: 'bg-indigo-50' },
  { id: 'saas', name: 'SaaS/Software', icon: '☁️', color: 'bg-sky-50' },
  { id: 'tax', name: 'Tasse/IVA', icon: '🏛️', color: 'bg-rose-50' },
  { id: 'marketing', name: 'Marketing', icon: '📣', color: 'bg-pink-50' },
  { id: 'vendors', name: 'Fornitori', icon: '📦', color: 'bg-orange-50' },
];

export const BUSINESS_INCOME_CATEGORIES: Category[] = [
  { id: 'invoice', name: 'Fattura Cliente', icon: '📑', color: 'bg-emerald-50' },
  { id: 'services', name: 'Consulenza', icon: '🧠', color: 'bg-indigo-50' },
  { id: 'products', name: 'Vendita Prodotti', icon: '🛍️', color: 'bg-sky-50' },
  { id: 'investment', name: 'Investimento', icon: '📈', color: 'bg-emerald-50' },
];

export const STORAGE_KEY_USER_TYPE = 'nova_user_type';
export const STORAGE_KEY_TRANSACTIONS = 'nova_transactions';
export const STORAGE_KEY_THEME = 'nova_theme';
