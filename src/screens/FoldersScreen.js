import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  SafeAreaView,
  StatusBar,
  Modal,
  TouchableWithoutFeedback
} from 'react-native';
import { 
  Menu, 
  Plus, 
  Search, 
  Folder, 
  Briefcase, 
  User, 
  Plane, 
  Archive,
  ChevronRight,
  Star
} from 'lucide-react-native';
import Sidebar from '../components/Sidebar';
import { useTheme } from '../theme/ThemeContext';
import { useNotes } from '../context/NoteContext';

const FoldersScreen = ({ navigation, route }) => {
  const { colors, typography, isDark } = useTheme();
  const { folders, addFolder, getNoteCount } = useNotes();
  const [showSidebar, setShowSidebar] = React.useState(false);

  React.useEffect(() => {
    if (route.params?.newFolder) {
      addFolder(route.params.newFolder);
      // Clear params
      navigation.setParams({ newFolder: undefined });
    }
  }, [route.params?.newFolder]);

  const getIcon = (name, color) => {
    const size = 24;
    switch(name) {
      case 'briefcase': return <Briefcase size={size} color={color} />;
      case 'user': return <User size={size} color={color} />;
      case 'plane': return <Plane size={size} color={color} />;
      case 'archive': return <Archive size={size} color={color} />;
      default: return <Folder size={size} color={color} />;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: isDark ? colors.card : colors.white, borderBottomWidth: isDark ? 1 : 0, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => setShowSidebar(true)}>
          <Menu size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Folders</Text>
        <TouchableOpacity style={[styles.plusButton, { backgroundColor: colors.primary }]} onPress={() => navigation.navigate('AddFolder')}>
          <Plus size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      <View style={[styles.searchContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Search size={22} color={colors.textSecondary} style={styles.searchIcon} />
        <TextInput 
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search folders"
          placeholderTextColor={colors.placeholder}
        />
      </View>

      <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
        {folders.map(folder => (
          <TouchableOpacity 
            key={folder.id} 
            style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => navigation.navigate('FolderDetail', { folder })}
          >
            <View style={styles.iconContainer}>
              <View style={[styles.iconBackground, { backgroundColor: folder.color + '15' }]}>
                {getIcon(folder.iconName, folder.color)}
                {folder.hasStar && <Star size={10} color={colors.white} fill={colors.white} style={[styles.starIcon, { backgroundColor: colors.primary }]} />}
              </View>
            </View>
            <View style={styles.content}>
              <Text style={[styles.folderName, { color: colors.text }]}>{folder.name}</Text>
              <Text style={[styles.modifiedText, { color: colors.textSecondary }]}>{folder.modified}</Text>
            </View>
            <View style={styles.rightContent}>
              <View style={[styles.badge, { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' }]}>
                <Text style={[styles.badgeText, { color: colors.textSecondary }]}>{getNoteCount(folder.id)}</Text>
              </View>
              <ChevronRight size={20} color={colors.placeholder} />
            </View>
          </TouchableOpacity>
        ))}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sidebar Modal */}
      <Modal
        visible={showSidebar}
        transparent={true}
        animationType="none"
        onRequestClose={() => setShowSidebar(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={() => setShowSidebar(false)}>
            <View style={styles.sidebarBackdrop} />
          </TouchableWithoutFeedback>
          <View style={styles.sidebarContainer}>
            <Sidebar 
              navigation={navigation} 
              onClose={() => setShowSidebar(false)} 
              currentRoute="Folders" 
            />
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
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
  },
  plusButton: {
    padding: 8,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    paddingHorizontal: 15,
    borderRadius: 15,
    height: 56,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 18,
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 20,
    marginBottom: 15,
    borderWidth: 1,
  },
  iconContainer: {
    marginRight: 15,
  },
  iconBackground: {
    width: 54,
    height: 54,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  starIcon: {
    position: 'absolute',
    top: 20,
    left: 22,
    padding: 2,
    borderRadius: 5,
  },
  content: {
    flex: 1,
  },
  folderName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  modifiedText: {
    fontSize: 12,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    marginRight: 10,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebarBackdrop: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sidebarContainer: {
    width: '80%',
    height: '100%',
  },
});

export default FoldersScreen;
