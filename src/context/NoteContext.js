import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NoteContext = createContext();

export const NoteProvider = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [folders, setFolders] = useState([
    {
      id: 'default',
      name: 'All Notes',
      iconName: 'folder',
      color: '#007AFF',
      modified: 'Modified 2 hours ago',
      hasStar: true
    },
    {
      id: '1',
      name: 'Work',
      iconName: 'briefcase',
      color: '#5856D6',
      modified: 'Modified yesterday',
    },
    {
      id: '2',
      name: 'Personal',
      iconName: 'user',
      color: '#34C759',
      modified: 'Modified 3 days ago',
    },
  ]);

  const [notes, setNotes] = useState([
    {
      id: 1,
      title: 'Project Alpha Requirements',
      content: 'Brainstorming session for the new platform architecture...',
      date: 'Oct 12, 2023',
      folderId: '1',
      workspaceId: null,
      tags: ['Design', 'UX'],
      isPinned: true
    },
    {
      id: 2,
      title: 'Weekly Sync Notes',
      content: 'Action items from team meeting: 1. Review budget 2. Hire QA...',
      date: 'Oct 10, 2023',
      folderId: '1',
      workspaceId: null,
      tags: ['Work'],
    },
  ]);

  const [workspaces, setWorkspaces] = useState([
    {
      id: 'ws-1',
      name: 'SwiftTeam App Design',
      role: 'Owner',
      activity: 'Active now',
      color: '#007AFF',
      iconName: 'briefcase',
      members: [
        { id: 'me', name: 'Alex (You)', role: 'Admin', avatar: '#FF9500' },
        { id: '2', name: 'Ben', role: 'Editor', avatar: '#34C759' }
      ]
    },
    {
      id: 'ws-2',
      name: 'Marketing Campaign',
      role: 'Member',
      activity: '2 hours ago',
      color: '#FF2D55',
      iconName: 'plane',
      members: [
        { id: 'me', name: 'Alex (You)', role: 'Reader', avatar: '#FF9500' },
        { id: '3', name: 'Cathy', role: 'Owner', avatar: '#5856D6' }
      ]
    }
  ]);

  // Load data from AsyncStorage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedFolders = await AsyncStorage.getItem('folders');
        const storedNotes = await AsyncStorage.getItem('notes');
        const storedWorkspaces = await AsyncStorage.getItem('workspaces');

        if (storedFolders) setFolders(JSON.parse(storedFolders));
        if (storedNotes) setNotes(JSON.parse(storedNotes));
        if (storedWorkspaces) setWorkspaces(JSON.parse(storedWorkspaces));
      } catch (error) {
        console.error('Failed to load storage:', error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadData();
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    if (!isLoaded) return;
    const saveData = async () => {
      try {
        await AsyncStorage.setItem('folders', JSON.stringify(folders));
        await AsyncStorage.setItem('notes', JSON.stringify(notes));
        await AsyncStorage.setItem('workspaces', JSON.stringify(workspaces));
      } catch (error) {
        console.error('Failed to save storage:', error);
      }
    };
    saveData();
  }, [folders, notes, workspaces, isLoaded]);

  const addFolder = (newFolder) => {
    const folderWithId = { 
      ...newFolder, 
      id: Date.now().toString(), 
      modified: 'Just now' 
    };
    setFolders(prev => [prev[0], folderWithId, ...prev.slice(1)]);
  };

  const deleteFolder = (id) => {
    if (id === 'default') return;
    setFolders(prev => prev.filter(f => f.id !== id));
    setNotes(prev => prev.map(n => n.folderId === id ? { ...n, folderId: 'default' } : n));
  };

  const addNote = (newNote) => {
    const noteWithId = { ...newNote, id: Date.now() };
    setNotes(prev => [noteWithId, ...prev]);
    return noteWithId;
  };

  const updateNote = (id, updatedFields) => {
    setNotes(prev => prev.map(note => 
      note.id === id ? { ...note, ...updatedFields } : note
    ));
  };

  const deleteNote = (id) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const addWorkspace = (newWs) => {
    const wsWithId = {
      ...newWs,
      id: 'ws-' + Date.now(),
      activity: 'Just created',
      members: [{ id: 'me', name: 'Alex (You)', role: 'Admin', avatar: '#FF9500' }]
    };
    setWorkspaces(prev => [wsWithId, ...prev]);
  };

  const getNoteCount = (folderId) => {
    if (folderId === 'default') return notes.length;
    return notes.filter(n => n.folderId === folderId).length;
  };

  return (
    <NoteContext.Provider value={{ 
      folders, 
      notes, 
      workspaces,
      addFolder, 
      deleteFolder, 
      addNote, 
      updateNote,
      deleteNote,
      addWorkspace,
      getNoteCount,
      isLoaded
    }}>
      {children}
    </NoteContext.Provider>
  );
};

export const useNotes = () => useContext(NoteContext);
