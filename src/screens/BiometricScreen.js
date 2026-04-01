import React, { useEffect, useRef } from 'react';
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
import { Fingerprint } from 'lucide-react-native';

const BiometricScreen = ({ navigation }) => {
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        })
      ])
    ).start();
  }, []);

  const scale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 1],
  });

  const opacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 0.1],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.content}>
        <Text style={styles.title}>SwiftNotes Locked</Text>
        <Text style={styles.subtitle}>Secure access required</Text>

        <View style={styles.biometricContainer}>
          <Animated.View 
            style={[
              styles.pulseCircle, 
              { 
                transform: [{ scale }],
                opacity
              }
            ]} 
          />
          <View style={styles.concentricCircle1} />
          <View style={styles.concentricCircle2} />
          <TouchableOpacity style={styles.mainCircle} onPress={() => navigation.replace('Main')}>
            <Fingerprint size={60} color={Colors.white} />
          </TouchableOpacity>
        </View>

        <Text style={styles.instruction}>Touch the sensor to unlock SwiftNotes</Text>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.passcodeButton} onPress={() => navigation.navigate('Passcode')}>
            <Text style={styles.passcodeButtonText}>Use Passcode</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  title: {
    ...Typography.h1,
    fontSize: 34,
    marginBottom: 10,
    fontWeight: '800',
  },
  subtitle: {
    ...Typography.body,
    fontSize: 18,
    color: Colors.textSecondary,
    marginBottom: 60,
  },
  biometricContainer: {
    width: 260,
    height: 260,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  pulseCircle: {
      position: 'absolute',
      width: 240,
      height: 240,
      borderRadius: 120,
      backgroundColor: '#EBF5FF',
  },
  concentricCircle1: {
      position: 'absolute',
      width: 220,
      height: 220,
      borderRadius: 110,
      borderWidth: 1,
      borderColor: '#EBF5FF',
  },
  concentricCircle2: {
      position: 'absolute',
      width: 180,
      height: 180,
      borderRadius: 90,
      borderWidth: 1,
      borderColor: '#D1E8FF',
  },
  mainCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  instruction: {
    ...Typography.body,
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 100,
  },
  footer: {
    width: '100%',
    alignItems: 'center',
  },
  passcodeButton: {
    width: '100%',
    height: 60,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  passcodeButtonText: {
    ...Typography.title,
    color: Colors.white,
    fontWeight: '700',
  },
  cancelButton: {
    paddingVertical: 10,
  },
  cancelText: {
    ...Typography.body,
    color: Colors.textSecondary,
    fontWeight: '600',
    fontSize: 16,
  },
});

export default BiometricScreen;
