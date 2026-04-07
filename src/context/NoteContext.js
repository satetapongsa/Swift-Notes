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

  const [trash, setTrash] = useState({ workspaces: [], notes: [] });
  const [passcode, setPasscode] = useState(null);
  const [passlockEnabled, setPasslockEnabled] = useState(false); // New Persistent State

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedFolders = await AsyncStorage.getItem('folders');
        const savedNotes = await AsyncStorage.getItem('notes');
        const savedWorkspaces = await AsyncStorage.getItem('workspaces');
        const savedTrash = await AsyncStorage.getItem('trash');
        const savedPasscode = await AsyncStorage.getItem('passcode');
        const savedPasslock = await AsyncStorage.getItem('passlockEnabled');
        
        if (savedFolders) setFolders(JSON.parse(savedFolders));
        if (savedNotes) setNotes(JSON.parse(savedNotes));
        if (savedWorkspaces) setWorkspaces(JSON.parse(savedWorkspaces));
        if (savedTrash) setTrash(JSON.parse(savedTrash));
        if (savedPasscode) setPasscode(savedPasscode);
        if (savedPasslock) setPasslockEnabled(JSON.parse(savedPasslock));
        
        setIsLoaded(true);
      } catch (error) {
        console.error('Error loading data:', error);
        setIsLoaded(true);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const saveData = async () => {
      try {
        if (isLoaded) {
          await AsyncStorage.setItem('folders', JSON.stringify(folders));
          await AsyncStorage.setItem('notes', JSON.stringify(notes));
          await AsyncStorage.setItem('workspaces', JSON.stringify(workspaces));
          await AsyncStorage.setItem('trash', JSON.stringify(trash));
          await AsyncStorage.setItem('passlockEnabled', JSON.stringify(passlockEnabled));
          if (passcode) await AsyncStorage.setItem('passcode', passcode);
        }
      } catch (error) {
        console.error('Error saving data:', error);
      }
    };
    saveData();
  }, [folders, notes, workspaces, trash, passcode, passlockEnabled, isLoaded]);

  const addFolder = (name) => {
    const newFolder = { id: Date.now().toString(), name };
    setFolders([...folders, newFolder]);
  };

  const deleteFolder = (id) => {
    setFolders(folders.filter(f => f.id !== id));
  };

  const addNote = (title, content, folderId) => {
    const newNote = {
      id: Date.now().toString(),
      title,
      content,
      folderId,
      updatedAt: new Date().toISOString()
    };
    setNotes([newNote, ...notes]);
    return newNote;
  };

  const updateNote = (id, title, content) => {
    setNotes(notes.map(n => n.id === id ? { ...n, title, content, updatedAt: new Date().toISOString() } : n));
  };

  const deleteNote = (id) => {
    const noteToDelete = notes.find(n => n.id === id);
    if (noteToDelete) {
      setTrash(prev => ({ ...prev, notes: [noteToDelete, ...prev.notes] }));
      setNotes(notes.filter(n => n.id !== id));
    }
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

  const addMemberToWorkspace = (wsId, memberName) => {
    const newMember = {
      id: Date.now().toString(),
      name: memberName,
      role: 'Editor',
      avatar: '#' + Math.floor(Math.random()*16777215).toString(16) // Random Color
    };
    
    setWorkspaces(prev => prev.map(ws => 
      ws.id === wsId ? { ...ws, members: [...ws.members, newMember] } : ws
    ));
    return newMember;
  };

  const updateWorkspace = (wsId, updatedFields) => {
    setWorkspaces(prev => prev.map(ws => 
      ws.id === wsId ? { ...ws, ...updatedFields } : ws
    ));
  };

  const deleteWorkspace = (wsId) => {
    const wsToDelete = workspaces.find(ws => ws.id === wsId);
    if (wsToDelete) {
      setTrash(prev => ({ ...prev, workspaces: [wsToDelete, ...prev.workspaces] }));
      setWorkspaces(prev => prev.filter(ws => ws.id !== wsId));
    }
  };

  const restoreFromTrash = (id, type) => {
    if (type === 'workspace') {
      const wsToRestore = trash.workspaces.find(ws => ws.id === id);
      setWorkspaces(prev => [wsToRestore, ...prev]);
      setTrash(prev => ({ ...prev, workspaces: prev.workspaces.filter(ws => ws.id !== id) }));
    } else {
      const noteToRestore = trash.notes.find(n => n.id === id);
      setNotes(prev => [noteToRestore, ...prev]);
      setTrash(prev => ({ ...prev, notes: prev.notes.filter(n => n.id !== id) }));
    }
  };

  const emptyTrash = () => {
    setTrash({ workspaces: [], notes: [] });
  };

  return (
    <NoteContext.Provider value={{ 
      folders, 
      notes, 
      workspaces,
      trash,
      passcode,
      passlockEnabled,
      setPasscode,
      setPasslockEnabled,
      addFolder, 
      deleteFolder, 
      addNote, 
      updateNote, 
      deleteNote,
      addWorkspace,
      addMemberToWorkspace,
      updateWorkspace,
      deleteWorkspace,
      restoreFromTrash,
      emptyTrash,
      getNoteCount,
      isLoaded
    }}>
      {children}
    </NoteContext.Provider>
  );
};

export const useNotes = () => useContext(NoteContext);
