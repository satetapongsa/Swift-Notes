import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from './src/theme/ThemeContext';
import { NoteProvider } from './src/context/NoteContext';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NoteProvider>
        <ThemeProvider>
          <AppNavigator />
        </ThemeProvider>
      </NoteProvider>
    </GestureHandlerRootView>
  );
};

export default App;
