import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  Animated
} from 'react-native';
import { Colors, Typography } from '../theme/theme';
import { Lock, X, Delete } from 'lucide-react-native';
import { useNotes } from '../context/NoteContext';
import { useTheme } from '../theme/ThemeContext';

const PasscodeScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const { setPasscode: setGlobalPasscode, setPasslockEnabled } = useNotes();
  const [localPasscode, setLocalPasscode] = useState([]);
  
  const handlePress = (num) => {
    if (localPasscode.length < 4) {
      const newPasscode = [...localPasscode, num];
      setLocalPasscode(newPasscode);
      if (newPasscode.length === 4) {
        // Save to global context
        const passcodeStr = newPasscode.join('');
        setGlobalPasscode(passcodeStr);
        setPasslockEnabled(true);
        
        // Success animation or feedback could go here
        setTimeout(() => {
          navigation.goBack(); // Return to settings correctly
        }, 400);
      }
    }
  };

  const handleDelete = () => {
    setLocalPasscode(localPasscode.slice(0, -1));
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <X size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Set Passcode</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.cancelText, { color: colors.primary }]}>Cancel</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Create a passcode</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Enter a 4-digit passcode to secure your account and personal data.</Text>

        <View style={styles.dotsContainer}>
          {[1, 2, 3, 4].map((_, i) => (
            <View 
              key={i} 
              style={[
                styles.dot, 
                { borderColor: colors.border },
                localPasscode.length > i && { backgroundColor: colors.primary, borderColor: colors.primary }
              ]} 
            />
          ))}
        </View>

        <View style={styles.lockIconContainer}>
          <View style={[styles.lockCircle, { backgroundColor: colors.primary + '15' }]}>
            <Lock size={40} color={colors.primary} />
          </View>
        </View>
      </View>

      <View style={styles.keypad}>
        {[
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
          ['', 0, 'delete']
        ].map((row, rowIndex) => (
          <View key={rowIndex} style={styles.keypadRow}>
            {row.map((item, colIndex) => (
              <TouchableOpacity 
                key={colIndex} 
                style={styles.key}
                onPress={() => item === 'delete' ? handleDelete() : item !== '' && handlePress(item)}
              >
                {item === 'delete' ? (
                  <Delete size={28} color={colors.text} />
                ) : (
                  <Text style={[styles.keyText, { color: colors.text }]}>{item}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 10,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 30,
    lineHeight: 22,
  },
  dotsContainer: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    marginHorizontal: 12,
  },
  lockIconContainer: {
    marginBottom: 30,
  },
  lockCircle: {
    width: 100,
    height: 100,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keypad: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    paddingHorizontal: 20,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  key: {
    width: '30%',
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyText: {
    fontSize: 32,
    fontWeight: '600',
  },
});

export default PasscodeScreen;

