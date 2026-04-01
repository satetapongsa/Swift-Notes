import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Colors, Typography } from '../theme/theme';
import { StickyNote } from 'lucide-react-native';

const SplashScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: false,
      })
    ]).start(() => {
      navigation.replace('Login');
    });
  }, []);

  const progressInterpolate = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <StickyNote size={64} color={Colors.white} />
          </View>
          <Text style={styles.appName}>SwiftNotes</Text>
          <Text style={styles.tagline}>Smart capture, effortless recall</Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.progressBar}>
            <Animated.View style={[styles.progressFill, { width: progressInterpolate }]} />
          </View>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    marginBottom: 100,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  logoBox: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
  },
  penIcon: {
      position: 'absolute',
      bottom: -10,
      right: -10,
  },
  title: {
    ...Typography.h1,
    fontSize: 42,
    marginTop: 10,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: 10,
    fontSize: 18,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    width: '80%',
    alignItems: 'center',
  },
  preparingText: {
    ...Typography.caption,
    fontSize: 14,
    marginBottom: 10,
  },
  dots: {
      color: Colors.primary,
  },
  progressTrack: {
    width: '100%',
    height: 4,
    backgroundColor: Colors.lightGray,
    borderRadius: 2,
    marginBottom: 20,
    overflow: 'hidden',
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  securedText: {
    ...Typography.small,
    letterSpacing: 2,
    fontWeight: '600',
    color: Colors.placeholder,
  },
});

export default SplashScreen;
