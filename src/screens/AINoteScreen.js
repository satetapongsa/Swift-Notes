import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Colors, Typography } from '../theme/theme';
import { 
  ChevronLeft, 
  Send, 
  Zap, 
  Sparkles,
  RefreshCcw,
  Copy,
  Check
} from 'lucide-react-native';
import AIService from '../services/AIService';

const AINoteScreen = ({ route, navigation }) => {
  const { title, content } = route.params || {};
  const [inputText, setInputText] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const suggestions = [
    'Summarize this',
    'Generate action items',
    'Rewrite to be formal',
    'Suggest a title'
  ];

  const handleAISubmission = async (prompt) => {
    if (!prompt && !inputText) return;
    
    const finalPrompt = prompt || inputText;
    setIsLoading(true);
    setAiResponse('');
    
    try {
      const response = await AIService.generateResponse(finalPrompt, content);
      setAiResponse(response);
    } catch (error) {
      setAiResponse("Sorry, I encountered an error connecting to the AI brain. Please try again.");
    } finally {
      setIsLoading(false);
      setInputText('');
    }
  };

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Initial greeting or summary
  useEffect(() => {
    if (content) {
      handleAISubmission('Summarize this note for me');
    }
  }, []);

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
          <Text style={styles.doneText}>Close</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.statusLabel}>
          <View style={[styles.dot, { backgroundColor: isLoading ? Colors.primary : Colors.success }]} />
          <Text style={[styles.statusText, { color: isLoading ? Colors.primary : Colors.success }]}>
            {isLoading ? 'AI GENERATING CONTENT...' : 'AI ASSISTANT READY'}
          </Text>
        </View>

        <Text style={styles.noteTitle}>{title || 'Untitled Note'}</Text>
        
        {/* User Prompt Display */}
        {inputText === '' && !isLoading && !aiResponse && (
          <View style={styles.emptyState}>
            <Sparkles size={48} color={Colors.placeholder} />
            <Text style={styles.emptyText}>Ask me to summarize, rewrite, or analyze your note.</Text>
          </View>
        )}

        {aiResponse !== '' && (
          <View style={styles.aiResultContainer}>
            <View style={styles.resultHeader}>
              <Sparkles size={18} color={Colors.primary} />
              <Text style={styles.resultLabel}>AI GENERATED RESPONSE</Text>
              <TouchableOpacity onPress={handleCopy} style={styles.copyButton}>
                {copied ? <Check size={16} color={Colors.success} /> : <Copy size={16} color={Colors.textSecondary} />}
              </TouchableOpacity>
            </View>
            <Text style={styles.aiResponseText}>{aiResponse}</Text>
          </View>
        )}

        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Thinking...</Text>
          </View>
        )}
        
        <View style={{ height: 150 }} />
      </ScrollView>

      {/* AI Input Area */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.aiInputArea}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestionBar}>
          {suggestions.map(s => (
            <TouchableOpacity 
              key={s} 
              style={styles.suggestionPill}
              onPress={() => handleAISubmission(s)}
              disabled={isLoading}
            >
              <Text style={styles.suggestionText}>{s}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        <View style={styles.inputCard}>
          <Zap size={20} color={isDark ? Colors.white : Colors.primary} style={{ marginRight: 10 }} />
          <TextInput 
            style={styles.input}
            placeholder="Ask anything about this note..."
            placeholderTextColor={Colors.placeholder}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={() => handleAISubmission()}
          />
          <TouchableOpacity 
            style={[styles.sendButton, { opacity: inputText || !isLoading ? 1 : 0.5 }]} 
            onPress={() => handleAISubmission()}
            disabled={!inputText || isLoading}
          >
            <Send size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  statusText: {
    fontSize: 12,
    letterSpacing: 1,
    fontWeight: '800',
  },
  noteTitle: {
    ...Typography.h1,
    fontSize: 28,
    marginBottom: 24,
  },
  emptyState: {
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...Typography.body,
    color: Colors.placeholder,
    textAlign: 'center',
    marginTop: 15,
    paddingHorizontal: 40,
  },
  aiResultContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    marginBottom: 30,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  resultLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.primary,
    marginLeft: 8,
    flex: 1,
  },
  aiResponseText: {
    ...Typography.body,
    fontSize: 17,
    color: Colors.text,
    lineHeight: 26,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  loadingText: {
    ...Typography.small,
    marginTop: 15,
    color: Colors.textSecondary,
  },
  aiInputArea: {
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
    backgroundColor: '#F8F9FA',
  },
  suggestionText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  inputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 18,
    paddingHorizontal: 15,
    height: 56,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  copyButton: {
    padding: 5,
  }
});

export default AINoteScreen;

