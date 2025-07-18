import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV();
const TRANSACTIONS_KEY = 'transactions';

export const getAllTransactions = async () => {
  const data = storage.getString(TRANSACTIONS_KEY);
  return data ? JSON.parse(data) : [];
};

