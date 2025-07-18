import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, RadioButton } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import uuid from 'react-native-uuid';
import { format } from 'date-fns';

import {
  saveTransaction,
  getCash,
  getDebt,
  setCash,
  setDebt,
} from '../../storage/storage';
import { Transaction } from '../../types/transaction';

const AddTransactionScreen = () => {
  const navigation = useNavigation();

  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (_: any, selectedDate?: Date) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
    setShowDatePicker(false);
  };

  const handleSave = () => {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    const id = uuid.v4().toString();
    const transaction: Transaction = {
      id,
      amount: parsedAmount,
      type,
      date: format(date, 'yyyy-MM-dd'),
      description: type === 'expense' && getCash() < parsedAmount
        ? `BORÇ: ${description || ''}`
        : description,
    };

    // Kasa ve borç işlemleri
    let newCash = getCash();
    let newDebt = getDebt();

    if (type === 'income') {
      newCash += parsedAmount;
    } else {
      if (newCash >= parsedAmount) {
        newCash -= parsedAmount;
      } else {
        const debtAmount = parsedAmount - newCash;
        newCash = 0;
        newDebt += debtAmount;
      }
    }

    setCash(newCash);
    setDebt(newDebt);
    saveTransaction(transaction);

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text variant="titleLarge">Yeni İşlem</Text>

      <TextInput
        label="Miktar (₺)"
        value={amount}
        keyboardType="numeric"
        onChangeText={setAmount}
        style={styles.input}
      />

      <TextInput
        label="Açıklama"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />

      <RadioButton.Group onValueChange={(value) => setType(value as any)} value={type}>
        <View style={styles.radioRow}>
          <RadioButton value="income" />
          <Text>Gelir</Text>
          <RadioButton value="expense" />
          <Text>Gider</Text>
        </View>
      </RadioButton.Group>

      <Button mode="outlined" onPress={() => setShowDatePicker(true)}>
        Tarih Seç: {format(date, 'yyyy-MM-dd')}
      </Button>
      {showDatePicker && (
        <DateTimePicker value={date} mode="date" display="default" onChange={handleDateChange} />
      )}

      <Button mode="contained" onPress={handleSave} style={styles.saveButton}>
        Kaydet
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  input: { marginBottom: 12 },
  saveButton: { marginTop: 24 },
  radioRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 12 },
});

export default AddTransactionScreen;
