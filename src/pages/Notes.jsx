import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, MoreVertical, FileText, Lock, Trash2, FolderInput, Unlock } from 'lucide-react';
import { noteService } from '../lib/noteService';
import PinCodeModal from '../components/PinCodeModal';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenu, setActiveMenu] = useState(null);
  const [folders, setFolders] = useState([]);
  
  // PIN Modal States
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinAction, setPinAction] = useState(null); // { type: 'lock'|'unlock'|'open', noteId: string, currentLocked: boolean }
  const [currentUser, setCurrentUser] = useState(null);

  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('neon_user'));
    setCurrentUser(user);
    fetchNotes();
    fetchFolders();
    
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotes = async () => {
    try {
      const data = await noteService.getNotes();
      setNotes(data);
    } catch (err) {
      console.error('Failed to fetch notes:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFolders = async () => {
    const data = await noteService.getFolders();
    setFolders(data);
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim()) {
      const filtered = await noteService.searchNotes(query);
      setNotes(filtered);
    } else {
      fetchNotes();
    }
  };

  const handlePinSuccess = async () => {
    if (!pinAction) return;

    if (pinAction.type === 'lock' || pinAction.type === 'unlock') {
      await noteService.lockNote(pinAction.noteId, !pinAction.currentLocked);
      setIsPinModalOpen(false);
      setActiveMenu(null);
      fetchNotes();
    } else if (pinAction.type === 'open') {
      setIsPinModalOpen(false);
      navigate(`/editor/${pinAction.noteId}`);
    }
    setPinAction(null);
  };

  const requestPin = (type, noteId, currentLocked = false) => {
    setPinAction({ type, noteId, currentLocked });
    setIsPinModalOpen(true);
  };

  const moveToTrash = async (id) => {
    await noteService.softDeleteNote(id);
    setActiveMenu(null);
    fetchNotes();
  };

  const moveFolder = async (id, folderId) => {
    await noteService.moveNoteToFolder(id, folderId);
    setActiveMenu(null);
    fetchNotes();
  };

  const handleNoteClick = (note) => {
    if (note.isLocked) {
      requestPin('open', note.id);
    } else {
      navigate(`/editor/${note.id}`);
    }
  };

  return (
    <div className="notes-page fade-in">
      <header style={{ marginBottom: '24px' }}>
        <h1 style={{ marginBottom: '16px' }}>My Notes</h1>
        <div className="input-group glass" style={{ padding: '4px 12px', display: 'flex', alignItems: 'center', borderRadius: '16px' }}>
          <Search size={20} color="var(--text-muted)" />
          <input 
            type="text" 
            placeholder="Search notes..." 
            value={searchQuery}
            onChange={handleSearch}
            style={{ background: 'transparent', border: 'none', color: 'white', padding: '12px', width: '100%', outline: 'none' }}
          />
          <Filter size={20} color="var(--text-muted)" />
        </div>
      </header>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
          {notes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              <p>No notes found.</p>
            </div>
          ) : (
            notes.map(note => (
              <div 
                key={note.id} 
                className="glass" 
                style={{ 
                  padding: '20px', 
                  borderRadius: '20px', 
                  position: 'relative', 
                  cursor: 'pointer',
                  zIndex: activeMenu === note.id ? 1000 : 1
                }}
                onClick={() => handleNoteClick(note)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <FileText size={18} color="var(--primary-color)" />
                    <h4 style={{ fontSize: '1rem', margin: 0 }}>
                      {note.isLocked ? '••••••••' : note.title}
                    </h4>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {note.isLocked && <Lock size={14} color="var(--primary-color)" />}
                    <button 
                      onClick={(e) => { e.stopPropagation(); setActiveMenu(note.id); }}
                      style={{ padding: '4px', borderRadius: '8px' }}
                      className="glass"
                    >
                      <MoreVertical size={18} color="var(--text-muted)" />
                    </button>
                  </div>
                </div>

                {activeMenu === note.id && (
                  <div 
                    ref={menuRef}
                    className="glass"
                    style={{ 
                      position: 'absolute', 
                      top: '50px', 
                      right: '20px', 
                      zIndex: 3000, 
                      borderRadius: '16px', 
                      padding: '8px', 
                      minWidth: '180px', 
                      boxShadow: '0 15px 40px rgba(0,0,0,0.6)', 
                      border: '1px solid var(--border-color)',
                      background: 'rgba(22, 22, 26, 0.95)',
                      backdropFilter: 'blur(20px)'
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button onClick={() => requestPin(note.isLocked ? 'unlock' : 'lock', note.id, note.isLocked)} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '12px', borderRadius: '10px', color: 'white', fontSize: '0.9rem' }}>
                      {note.isLocked ? <Unlock size={16} /> : <Lock size={16} />}
                      {note.isLocked ? 'Unlock Note' : 'Lock Note'}
                    </button>
                    <button onClick={() => moveToTrash(note.id)} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '12px', borderRadius: '10px', color: '#ef4444', fontSize: '0.9rem' }}>
                      <Trash2 size={16} />
                      Move to Trash
                    </button>
                    
                    {folders.length > 0 && (
                      <div style={{ borderTop: '1px solid var(--border-color)', margin: '8px 0', padding: '8px 0' }}>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: '0 0 8px 10px' }}>Move to Folder</p>
                        {folders.map(f => (
                          <button key={f.id} onClick={() => moveFolder(note.id, f.id)} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px', borderRadius: '10px', color: 'white', fontSize: '0.85rem' }}>
                            <FolderInput size={14} color={f.color} />
                            {f.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {!note.isLocked && (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: '4px 0 0 0' }}>
                    {note.content || 'No content yet...'}
                  </p>
                )}
                <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Premium Pin Code Modal */}
      <PinCodeModal 
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onSuccess={handlePinSuccess}
        expectedPin={currentUser?.passcode}
        title={pinAction?.type === 'lock' ? "Set Lock" : "Enter Passcode"}
      />
    </div>
  );
};

export default Notes;
