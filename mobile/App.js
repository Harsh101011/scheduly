import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SocketProvider } from './src/context/SocketContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SocketProvider>
      <StatusBar style="light" />
      <AppNavigator />
    </SocketProvider>
  );
}
