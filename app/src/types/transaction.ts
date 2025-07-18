// src/types/transaction.ts
export type Transaction = {
  id: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
  description?: string;
};
