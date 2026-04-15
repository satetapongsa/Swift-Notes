import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  FlatList,
  StatusBar,
  Modal,
  TextInput,
  Dimensions
} from 'react-native';
import { 
  ChevronLeft, 
  FileText, 
  Plus, 
  Share2, 
  MoreVertical, 
  Users,
  Search,
  X,
  Check
} from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { useNotes } from '../context/NoteContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const WorkspaceDetailScreen = ({ route, navigation }) => {
  const { workspace: workspaceParam, id } = route.params || {};
  const { colors, isDark } = useTheme();
  const { workspaces, notes, updateNote, addNote } = useNotes();
  
  // Find workspace by ID if it's coming from a deep link
  const workspace = workspaceParam || workspaces.find(ws => ws.id === id);

  if (!workspace) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.text }}>Workspace not found</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Main')}>
          <Text style={{ color: colors.primary, marginTop: 10 }}>Go back Home</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
  
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter notes belonging to this workspace
  const workspaceNotes = notes.filter(note => note.workspaceId === workspace.id);

  // Filter notes NOT in this workspace to add them
  const availableNotes = notes.filter(note => note.workspaceId !== workspace.id && 
    (note.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
     note.content?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddExistingNote = (noteId) => {
    updateNote(noteId, { workspaceId: workspace.id });
    setShowAddNoteModal(false);
  };

  const renderNoteItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.noteCard, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={() => navigation.navigate('Editor', { note: item, workspace })}
    >
      <View style={[styles.noteIcon, { backgroundColor: workspace.color + '15' }]}>
        <FileText size={22} color={workspace.color} />
      </View>
      <View style={styles.noteInfo}>
        <Text style={[styles.noteTitle, { color: colors.text }]} numberOfLines={1}>{item.title || 'Untitled Note'}</Text>
        <Text style={[styles.noteSnippet, { color: colors.textSecondary }]} numberOfLines={1}>{item.content || 'No content'}</Text>
      </View>
      <View style={styles.noteMeta}>
         <View style={styles.avatarStack}>
            {workspace.members.slice(0, 2).map((member, idx) => (
              <View 
                key={member.id} 
                style={[
                  styles.stackAvatar, 
                  { backgroundColor: member.avatar, left: -idx * 10, borderColor: colors.card }
                ]}
              >
                <Text style={styles.stackAvatarText}>{member.name[0]}</Text>
              </View>
            ))}
         </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft size={28} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.workspaceHeaderInfo}>
           <Text style={[styles.workspaceName, { color: colors.text }]}>{workspace.name}</Text>
           <View style={styles.memberRow}>
              <Users size={14} color={colors.primary} />
              <Text style={[styles.memberCount, { color: colors.textSecondary }]}>{workspace.members.length} collaborators</Text>
           </View>
        </View>
        <TouchableOpacity style={[styles.headerIcon, { backgroundColor: colors.primary + '20' }]}>
           <Share2 size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.sectionTitleRow}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Collaborative Notes</Text>
          <TouchableOpacity 
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            onPress={() => setShowAddNoteModal(true)}
          >
            <Plus size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={workspaceNotes}
          keyExtractor={item => item.id.toString()}
          renderItem={renderNoteItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <FileText size={64} color={colors.placeholder} opacity={0.3} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No shared notes yet</Text>
              <Text style={[styles.emptySub, { color: colors.placeholder }]}>Add existing notes or create new ones to collaborate.</Text>
            </View>
          }
        />
      </View>

      {/* Add Note Modal */}
      <Modal visible={showAddNoteModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
           <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
              <View style={styles.modalHeader}>
                 <Text style={[styles.modalTitle, { color: colors.text }]}>Add Existing Note</Text>
                 <TouchableOpacity onPress={() => setShowAddNoteModal(false)}>
                    <X size={24} color={colors.text} />
                 </TouchableOpacity>
              </View>

              <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
                 <Search size={20} color={colors.placeholder} />
                 <TextInput
                   style={[styles.searchInput, { color: colors.text }]}
                   placeholder="Search your notes..."
                   placeholderTextColor={colors.placeholder}
                   value={searchQuery}
                   onChangeText={setSearchQuery}
                 />
              </View>

              <FlatList
                data={availableNotes}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={[styles.availableNoteItem, { borderBottomColor: colors.border }]}
                    onPress={() => handleAddExistingNote(item.id)}
                  >
                    <View style={styles.availableNoteInfo}>
                       <Text style={[styles.availableNoteTitle, { color: colors.text }]}>{item.title || 'Untitled'}</Text>
                       <Text style={[styles.availableNoteSnippet, { color: colors.textSecondary }]} numberOfLines={1}>{item.content}</Text>
                    </View>
                    <Plus size={20} color={colors.primary} />
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <Text style={{ textAlign: 'center', marginTop: 40, color: colors.placeholder }}>No more notes available</Text>
                }
              />

              <TouchableOpacity 
                style={[styles.createNewBtn, { backgroundColor: colors.primary }]}
                onPress={() => {
                  const newNote = addNote({ title: 'New Shared Note', content: '', workspaceId: workspace.id });
                  setShowAddNoteModal(false);
                  navigation.navigate('Editor', { note: newNote, workspace });
                }}
              >
                 <Text style={styles.createNewBtnText}>Create New Collaborative Note</Text>
              </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  workspaceHeaderInfo: {
    flex: 1,
    marginLeft: 15,
  },
  workspaceName: {
    fontSize: 20,
    fontWeight: '800',
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  memberCount: {
    fontSize: 13,
    marginLeft: 6,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  list: {
    paddingBottom: 40,
  },
  noteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 24,
    marginBottom: 15,
    borderWidth: 1,
  },
  noteIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  noteInfo: {
    flex: 1,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  noteSnippet: {
    fontSize: 13,
  },
  noteMeta: {
    justifyContent: 'center',
  },
  avatarStack: {
    flexDirection: 'row',
    height: 24,
    width: 40,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  stackAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  stackAvatarText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 15,
  },
  emptySub: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: '80%',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 50,
    borderRadius: 15,
    borderWidth: 1,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  availableNoteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  availableNoteInfo: {
    flex: 1,
  },
  availableNoteTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  availableNoteSnippet: {
    fontSize: 13,
  },
  createNewBtn: {
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 15,
  },
  createNewBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  }
});

export default WorkspaceDetailScreen;
