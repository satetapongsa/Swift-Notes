import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  FlatList,
  StatusBar
} from 'react-native';
import { ChevronLeft, FileText, MoreVertical, Plus } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { useNotes } from '../context/NoteContext';

const FolderDetailScreen = ({ route, navigation }) => {
  const { folder } = route.params;
  const { colors, isDark } = useTheme();
  const { notes } = useNotes();

  // Filter notes belonging to this folder
  const folderNotes = notes.filter(note => note.folderId === folder.id);

  const renderNoteItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.noteItem, { backgroundColor: colors.card, borderBottomColor: colors.border }]}
      onPress={() => navigation.navigate('Editor', { note: item })}
    >
      <View style={[styles.noteIcon, { backgroundColor: folder.color + '15' }]}>
        <FileText size={20} color={folder.color} />
      </View>
      <View style={styles.noteContent}>
        <Text style={[styles.noteTitle, { color: colors.text }]} numberOfLines={1}>
          {item.title || 'Untitled Note'}
        </Text>
        <Text style={[styles.noteSnippet, { color: colors.textSecondary }]} numberOfLines={1}>
          {item.content || item.snippet || 'No content yet...'}
        </Text>
      </View>
      <MoreVertical size={20} color={colors.placeholder} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft size={28} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={[styles.folderName, { color: colors.text }]}>{folder.name}</Text>
          <Text style={[styles.noteCount, { color: colors.textSecondary }]}>{folderNotes.length} notes</Text>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <MoreVertical size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={folderNotes}
        keyExtractor={item => item.id.toString()}
        renderItem={renderNoteItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <FileText size={60} color={colors.placeholder} opacity={0.3} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No notes in this folder</Text>
            <TouchableOpacity 
              style={[styles.createButton, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate('Editor', { folderId: folder.id })}
            >
              <Plus size={20} color="#FFF" />
              <Text style={styles.createButtonText}>Create first note</Text>
            </TouchableOpacity>
          </View>
        }
      />
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
  backButton: {
    marginRight: 15,
  },
  headerInfo: {
    flex: 1,
  },
  folderName: {
    fontSize: 20,
    fontWeight: '800',
  },
  noteCount: {
    fontSize: 13,
    marginTop: 2,
  },
  moreButton: {
    padding: 5,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  noteIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  noteContent: {
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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 15,
    marginBottom: 25,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 4,
  },
  createButtonText: {
    color: '#FFF',
    fontWeight: '700',
    marginLeft: 8,
  },
});

export default FolderDetailScreen;
