import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Colors } from '../theme/theme';
import { FileText, Folder, Users, Settings as SettingsIcon } from 'lucide-react-native';

// Screens
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import FoldersScreen from '../screens/FoldersScreen';
import SharedScreen from '../screens/SharedScreen';
import SettingsScreen from '../screens/SettingsScreen';
import NoteEditorScreen from '../screens/NoteEditorScreen';
import AINoteScreen from '../screens/AINoteScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import PasscodeScreen from '../screens/PasscodeScreen';
import BiometricScreen from '../screens/BiometricScreen';
import TrashScreen from '../screens/TrashScreen';
import AddFolderScreen from '../screens/AddFolderScreen';
import FolderDetailScreen from '../screens/FolderDetailScreen';
import WorkspaceDetailScreen from '../screens/WorkspaceDetailScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

import { useTheme } from '../theme/ThemeContext';

const TabNavigator = () => {
  const { colors, isDark } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Notes') return <FileText size={size} color={color} />;
          if (route.name === 'Folders') return <Folder size={size} color={color} />;
          if (route.name === 'Shared') return <Users size={size} color={color} />;
          if (route.name === 'Settings') return <SettingsIcon size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          height: 80,
          paddingBottom: 25,
          paddingTop: 10,
          backgroundColor: isDark ? colors.card : colors.white,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          textTransform: 'uppercase',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Notes" component={DashboardScreen} />
      <Tab.Screen name="Folders" component={FoldersScreen} />
      <Tab.Screen name="Shared" component={SharedScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Biometric" component={BiometricScreen} />
        <Stack.Screen name="Passcode" component={PasscodeScreen} />
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen name="Editor" component={NoteEditorScreen} />
        <Stack.Screen name="AINote" component={AINoteScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="AddFolder" component={AddFolderScreen} />
        <Stack.Screen name="FolderDetail" component={FolderDetailScreen} />
        <Stack.Screen name="WorkspaceDetail" component={WorkspaceDetailScreen} />
        <Stack.Screen name="Trash" component={TrashScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
