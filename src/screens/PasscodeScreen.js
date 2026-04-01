import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Colors, Typography } from '../theme/theme';
import { Lock, X, Delete } from 'lucide-react-native';

const PasscodeScreen = ({ navigation }) => {
  const [passcode, setPasscode] = useState([]);
  
  const handlePress = (num) => {
    if (passcode.length < 4) {
      const newPasscode = [...passcode, num];
      setPasscode(newPasscode);
      if (newPasscode.length === 4) {
        // Logic to verify or set passcode
        setTimeout(() => navigation.replace('Main'), 300);
      }
    }
  };

  const handleDelete = () => {
    setPasscode(passcode.slice(0, -1));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <X size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Set Passcode</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Create a passcode</Text>
        <Text style={styles.subtitle}>Enter a 4-digit passcode to secure your account and personal data.</Text>

        <View style={styles.dotsContainer}>
          {[1, 2, 3, 4].map((_, i) => (
            <View 
              key={i} 
              style={[
                styles.dot, 
                passcode.length > i && styles.dotActive
              ]} 
            />
          ))}
        </View>

        <View style={styles.lockIconContainer}>
          <View style={styles.lockCircle}>
            <Lock size={40} color={Colors.primary} />
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
                  <Delete size={24} color={Colors.text} />
                ) : (
                  <Text style={styles.keyText}>{item}</Text>
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
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    ...Typography.h2,
    fontSize: 18,
    fontWeight: '800',
  },
  cancelText: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '600',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: 40,
  },
  title: {
    ...Typography.h1,
    fontSize: 28,
    marginBottom: 10,
  },
  subtitle: {
    ...Typography.body,
    textAlign: 'center',
    color: Colors.textSecondary,
    marginBottom: 30,
    lineHeight: 22,
  },
  dotsContainer: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#E5E5EA',
    marginHorizontal: 10,
  },
  dotActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  lockIconContainer: {
    marginBottom: 30,
  },
  lockCircle: {
    width: 100,
    height: 100,
    borderRadius: 25,
    backgroundColor: '#EBF5FF',
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
    marginBottom: 10,
  },
  key: {
    width: '30%',
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyText: {
    ...Typography.h1,
    fontSize: 28,
    fontWeight: '500',
  },
});

export default PasscodeScreen;
