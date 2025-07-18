import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

import { getTransactions } from '../../storage/storage';
import { Transaction } from '../../types/transaction';

import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../navigation/AppNavigator';

//type DetailRouteProp = RouteProp<RootStackParamList, 'TransactionDetail'>;

const TransactionDetailScreen = () => {

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
const route = useRoute<RouteProp<RootStackParamList, 'TransactionDetail'>>();

  const { id } = route.params;

  const transaction: Transaction | undefined = getTransactions().find(t => t.id === id);

  if (!transaction) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>İşlem bulunamadı</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Açıklama:</Text>
      <Text style={styles.value}>{transaction.description}</Text>

      <Text style={styles.label}>Tutar:</Text>
      <Text style={styles.value}>{transaction.amount} ₺</Text>

      <Text style={styles.label}>Tür:</Text>
      <Text style={styles.value}>{transaction.type === 'income' ? 'Gelir' : 'Gider'}</Text>

      <Text style={styles.label}>Tarih:</Text>
      <Text style={styles.value}>{new Date(transaction.date).toLocaleDateString()}</Text>

      <Button
        title="Düzenle"
        onPress={() => navigation.navigate('EditTransaction', { id })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 12,
    fontSize: 16,
  },
  value: {
    fontSize: 16,
  },
  error: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 32,
  },
});

export default TransactionDetailScreen;
