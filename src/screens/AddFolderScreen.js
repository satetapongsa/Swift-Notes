import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  SafeAreaView,
  StatusBar,
  ScrollView
} from 'react-native';
import { Colors, Typography } from '../theme/theme';
import { 
  ChevronLeft, 
  Folder, 
  Briefcase, 
  User, 
  Plane, 
  Archive,
  Palette
} from 'lucide-react-native';

import { useTheme } from '../theme/ThemeContext';

const AddFolderScreen = ({ navigation }) => {
  const { colors: themeColors, isDark } = useTheme();
  const [folderName, setFolderName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('folder');
  const [selectedColor, setSelectedColor] = useState('#007AFF');

  const icons = [
    { name: 'folder', component: <Folder size={24} /> },
    { name: 'briefcase', component: <Briefcase size={24} /> },
    { name: 'user', component: <User size={24} /> },
    { name: 'plane', component: <Plane size={24} /> },
    { name: 'archive', component: <Archive size={24} /> },
  ];

  const folderColors = ['#007AFF', '#5856D6', '#34C759', '#FF9500', '#FF3B30', '#1C1C1E'];

  const handleCreate = () => {
    if (!folderName.trim()) return;
    navigation.navigate('Main', { 
      screen: 'Folders',
      params: {
        newFolder: {
          name: folderName,
          iconName: selectedIcon,
          color: selectedColor
        }
      }
    });
  };

  const getPreviewIcon = () => {
     const size = 48;
     switch(selectedIcon) {
       case 'briefcase': return <Briefcase size={size} color={selectedColor} />;
       case 'user': return <User size={size} color={selectedColor} />;
       case 'plane': return <Plane size={size} color={selectedColor} />;
       case 'archive': return <Archive size={size} color={selectedColor} />;
       default: return <Folder size={size} color={selectedColor} />;
     }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      <View style={[styles.header, { backgroundColor: isDark ? themeColors.card : themeColors.white, borderBottomColor: themeColors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backButton, { backgroundColor: themeColors.lightGray }]}>
          <ChevronLeft size={24} color={themeColors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: themeColors.text }]}>New Folder</Text>
        <TouchableOpacity onPress={handleCreate}>
          <Text style={[styles.createText, { color: themeColors.primary }]}>Create</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.folderCard, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
          <View style={[styles.iconPreview, { backgroundColor: selectedColor + '20' }]}>
             {getPreviewIcon()}
          </View>
          <TextInput
            style={[styles.input, { color: themeColors.text }]}
            placeholder="Folder Name"
            placeholderTextColor={themeColors.placeholder}
            value={folderName}
            onChangeText={setFolderName}
            autoFocus
          />
        </View>

        <Text style={[styles.sectionTitle, { color: themeColors.textSecondary }]}>SELECT ICON</Text>
        <View style={styles.iconGrid}>
          {icons.map(item => (
            <TouchableOpacity 
              key={item.name} 
              style={[
                styles.iconItem, 
                { backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7' },
                selectedIcon === item.name && { backgroundColor: selectedColor + '30', borderColor: selectedColor, borderWidth: 2 }
              ]}
              onPress={() => setSelectedIcon(item.name)}
            >
              {React.cloneElement(item.component, { color: selectedIcon === item.name ? selectedColor : themeColors.textSecondary })}
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: themeColors.textSecondary }]}>FOLDER COLOR</Text>
        <View style={styles.colorGrid}>
          {folderColors.map(color => (
            <TouchableOpacity 
              key={color} 
              style={[
                styles.colorItem, 
                { backgroundColor: color },
                selectedColor === color && { borderWidth: 3, borderColor: themeColors.text, transform: [{ scale: 1.1 }] }
              ]}
              onPress={() => setSelectedColor(color)}
            />
          ))}
        </View>
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
  createText: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '800',
    fontSize: 18,
  },
  scrollContent: {
    padding: 24,
  },
  folderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 24,
    borderRadius: 25,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: '#F2F2F7',
    elevation: 4,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  iconPreview: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#EBF5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  input: {
    ...Typography.h1,
    fontSize: 24,
    flex: 1,
  },
  sectionTitle: {
    ...Typography.small,
    letterSpacing: 1,
    fontWeight: '800',
    color: Colors.textSecondary,
    marginBottom: 20,
    marginLeft: 5,
  },
  iconGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  iconItem: {
    width: 56,
    height: 56,
    borderRadius: 15,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconActive: {
    backgroundColor: '#EBF5FF',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  colorItem: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 15,
    marginBottom: 15,
  },
});

export default AddFolderScreen;
