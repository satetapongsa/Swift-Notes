import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions
} from 'react-native';
import { 
  ChevronLeft, 
  UserPlus, 
  List, 
  Image as ImageIcon, 
  PenTool, 
  Mic, 
  Sparkles,
  Share2
} from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { useNotes } from '../context/NoteContext';

const NoteEditorScreen = ({ route, navigation }) => {
  const { note, folderId, workspace } = route.params || {};
  const { colors, typography, isDark } = useTheme();
  const { addNote, updateNote } = useNotes();
  
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [currentNoteId, setCurrentNoteId] = useState(note?.id || null);

  const isInitialMount = useRef(true);

  // Auto-save logic
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const timer = setTimeout(() => {
      if (currentNoteId) {
        updateNote(currentNoteId, { title, content });
      } else if (title.trim() || content.trim()) {
        const newNote = addNote({
          title,
          content,
          folderId: folderId || 'default',
          workspaceId: workspace?.id || null,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        });
        setCurrentNoteId(newNote.id);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [title, content]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backButton, { backgroundColor: colors.lightGray }]}>
            <ChevronLeft size={24} color={colors.text} />
          </TouchableOpacity>
          
          {workspace && (
            <View style={styles.collaborationInfo}>
               <View style={[styles.workspaceDot, { backgroundColor: workspace.color }]} />
               <Text style={[styles.workspaceNameText, { color: colors.textSecondary }]} numberOfLines={1}>{workspace.name}</Text>
            </View>
          )}
        </View>

        <View style={styles.headerRight}>
          {workspace && (
            <View style={styles.activeMembers}>
               {workspace.members.slice(0, 3).map((member, i) => (
                 <View key={member.id} style={[styles.activeAvatar, { backgroundColor: member.avatar, marginLeft: i === 0 ? 0 : -8, borderColor: colors.card }]}>
                    <Text style={styles.activeAvatarText}>{member.name[0]}</Text>
                 </View>
               ))}
               {workspace.members.length > 3 && (
                 <View style={[styles.activeAvatar, { backgroundColor: colors.placeholder, marginLeft: -8, borderColor: colors.card }]}>
                    <Text style={styles.activeAvatarText}>+{workspace.members.length - 3}</Text>
                 </View>
               )}
            </View>
          )}
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={[styles.saveText, { color: colors.primary }]}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Toolbar */}
      <View style={[styles.toolbar, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.toolbarItem}>
          <UserPlus size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolbarItem}>
          <List size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolbarItem}>
          <ImageIcon size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolbarItem}>
          <PenTool size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.aiButton, { backgroundColor: colors.primary }]} onPress={() => navigation.navigate('AINote', { title, content })}>
          <Sparkles size={18} color={colors.white} />
          <Text style={styles.aiButtonText}>AI Assistant</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.editorContainer}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <TextInput
            style={[styles.titleInput, { color: colors.text }]}
            placeholder="Note Title"
            placeholderTextColor={colors.placeholder}
            value={title}
            onChangeText={setTitle}
            multiline
            placeholderStyle={{ fontWeight: '300' }}
          />
          <TextInput
            style={[styles.contentInput, { color: colors.textSecondary }]}
            placeholder="Write something in English or ภาษาไทย..."
            placeholderTextColor={colors.placeholder}
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
          />
        </ScrollView>
      </KeyboardAvoidingView>
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
    fontSize: 20,
    fontWeight: '800',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  collaborationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    maxWidth: 150,
  },
  workspaceDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  workspaceNameText: {
    fontSize: 12,
    fontWeight: '600',
  },
  activeMembers: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  activeAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeAvatarText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveText: {
    fontWeight: '800',
    fontSize: 18,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  toolbarItem: {
    padding: 10,
    marginRight: 8,
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginLeft: 'auto',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  aiButtonText: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: '700',
    marginLeft: 8,
  },
  editorContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 10,
  },
  titleInput: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 20,
  },
  contentInput: {
    fontSize: 18,
    minHeight: 300,
    lineHeight: 28,
  },
});

export default NoteEditorScreen;
