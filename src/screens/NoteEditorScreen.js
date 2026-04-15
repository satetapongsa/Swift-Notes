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
  Dimensions,
  Switch
} from 'react-native';
import { 
  ChevronLeft, 
  UserPlus, 
  List, 
  Image as ImageIcon, 
  PenTool, 
  Mic, 
  Sparkles,
  Share2,
  BrainCircuit,
  X,
  Plus,
  Copy
} from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { useNotes } from '../context/NoteContext';
import { AIService } from '../lib/AIService';
import { Modal, ActivityIndicator } from 'react-native';


const NoteEditorScreen = ({ route, navigation }) => {
  const { note, folderId, workspace } = route.params || {};
  const { colors, typography, isDark } = useTheme();
  const { addNote, updateNote } = useNotes();
  
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [currentNoteId, setCurrentNoteId] = useState(note?.id || null);

  const [isAISummarizing, setIsAISummarizing] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [showAIModal, setShowAIModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const handleAISummarize = async () => {
    setIsAISummarizing(true);
    setShowAIModal(true);
    try {
      const result = await AIService.summarizeNote(content);
      setAiResult(result);
    } catch (error) {
      alert(error.message);
      setShowAIModal(false);
    } finally {
      setIsAISummarizing(false);
    }
  };

  const insertAISummary = () => {
    if (!aiResult) return;
    const summaryText = `\n\n--- AI Summary ---\n${aiResult.summary}\n\nKey Topics:\n${aiResult.topics.map(t => `• ${t}`).join('\n')}`;
    setContent(prev => prev + summaryText);
    setShowAIModal(false);
  };

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
          <TouchableOpacity onPress={() => setShowShareModal(true)} style={{ marginRight: 15 }}>
            <Share2 size={24} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={[styles.saveText, { color: colors.primary }]}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Note Share Modal */}
      <Modal
        visible={showShareModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowShareModal(false)}
      >
        <View style={styles.modalOverlayCenter}>
          <View style={[styles.shareModalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Share Note</Text>
              <TouchableOpacity onPress={() => setShowShareModal(false)}>
                <X size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.shareToggleRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.shareToggleLabel, { color: colors.text }]}>Link Sharing</Text>
                <Text style={[styles.shareToggleDesc, { color: colors.textSecondary }]}>
                  {note?.linkEnabled ? 'Anyone with link can view' : 'Only you can access'}
                </Text>
              </View>
              <Switch
                value={note?.linkEnabled}
                onValueChange={(val) => updateNote(currentNoteId, { linkEnabled: val })}
                trackColor={{ false: colors.lightGray, true: colors.primary }}
              />
            </View>

            {note?.linkEnabled && (
              <View style={[styles.shareLinkContainer, { backgroundColor: colors.lightGray }]}>
                <Text style={[styles.shareLinkText, { color: colors.primary }]} numberOfLines={1}>{note?.shareLink}</Text>
                <TouchableOpacity 
                   style={[styles.copyIconBtn, { backgroundColor: colors.primary }]}
                   onPress={async () => {
                     await Clipboard.setStringAsync(note.shareLink);
                     alert('Link copied!');
                   }}
                >
                  <Copy size={16} color="#FFF" />
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity 
              style={[styles.closeModalBtn, { backgroundColor: colors.lightGray }]}
              onPress={() => setShowShareModal(false)}
            >
              <Text style={{ color: colors.text, fontWeight: '700' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Toolbar */}
      <View style={[styles.toolbar, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.toolbarItem}>
          <UserPlus size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolbarItem} onPress={handleAISummarize}>
          <BrainCircuit size={20} color={colors.primary} />
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

      {/* AI Summary Modal */}
      <Modal
        visible={showAIModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAIModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <View style={styles.aiHeaderTitle}>
                <Sparkles size={24} color={colors.primary} />
                <Text style={[styles.modalTitle, { color: colors.text, marginLeft: 10 }]}>AI Summary</Text>
              </View>
              <TouchableOpacity onPress={() => setShowAIModal(false)}>
                <X size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {isAISummarizing ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Analysing your note...</Text>
              </View>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={[styles.aiSection, { backgroundColor: colors.primary + '10' }]}>
                  <Text style={[styles.aiLabel, { color: colors.primary }]}>SUMMARY</Text>
                  <Text style={[styles.aiText, { color: colors.text }]}>{aiResult?.summary}</Text>
                </View>

                <Text style={[styles.aiLabel, { color: colors.textSecondary, marginTop: 20 }]}>KEY TOPICS</Text>
                <View style={styles.topicsGrid}>
                  {aiResult?.topics.map((topic, index) => (
                    <View key={index} style={[styles.topicItem, { backgroundColor: colors.lightGray }]}>
                      <View style={[styles.topicDot, { backgroundColor: colors.primary }]} />
                      <Text style={[styles.topicText, { color: colors.text }]}>{topic}</Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity 
                  style={[styles.insertBtn, { backgroundColor: colors.primary }]}
                  onPress={insertAISummary}
                >
                  <Plus size={20} color="#FFF" />
                  <Text style={styles.insertBtnText}>Append to Note</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    padding: 24,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    minHeight: '60%',
  },
  aiHeaderTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: '600',
  },
  aiSection: {
    padding: 20,
    borderRadius: 20,
    marginTop: 10,
  },
  aiLabel: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 8,
  },
  aiText: {
    fontSize: 16,
    lineHeight: 24,
  },
  topicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  topicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 10,
    marginBottom: 10,
  },
  topicDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  topicText: {
    fontSize: 14,
    fontWeight: '600',
  },
  insertBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    marginTop: 30,
    marginBottom: 40,
  },
  insertBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
    marginLeft: 10,
  },
  modalOverlayCenter: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  shareModalContent: {
    width: '100%',
    borderRadius: 24,
    padding: 24,
  },
  shareToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  shareToggleLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  shareToggleDesc: {
    fontSize: 12,
    marginTop: 2,
  },
  shareLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  shareLinkText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  copyIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  closeModalBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  }
});


export default NoteEditorScreen;
