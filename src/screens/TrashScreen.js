import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Colors, Typography } from '../theme/theme';
import {
  ChevronLeft,
  Info,
  RefreshCw,
  Trash2,
  Square,
  CheckSquare
} from 'lucide-react-native';

const TrashScreen = ({ navigation }) => {
  const trashedNotes = [
    {
      id: 1,
      title: 'Project Proposal Draft',
      deletedOn: 'Deleted on Oct 12, 2023',
      snippet: 'This is a draft for the upcoming project proposal. It includes market research dat...',
    },
    {
      id: 2,
      title: 'Grocery List',
      deletedOn: 'Deleted on Oct 10, 2023',
      snippet: 'Milk, eggs, bread, coffee beans, and some fruits for the week. Don\'t forget the almon...',
    },
    {
      id: 3,
      title: 'Travel Ideas 2024',
      deletedOn: 'Deleted on Sep 28, 2023',
      snippet: 'Tokyo, Kyoto, and maybe Osaka for the food tour. Need to check flight prices for...',
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft size={24} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trash</Text>
        <TouchableOpacity>
          <Text style={styles.emptyText}>Empty Trash</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.infoBox}>
          <Info size={20} color={Colors.primary} style={{ marginRight: 15 }} />
          <Text style={styles.infoText}>Items in the trash will be permanently deleted after 30 days.</Text>
        </View>

        <View style={styles.selectionBar}>
          <TouchableOpacity style={styles.selectAll}>
            <Square size={20} color={Colors.placeholder} />
            <Text style={styles.selectAllText}>Select All</Text>
          </TouchableOpacity>
          <Text style={styles.itemCount}>3 ITEMS</Text>
        </View>

        {trashedNotes.map(note => (
          <View key={note.id} style={styles.card}>
            <View style={styles.cardLeft}>
              <TouchableOpacity>
                <Square size={20} color={Colors.placeholder} />
              </TouchableOpacity>
            </View>
            <View style={styles.cardBody}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{note.title}</Text>
                <View style={styles.actions}>
                  <TouchableOpacity style={styles.actionButton}>
                    <RefreshCw size={18} color="#007AFF" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Trash2 size={18} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.deletedDate}>{note.deletedOn}</Text>
              <Text style={styles.snippet} numberOfLines={2}>{note.snippet}</Text>
            </View>
          </View>
        ))}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: Colors.white,
  },
  headerTitle: {
    ...Typography.h2,
    fontSize: 22,
    fontWeight: '800',
  },
  backButton: {
    padding: 5,
  },
  emptyText: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 16,
  },
  scrollContent: {
    padding: 20,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF5FF',
    padding: 24,
    borderRadius: 15,
    marginBottom: 25,
  },
  infoText: {
    ...Typography.body,
    fontSize: 15,
    color: Colors.text,
    flex: 1,
    lineHeight: 22,
  },
  selectionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  selectAll: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectAllText: {
    ...Typography.body,
    fontSize: 16,
    color: Colors.textSecondary,
    marginLeft: 10,
    fontWeight: '600',
  },
  itemCount: {
    ...Typography.small,
    letterSpacing: 1,
    color: Colors.placeholder,
    fontWeight: '800',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardLeft: {
    marginRight: 15,
    paddingTop: 5,
  },
  cardBody: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    ...Typography.title,
    fontSize: 18,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 10,
    backgroundColor: Colors.lightGray,
    borderRadius: 10,
  },
  deletedDate: {
    ...Typography.small,
    color: Colors.primary,
    marginBottom: 10,
    fontWeight: '600',
  },
  snippet: {
    ...Typography.body,
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});

export default TrashScreen;
