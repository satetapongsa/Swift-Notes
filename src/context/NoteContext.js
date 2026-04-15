import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';

const NoteContext = createContext();

export const NoteProvider = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [session, setSession] = useState(null);
  const [folders, setFolders] = useState([
    {
      id: 'default',
      name: 'All Notes',
      iconName: 'folder',
      color: '#007AFF',
      modified: 'Modified now',
      hasStar: true
    }
  ]);

  const [notes, setNotes] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);


  const [trash, setTrash] = useState({ workspaces: [], notes: [] });
  const [passcode, setPasscode] = useState(null);
  const [passlockEnabled, setPasslockEnabled] = useState(false); // New Persistent State

  // 1. ตักตามสถานะการล็อกอิน (Auth Tracking)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. ดึงข้อมูลจากฐานข้อมูลจริง (Fetching Data)
  useEffect(() => {
    const fetchCloudData = async () => {
      if (!session) return;
      
      try {
        // ดึงโน้ต
        const { data: cloudNotes, error: notesError } = await supabase
          .from('notes')
          .select('*')
          .eq('user_id', session.user.id)
          .order('updated_at', { ascending: false });

        if (cloudNotes) setNotes(cloudNotes);

        // ดึงพื้นที่ทำงาน
        const { data: cloudWorkspaces, error: wsError } = await supabase
          .from('workspaces')
          .select('*, workspace_members(role, profiles(*))')
          .eq('owner_id', session.user.id);
          
        if (cloudWorkspaces) setWorkspaces(cloudWorkspaces);

        // ดึงโฟลเดอร์
        const { data: cloudFolders } = await supabase
          .from('folders')
          .select('*')
          .eq('user_id', session.user.id);

        if (cloudFolders && cloudFolders.length > 0) {
          const defaultFolder = { id: 'default', name: 'All Notes', icon_name: 'folder', color: '#007AFF', hasStar: true };
          setFolders([defaultFolder, ...cloudFolders]);
        }

        setIsLoaded(true);
      } catch (error) {
        console.error('Fetch error:', error);
        setIsLoaded(true);
      }
    };

    if (session) {
      fetchCloudData();
    } else {
      setIsLoaded(true);
    }
  }, [session]);

  const addNote = async ({ title, content, folderId, workspaceId }) => {
    if (!session) return;

    const newNote = {
      title,
      content,
      folder_id: folderId || 'default',
      workspace_id: workspaceId || null,
      user_id: session.user.id,
      updated_at: new Date().toISOString(),
      link_enabled: false,
    };

    const { data, error } = await supabase
      .from('notes')
      .insert([newNote])
      .select();

    if (data) {
      setNotes([data[0], ...notes]);
      return data[0];
    }
  };

  const updateNote = async (id, updates) => {
    if (!session) return;

    const { error } = await supabase
      .from('notes')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (!error) {
      setNotes(notes.map(n => n.id === id ? { ...n, ...updates } : n));
    }
  };


  const addFolder = async (name) => {
    if (!session) return;
    const { data } = await supabase
      .from('folders')
      .insert([{ name, user_id: session.user.id }])
      .select();
    
    if (data) {
      setFolders([...folders, data[0]]);
    }
  };

  const deleteFolder = async (id) => {
    if (!session || id === 'default') return;
    const { error } = await supabase.from('folders').delete().eq('id', id);
    if (!error) {
      setFolders(folders.filter(f => f.id !== id));
    }
  };

  const deleteNote = async (id) => {
    if (!session) return;
    const { error } = await supabase.from('notes').delete().eq('id', id);
    if (!error) {
      setNotes(notes.filter(n => n.id !== id));
    }
  };


  const addWorkspace = (newWs) => {
    const wsWithId = {
      ...newWs,
      id: 'ws-' + Date.now(),
      activity: 'Just created',
      members: [{ id: 'me', name: 'Alex (You)', role: 'Admin', avatar: '#FF9500' }],
      linkEnabled: false,
      shareLink: `https://swift-notes.com/join/${newWs.name.toLowerCase().replace(/\s+/g, '-')}`
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
