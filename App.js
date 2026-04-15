import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/theme/ThemeContext';
import { NoteProvider } from './src/context/NoteContext';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NoteProvider>
          <ThemeProvider>
            <AppNavigator />
          </ThemeProvider>
        </NoteProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default App;


