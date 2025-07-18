// src/storage/storage.ts
import { MMKV } from 'react-native-mmkv';
import { Transaction } from '../types/transaction';

const storage = new MMKV();

// Anahtarlar
const CASH_KEY = 'cash';
const DEBT_KEY = 'debt';
const TRANSACTIONS_KEY = 'transactions';

export const getCash = (): number => {
  return storage.getNumber(CASH_KEY) || 0;
};

export const getDebt = (): number => {
  return storage.getNumber(DEBT_KEY) || 0;
};

export const getTransactions = (): Transaction[] => {
  const json = storage.getString(TRANSACTIONS_KEY);
  return json ? JSON.parse(json) : [];
};

export const saveTransaction = (transaction: Transaction) => {
  const current = getTransactions();
  const updated = [...current, transaction];
  storage.set(TRANSACTIONS_KEY, JSON.stringify(updated));
};

export const updateTransactionList = (list: Transaction[]) => {
  storage.set(TRANSACTIONS_KEY, JSON.stringify(list));
};

export const setCash = (amount: number) => {
  storage.set(CASH_KEY, amount);
};

export const setDebt = (amount: number) => {
  storage.set(DEBT_KEY, amount);
};
