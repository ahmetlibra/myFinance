import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/Home/HomeScreen';
import AddTransactionScreen from '../screens/AddTransaction/AddTransactionScreen';
import TransactionDetailScreen from '../screens/TransactionDetail/TransactionDetailScreen';
import EditTransactionScreen from '../screens/EditTransaction/EditTransactionScreen';

export type RootStackParamList = {
  Home: undefined;
  AddTransaction: undefined;
  TransactionDetail: { id: string };
  EditTransaction: { id: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => (
  <Stack.Navigator initialRouteName="Home">
    <Stack.Screen
      name="Home"
      component={HomeScreen}
      options={{ title: 'Self Finance' }}
    />
    <Stack.Screen
      name="AddTransaction"
      component={AddTransactionScreen}
      options={{ title: 'Yeni İşlem' }}
    />
    <Stack.Screen
      name="TransactionDetail"
      component={TransactionDetailScreen}
      options={{ title: 'İşlem Detayı' }}
    />
    <Stack.Screen
      name="EditTransaction"
      component={EditTransactionScreen}
      options={{ title: 'İşlem Düzenle' }}
    />
  </Stack.Navigator>
);

export default AppNavigator;
