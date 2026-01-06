
export enum UserType {
  PRIVATE = 'PRIVATE',
  BUSINESS = 'BUSINESS',
  UNSET = 'UNSET'
}

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  type: TransactionType;
  isDeductible?: boolean; // Business only
}

export interface FinanceState {
  userType: UserType;
  transactions: Transaction[];
  balance: number;
}
