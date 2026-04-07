import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
  SafeAreaView,
  StatusBar,
  Alert
} from 'react-native';
import {
  ChevronLeft,
  User,
  Sun,
  Bell,
  Shield,
  Lock,
  Fingerprint,
  ChevronRight,
  Pencil,
  LogOut,
  Trash2
} from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { useNotes } from '../context/NoteContext';

const SettingsScreen = ({ navigation }) => {
  const { isDark, toggleTheme, colors, typography } = useTheme();
  const { trash, passlockEnabled, setPasslockEnabled } = useNotes();
  const [faceIdEnabled, setFaceIdEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => navigation.replace('Login')
        }
      ]
    );
  };

  const SettingItem = ({ icon, label, value, onPress, badge, showSwitch, switchValue, onSwitchChange }) => (
    <TouchableOpacity
      style={[styles.settingItem, { borderBottomColor: colors.border }]}
      onPress={onPress}
      disabled={showSwitch}
    >
      <View style={[styles.settingIconContainer, { backgroundColor: isDark ? colors.lightGray : '#F8F9FA' }]}>
        {icon}
      </View>
      <Text style={[styles.settingLabel, { color: colors.text }]}>{label}</Text>
      <View style={styles.settingContent}>
        {value && <Text style={[styles.settingValue, { color: colors.textSecondary }]}>{value}</Text>}
        {badge && <View style={styles.badge}><Text style={styles.badgeText}>{badge}</Text></View>}
        {showSwitch ? (
          <Switch
            value={switchValue}
            onValueChange={onSwitchChange}
            trackColor={{ false: '#767577', true: colors.primary }}
            thumbColor={colors.white}
          />
        ) : (
          <ChevronRight size={20} color={colors.placeholder} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backButton, { backgroundColor: colors.lightGray }]}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200' }}
              style={styles.avatar}
            />
            <TouchableOpacity style={[styles.editIconContainer, { backgroundColor: colors.primary }]}>
              <Pencil size={12} color={colors.white} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.profileName, { color: colors.text }]}>Alex Johnson</Text>
          <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>alex.johnson@example.com</Text>
        </View>

        {/* Account & Preference */}
        <View style={styles.section}>
          <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>ACCOUNT & PREFERENCE</Text>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <SettingItem
              icon={<User size={20} color={colors.primary} />}
              label="Personal Information"
            />
            <View style={[styles.line, { backgroundColor: colors.border }]} />
            <SettingItem
              icon={<Sun size={20} color={colors.warning} />}
              label="Dark Mode"
              showSwitch={true}
              switchValue={isDark}
              onSwitchChange={toggleTheme}
            />
            <View style={[styles.line, { backgroundColor: colors.border }]} />
            <SettingItem
              icon={<Bell size={20} color={colors.danger} />}
              label="Notifications"
            />
          </View>
        </View>

        {/* Security & Privacy */}
        <View style={styles.section}>
          <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>SECURITY & PRIVACY</Text>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <SettingItem
              icon={<Shield size={20} color={colors.primary} />}
              label="Security Center"
            />
            <View style={[styles.line, { backgroundColor: colors.border }]} />
            <SettingItem
              icon={<Lock size={20} color={colors.textSecondary} />}
              label="Passcode Lock"
              showSwitch={true}
              switchValue={passlockEnabled}
              onSwitchChange={(val) => {
                setPasslockEnabled(val);
                if (val) navigation.navigate('Passcode');
              }}
            />
            <View style={[styles.line, { backgroundColor: colors.border }]} />
            <SettingItem
              icon={<Fingerprint size={20} color={colors.success} />}
              label="FaceID Authentication"
              showSwitch={true}
              switchValue={faceIdEnabled}
              onSwitchChange={(val) => {
                setFaceIdEnabled(val);
                if (val) navigation.navigate('Biometric');
              }}
            />
          </View>
        </View>

        {/* Trash & Cleanup */}
        <View style={styles.section}>
          <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>STORAGE & CLEANUP</Text>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <SettingItem
              icon={<Trash2 size={20} color={colors.danger} />}
              label="Trash Bin"
              value={trash.workspaces.length + trash.notes.length > 0 ? `${trash.workspaces.length + trash.notes.length} total items` : "Clean"}
              onPress={() => navigation.navigate('Trash')}
            />
          </View>
        </View>

        <TouchableOpacity style={[styles.logoutButton, { backgroundColor: isDark ? '#2C1212' : '#FFF1F0' }]} onPress={handleLogout}>
          <LogOut size={22} color={colors.danger} />
          <Text style={[styles.logoutText, { color: colors.danger }]}>Logout from Device</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>
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
    fontSize: 22,
    fontWeight: '800',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#FFEFEF',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    padding: 8,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  profileName: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    fontSize: 12,
    letterSpacing: 1,
    fontWeight: '700',
    marginBottom: 12,
    marginLeft: 5,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 14,
    marginRight: 10,
  },
  line: {
    height: 1,
    marginHorizontal: 15,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    padding: 15,
    borderRadius: 15,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 12,
  },
});

export default SettingsScreen;
