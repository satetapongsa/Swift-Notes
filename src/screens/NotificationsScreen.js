import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Switch, 
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Colors, Typography } from '../theme/theme';
import { 
  ChevronLeft, 
  Bell, 
  Calendar, 
  Users, 
  FileText 
} from 'lucide-react-native';

const NotificationsScreen = ({ navigation }) => {
  const [masterToggle, setMasterToggle] = useState(true);
  const [reminders, setReminders] = useState(true);
  const [sharedUpdates, setSharedUpdates] = useState(true);
  const [summaries, setSummaries] = useState(false);

  const NotificationType = ({ icon, label, description, value, onToggle }) => (
    <View style={styles.item}>
      <View style={styles.iconBox}>
        {icon}
      </View>
      <View style={styles.content}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <Switch 
        value={value} 
        onValueChange={onToggle}
        trackColor={{ false: '#767577', true: Colors.primary }}
        thumbColor={Colors.white}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>PUSH NOTIFICATIONS</Text>
        <View style={styles.card}>
          <View style={styles.item}>
            <View style={[styles.iconBox, { backgroundColor: '#EBF5FF' }]}>
              <Bell size={22} color={Colors.primary} />
            </View>
            <View style={styles.content}>
              <Text style={styles.label}>Master Toggle</Text>
              <Text style={styles.description}>Enable or disable all push notifications</Text>
            </View>
            <Switch 
              value={masterToggle} 
              onValueChange={setMasterToggle}
              trackColor={{ false: '#767577', true: Colors.primary }}
              thumbColor={Colors.white}
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>NOTIFICATION TYPES</Text>
        <View style={styles.card}>
          <NotificationType 
            icon={<Calendar size={22} color={Colors.textSecondary} />}
            label="Reminders"
            description="Don't miss deadlines for your notes"
            value={reminders}
            onToggle={setReminders}
          />
          <View style={styles.line} />
          <NotificationType 
            icon={<Users size={22} color={Colors.textSecondary} />}
            label="Shared Note Updates"
            description="Know when collaborators edit a note"
            value={sharedUpdates}
            onToggle={setSharedUpdates}
          />
          <View style={styles.line} />
          <NotificationType 
            icon={<FileText size={22} color={Colors.textSecondary} />}
            label="Weekly Summaries"
            description="A digest of your activity each week"
            value={summaries}
            onToggle={setSummaries}
          />
        </View>

        <Text style={styles.footerText}>
          Manage detailed notification permissions in your{' '}
          <Text style={styles.linkText}>System Settings</Text>.
        </Text>
        
        <View style={{ height: 100 }} />
      </ScrollView>
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
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  headerTitle: {
    ...Typography.h2,
    fontSize: 20,
    fontWeight: '800',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 20,
  },
  sectionTitle: {
    ...Typography.small,
    letterSpacing: 1,
    color: Colors.primary,
    fontWeight: '800',
    marginBottom: 15,
    marginTop: 10,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#F2F2F7',
    marginBottom: 30,
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  content: {
    flex: 1,
  },
  label: {
    ...Typography.title,
    fontSize: 18,
    marginBottom: 4,
  },
  description: {
    ...Typography.small,
    color: Colors.textSecondary,
    fontSize: 13,
  },
  line: {
    height: 1,
    backgroundColor: '#F2F2F7',
    marginHorizontal: 20,
  },
  footerText: {
    ...Typography.body,
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 20,
    paddingHorizontal: 30,
  },
  linkText: {
    color: Colors.primary,
    fontWeight: '700',
  },
});

export default NotificationsScreen;
