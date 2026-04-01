import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemeProvider } from './src/theme/ThemeContext';
import { NoteProvider } from './src/context/NoteContext';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
  return (
    <NoteProvider>
      <ThemeProvider>
        <AppNavigator />
      </ThemeProvider>
    </NoteProvider>
  );
};

export default App;
