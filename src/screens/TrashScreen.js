import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  Modal,
  TextInput
} from 'react-native';
import { Colors, Typography } from '../theme/theme';
import {
  ChevronLeft,
  Info,
  RefreshCw,
  Trash2,
  Trash,
  Square,
  Lock,
  Unlock,
  Users
} from 'lucide-react-native';
import { useNotes } from '../context/NoteContext';
import { useTheme } from '../theme/ThemeContext';

const TrashScreen = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const { trash, restoreFromTrash, emptyTrash, passcode } = useNotes();
  const [showPasscodeModal, setShowPasscodeModal] = useState(false);
  const [inputPasscode, setInputPasscode] = useState('');

  const handleEmptyTrash = () => {
    if (passcode) {
      setShowPasscodeModal(true);
    } else {
      confirmEmpty();
    }
  };

  const confirmEmpty = () => {
    Alert.alert(
      "Empty Trash?",
      "All items will be permanently deleted. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Empty", 
          style: "destructive", 
          onPress: () => {
            emptyTrash();
            Alert.alert("Success", "Trash has been emptied.");
          } 
        }
      ]
    );
  };

  const verifyAndEmpty = () => {
    if (inputPasscode === passcode) {
      setShowPasscodeModal(false);
      setInputPasscode('');
      confirmEmpty();
    } else {
      Alert.alert("Error", "Incorrect passcode.");
      setInputPasscode('');
    }
  };

  const totalItems = trash.workspaces.length + trash.notes.length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: isDark ? colors.card : colors.white, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Trash</Text>
        <TouchableOpacity onPress={handleEmptyTrash} disabled={totalItems === 0}>
          <Text style={[styles.emptyText, { color: totalItems === 0 ? colors.placeholder : colors.danger }]}>Empty</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.infoBox, { backgroundColor: colors.primary + '10' }]}>
          <Info size={20} color={colors.primary} style={{ marginRight: 15 }} />
          <Text style={[styles.infoText, { color: colors.text }]}>Deleted items will stay here until you empty the trash.</Text>
        </View>

        <View style={styles.selectionBar}>
          <Text style={[styles.itemCount, { color: colors.placeholder }]}>{totalItems} ITEMS</Text>
        </View>

        {totalItems === 0 ? (
          <View style={styles.emptyState}>
            <Trash size={60} color={colors.placeholder} strokeWidth={1} />
            <Text style={{ color: colors.placeholder, marginTop: 15, fontSize: 16 }}>Your trash is empty</Text>
          </View>
        ) : (
          <>
            {trash.workspaces.map(ws => (
              <View key={ws.id} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={[styles.iconPlaceholder, { backgroundColor: ws.color + '20' }]}>
                   <Users size={20} color={ws.color} />
                </View>
                <View style={styles.cardBody}>
                  <View style={styles.cardHeader}>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>{ws.name} (Workspace)</Text>
                    <View style={styles.actions}>
                      <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.background }]} onPress={() => restoreFromTrash(ws.id, 'workspace')}>
                        <RefreshCw size={18} color={colors.primary} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text style={[styles.deletedDate, { color: colors.primary }]}>Workspace with {ws.members.length} members</Text>
                </View>
              </View>
            ))}

            {trash.notes.map(note => (
              <View key={note.id} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={[styles.iconPlaceholder, { backgroundColor: colors.primary + '20' }]}>
                   <Trash2 size={20} color={colors.primary} />
                </View>
                <View style={styles.cardBody}>
                  <View style={styles.cardHeader}>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>{note.title}</Text>
                    <View style={styles.actions}>
                      <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.background }]} onPress={() => restoreFromTrash(note.id, 'note')}>
                        <RefreshCw size={18} color={colors.primary} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text style={[styles.deletedDate, { color: colors.placeholder }]}>Deleted Note</Text>
                  <Text style={[styles.snippet, { color: colors.textSecondary }]} numberOfLines={2}>{note.content}</Text>
                </View>
              </View>
            ))}
          </>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Passcode Modal for Empty Trash */}
      <Modal
        visible={showPasscodeModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.passcodeCard, { backgroundColor: colors.card }]}>
            <Lock size={40} color={colors.danger} style={{ alignSelf: 'center', marginBottom: 20 }} />
            <Text style={[styles.passcodeTitle, { color: colors.text }]}>Verification Required</Text>
            <Text style={[styles.passcodeSubtitle, { color: colors.textSecondary }]}>Enter your app passcode to permanently empty the trash.</Text>
            
            <TextInput
              style={[styles.passcodeInput, { color: colors.text, borderColor: colors.border }]}
              placeholder="Enter 4-digit code"
              placeholderTextColor={colors.placeholder}
              keyboardType="number-pad"
              maxLength={4}
              secureTextEntry
              value={inputPasscode}
              onChangeText={setInputPasscode}
              autoFocus
            />

            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setShowPasscodeModal(false)} style={styles.cancelLink}>
                <Text style={{ color: colors.placeholder }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.verifyBtn, { backgroundColor: colors.danger }]} onPress={verifyAndEmpty}>
                <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Verify & Empty</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
  },
  backButton: {
    padding: 5,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '700',
  },
  scrollContent: {
    padding: 20,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 15,
    marginBottom: 25,
  },
  infoText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  selectionBar: {
    marginBottom: 20,
    paddingHorizontal: 5,
    alignItems: 'center',
  },
  itemCount: {
    fontSize: 12,
    letterSpacing: 1,
    fontWeight: '800',
  },
  card: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
    borderWidth: 1,
  },
  iconPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  cardBody: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    borderRadius: 10,
  },
  deletedDate: {
    fontSize: 12,
    marginBottom: 8,
    fontWeight: '600',
  },
  snippet: {
    fontSize: 13,
    lineHeight: 18,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 30,
  },
  passcodeCard: {
    padding: 30,
    borderRadius: 30,
    elevation: 20,
  },
  passcodeTitle: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 10,
  },
  passcodeSubtitle: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 25,
  },
  passcodeInput: {
    height: 55,
    borderWidth: 1,
    borderRadius: 15,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 10,
    marginBottom: 25,
  },
  modalActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cancelLink: {
    padding: 10,
  },
  verifyBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  }
});

export default TrashScreen;

