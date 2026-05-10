import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Clock, Star, ArrowRight, X, FileText } from 'lucide-react';
import { noteService } from '../lib/noteService';
import './Home.css';

const Home = () => {
  const [stats, setStats] = useState({ notes: 0, folders: 0 });
  const [recentNotes, setRecentNotes] = useState([]);
  const [user, setUser] = useState(null);
  
  // New Note Modal States
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('neon_user'));
    if (savedUser) setUser(savedUser);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [notesData, foldersData] = await Promise.all([
        noteService.getNotes(),
        noteService.getFolders()
      ]);
      setStats({
        notes: notesData.length,
        folders: foldersData.length
      });
      setRecentNotes(notesData.slice(0, 3));
    } catch (err) {
      console.error('Failed to fetch home data:', err);
    }
  };

  const handleToggleFavorite = async (e, noteId, currentFavorite) => {
    e.stopPropagation();
    try {
      await noteService.toggleFavorite(noteId, !currentFavorite);
      fetchData();
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  const handleCreateNote = async () => {
    if (!newNoteTitle.trim()) return;
    try {
      const [saved] = await noteService.saveNote({
        title: newNoteTitle,
        content: '',
        type: 'general',
        color: null
      });
      if (saved) {
        setIsNoteModalOpen(false);
        setNewNoteTitle('');
        navigate(`/editor/${saved.id}`);
      }
    } catch (err) {
      console.error('Failed to create note:', err);
    }
  };

  return (
    <>
      <div className="home-page fade-in">
        <header className="home-header">
          <div className="user-info">
            <span>Welcome back,</span>
            <h2>{user?.name || 'Explorer'}</h2>
          </div>
          <button className="search-btn glass">
            <Search size={20} />
          </button>
        </header>

        <section className="stats-grid">
          <div className="stat-card glass" onClick={() => navigate('/notes')}>
            <span className="stat-value">{stats.notes}</span>
            <span className="stat-label">Total Notes</span>
          </div>
          <div className="stat-card glass" onClick={() => navigate('/folders')}>
            <span className="stat-value">{stats.folders}</span>
            <span className="stat-label">Folders</span>
          </div>
        </section>

        <section className="recent-section">
          <div className="section-header">
            <h3>Recent Notes</h3>
            <button className="view-all" onClick={() => navigate('/notes')}>View All <ArrowRight size={16} /></button>
          </div>
          
          <div className="recent-list">
            {recentNotes.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>No notes yet.</p>
            ) : (
              recentNotes.map((note) => (
                <div key={note.id} className="note-item glass" onClick={() => navigate(`/editor/${note.id}`)}>
                  <div className="note-icon" style={{ background: note.color ? `${note.color}20` : 'var(--surface-accent)', color: note.color || 'var(--primary-color)' }}>
                    <Clock size={16} />
                  </div>
                  <div className="note-content">
                    <h4 style={{ color: note.color || 'inherit' }}>{note.title}</h4>
                    <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                  </div>
                  <button onClick={(e) => handleToggleFavorite(e, note.id, note.isFavorite)}>
                    <Star 
                      size={18} 
                      className="star-icon" 
                      fill={note.isFavorite ? '#f59e0b' : 'none'} 
                      color={note.isFavorite ? '#f59e0b' : 'var(--surface-accent)'} 
                    />
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <button className="fab-button" onClick={() => setIsNoteModalOpen(true)}>
        <Plus size={28} />
      </button>

      {/* New Note Modal - Simplified */}
      {isNoteModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', padding: '20px' }}>
          <div className="glass scale-in" style={{ width: '100%', maxWidth: '400px', padding: '32px', borderRadius: '32px', border: '1px solid var(--border-color)', boxShadow: '0 25px 60px rgba(0,0,0,0.7)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)' }}>
                  <FileText size={22} />
                </div>
                <h2 style={{ margin: 0, fontSize: '1.4rem' }}>New Note</h2>
              </div>
              <button onClick={() => setIsNoteModalOpen(false)} className="glass" style={{ width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px', marginLeft: '4px' }}>Note Title</label>
              <input 
                type="text" 
                autoFocus
                placeholder="Enter title..." 
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
                style={{ width: '100%', background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '16px', color: 'white', outline: 'none', fontSize: '1.1rem' }}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateNote()}
              />
            </div>
            
            <button 
              onClick={handleCreateNote} 
              style={{ width: '100%', padding: '18px', borderRadius: '18px', background: 'var(--primary-color)', color: 'white', fontWeight: '700', fontSize: '1.1rem', boxShadow: '0 10px 25px var(--primary-glow)' }}
            >
              Start Writing
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
