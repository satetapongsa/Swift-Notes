import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  SafeAreaView, 
  Switch, 
  ScrollView, 
  Dimensions 
} from 'react-native';
import { 
  FileText, 
  Folder, 
  Users, 
  Trash2, 
  Settings, 
  HelpCircle,
  LogOut,
  X
} from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const Sidebar = ({ navigation, onClose, currentRoute }) => {
  const { isDark, toggleTheme, colors, typography } = useTheme();

  const menuItems = [
    { label: 'All Notes', icon: <FileText size={22} />, route: 'Main' },
    { label: 'Folders', icon: <Folder size={22} />, route: 'Folders' },
    { label: 'Shared', icon: <Users size={22} />, route: 'Shared' },
    { label: 'Trash', icon: <Trash2 size={22} />, route: 'Trash' },
  ];

  const footerItems = [
    { label: 'Settings', icon: <Settings size={22} />, route: 'Settings' },
    { label: 'Help & Support', icon: <HelpCircle size={22} />, route: 'Help' },
  ];

  const handleNavigate = (route) => {
    onClose();
    if (route === 'Main') {
       navigation.navigate('Main', { screen: 'Notes' });
    } else {
       navigation.navigate(route);
    }
  };

  const styles = createStyles(colors, typography, isDark);

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200' }} 
            style={styles.avatar} 
          />
          <View style={styles.profileText}>
            <Text style={[styles.profileName, { color: colors.text }]}>Alex Johnson</Text>
            <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>alex.j@swiftnotes.io</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.drawerItems}>
          {menuItems.map((item) => {
            const isActive = currentRoute === item.route;
            return (
              <TouchableOpacity 
                key={item.label}
                onPress={() => handleNavigate(item.route)}
                style={[styles.item, isActive && { backgroundColor: isDark ? '#2C2C2E' : '#EBF5FF' }]}
              >
                <View style={[styles.iconContainer, isActive && styles.iconActive]}>
                  {React.cloneElement(item.icon, { color: isActive ? colors.primary : colors.textSecondary })}
                </View>
                <Text style={[styles.label, isActive ? { color: colors.primary, fontWeight: '700' } : { color: colors.textSecondary }]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {footerItems.map((item) => (
            <TouchableOpacity 
              key={item.label}
              onPress={() => handleNavigate(item.route)}
              style={styles.item}
            >
              <View style={styles.iconContainer}>
                {React.cloneElement(item.icon, { color: colors.textSecondary })}
              </View>
              <Text style={[styles.label, { color: colors.textSecondary }]}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <View style={styles.darkModeContainer}>
            <Text style={[styles.footerLabel, { color: colors.textSecondary }]}>Dark Mode</Text>
            <Switch 
              trackColor={{ false: '#767577', true: colors.primary }}
              thumbColor={colors.white}
              value={isDark}
              onValueChange={toggleTheme}
            />
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.replace('Login')}>
            <LogOut size={22} color={colors.danger} />
            <Text style={[styles.logoutText, { color: colors.danger }]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const createStyles = (colors, typography, isDark) => StyleSheet.create({
  container: {
    width: SCREEN_WIDTH * 0.8,
    height: '100%',
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 10, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  header: {
    padding: 24,
    paddingTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  profileText: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '800',
  },
  profileEmail: {
    fontSize: 13,
    marginTop: 2,
  },
  closeButton: {
    padding: 8,
  },
  drawerItems: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginBottom: 4,
  },
  iconContainer: {
    marginRight: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginVertical: 20,
    marginHorizontal: 10,
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
  },
  darkModeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  footerLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 15,
  },
});

export default Sidebar;
