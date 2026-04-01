import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Colors, Typography } from '../theme/theme';
import { 
  ChevronLeft, 
  Send, 
  Zap, 
  Sparkles,
  ChevronRight
} from 'lucide-react-native';

const AINoteScreen = ({ navigation }) => {
  const suggestions = [
    'Summarize this',
    'Change tone to professional',
    'Add more details',
    'Shorten this content'
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft size={24} color={Colors.primary} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Swift AI</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.doneText}>Done</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.statusLabel}>
          <View style={styles.dot} />
          <Text style={styles.statusText}>AI GENERATING CONTENT</Text>
        </View>

        <Text style={styles.noteTitle}>Travel Blog: Hidden Gems of Kyoto</Text>
        
        <View style={styles.quoteBox}>
          <Text style={styles.quoteText}>
            "Create an outline for a travel blog focused on the quieter side of Kyoto."
          </Text>
        </View>

        <Text style={styles.sectionTitle}>1. Introduction: Beyond the Golden Pavilion</Text>
        <Text style={styles.paragraph}>
          While Kinkaku-ji and Fushimi Inari are breathtaking, Kyoto's soul often lies in the narrow alleyways of Arashiyama's north side and the quiet temples of Sakyo-ku. This post explores the "Slow Kyoto" experience.
        </Text>

        <Text style={styles.sectionTitle}>2. The Bamboo Forest You Didn't Know</Text>
        <Text style={styles.paragraph}>
          Away from the crowds, the Otagi Nenbutsu-ji Temple offers a surreal and peaceful bamboo experience with over 1,200 unique stone statues...
        </Text>
        
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* AI Input Area */}
      <View style={styles.aiInputArea}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestionBar}>
          {suggestions.map(s => (
            <TouchableOpacity key={s} style={styles.suggestionPill}>
              <Text style={styles.suggestionText}>{s}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        <View style={styles.inputCard}>
          <Zap size={20} color={Colors.primary} style={{ marginRight: 10 }} />
          <TextInput 
            style={styles.input}
            placeholder="Edit with AI (e.g., 'make it more...')"
            placeholderTextColor={Colors.placeholder}
          />
          <TouchableOpacity style={styles.sendButton}>
            <Send size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>
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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 18,
    marginLeft: 5,
  },
  headerTitle: {
    ...Typography.h2,
    fontSize: 20,
    fontWeight: '800',
  },
  doneText: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '800',
    fontSize: 18,
  },
  scrollContent: {
    padding: 24,
  },
  statusLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#5856D6',
    marginRight: 10,
  },
  statusText: {
    ...Typography.small,
    letterSpacing: 1,
    color: '#5856D6',
    fontWeight: '800',
  },
  noteTitle: {
    ...Typography.h1,
    fontSize: 34,
    marginBottom: 20,
  },
  quoteBox: {
    borderLeftWidth: 3,
    borderLeftColor: '#E5E5EA',
    paddingLeft: 20,
    marginBottom: 30,
    marginVertical: 10,
  },
  quoteText: {
    ...Typography.body,
    fontSize: 18,
    fontStyle: 'italic',
    color: Colors.textSecondary,
    lineHeight: 26,
  },
  sectionTitle: {
    ...Typography.h2,
    fontSize: 22,
    marginBottom: 15,
    marginTop: 10,
  },
  paragraph: {
    ...Typography.body,
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
    marginBottom: 20,
  },
  aiInputArea: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: Colors.white,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  suggestionBar: {
    marginBottom: 15,
  },
  suggestionPill: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    marginRight: 10,
    backgroundColor: Colors.white,
  },
  suggestionText: {
    ...Typography.small,
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  inputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 56,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#5856D6',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AINoteScreen;
