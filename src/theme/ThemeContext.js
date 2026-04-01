import React, { createContext, useState, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { LightColors, DarkColors, Typography } from './theme';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemScheme === 'dark');

  const toggleTheme = () => setIsDark(!isDark);

  const colors = isDark ? DarkColors : LightColors;
  
  // Custom Typography using current theme colors
  const typography = useMemo(() => {
    return {
      h1: { ...Typography.h1, color: colors.text },
      h2: { ...Typography.h2, color: colors.text },
      title: { ...Typography.title, color: colors.text },
      body: { ...Typography.body, color: colors.text },
      caption: { ...Typography.caption, color: colors.textSecondary },
      small: { ...Typography.small, color: colors.textSecondary },
    };
  }, [colors]);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, colors, typography }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
