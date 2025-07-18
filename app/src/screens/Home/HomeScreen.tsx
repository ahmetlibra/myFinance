import React, { useCallback, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Card, FAB } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { getAllTransactions } from '../../storage/transactionStorage';

type Transaction = {
  id: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
  description?: string;
};

const HomeScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [cash, setCash] = useState<number>(0);
  const [debt, setDebt] = useState<number>(0);

  // Sayfa her göründüğünde verileri yükle
  useFocusEffect(
    useCallback(() => {
      const loadTransactions = async () => {
        const data = await getAllTransactions();
        setTransactions(data);

        // Kasa ve borç hesapla
        let total = 0;
        let debtSum = 0;

        data.forEach((tx: Transaction) => {
          if (tx.type === 'income') {
            total += tx.amount;
          } else {
            total -= tx.amount;
            if (total < 0) {
              debtSum += Math.abs(total);
              total = 0;
            }
          }
        });

        setCash(total);
        setDebt(debtSum);
      };

      loadTransactions();
    }, []),
  );

  const renderItem = ({ item }: { item: Transaction }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate('TransactionDetail', { id: item.id })}
    >
      <Card.Content>
        <Text
          style={{
            color: item.type === 'income' ? 'green' : 'red',
            fontWeight: 'bold',
          }}
        >
          {item.type === 'income' ? '+' : '-'} {item.amount}₺
        </Text>
        <Text>{item.date}</Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>💸 Self Finance</Text>

      <Card style={styles.summaryCard}>
        <Card.Content>
          <Text style={{ fontSize: 16 }}>Kasa: {cash}₺</Text>
          <Text style={{ fontSize: 16, color: 'blue' }}>Borç: {debt}₺</Text>
        </Card.Content>
      </Card>

      <Text style={styles.sectionTitle}>Son İşlemler</Text>

      <FlatList
        data={transactions}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={{ marginTop: 20 }}>Henüz işlem yok.</Text>
        }
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddTransaction')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  summaryCard: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, marginBottom: 10 },
  card: { marginBottom: 10 },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#6200ee',
  },
});

export default HomeScreen;
