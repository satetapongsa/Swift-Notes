import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Trash2, RotateCcw, FileText, AlertCircle } from 'lucide-react';
import { noteService } from '../lib/noteService';

const Trash = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrash();
  }, []);

  const fetchTrash = async () => {
    try {
      const data = await noteService.getTrashNotes();
      setNotes(data);
    } catch (err) {
      console.error('Failed to fetch trash:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (id) => {
    await noteService.restoreNote(id);
    fetchTrash();
  };

  const handleDeletePermanent = async (id) => {
    if (window.confirm('Are you sure you want to delete this note permanently? This action cannot be undone.')) {
      await noteService.deleteNote(id);
      fetchTrash();
    }
  };

  return (
    <div className="trash-page fade-in">
      <header style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <button onClick={() => navigate('/settings')} className="glass" style={{ width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ChevronLeft size={24} />
        </button>
        <h1 style={{ margin: 0 }}>Trash</h1>
      </header>

      <div className="info-banner glass" style={{ padding: '16px', borderRadius: '16px', display: 'flex', gap: '12px', marginBottom: '24px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
        <AlertCircle size={20} color="#f59e0b" />
        <p style={{ margin: 0, fontSize: '0.85rem', color: '#f59e0b' }}>Notes in the trash will be stored until you delete them permanently.</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
          {notes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
              <Trash2 size={48} style={{ marginBottom: '16px', opacity: 0.2 }} />
              <p>Your trash is empty.</p>
            </div>
          ) : (
            notes.map(note => (
              <div 
                key={note.id} 
                className="glass" 
                style={{ padding: '20px', borderRadius: '20px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <FileText size={18} color="var(--text-muted)" />
                    <h4 style={{ fontSize: '1rem', margin: 0 }}>{note.title}</h4>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleRestore(note.id)} className="glass" style={{ padding: '8px', borderRadius: '10px', color: '#10b981' }} title="Restore">
                      <RotateCcw size={18} />
                    </button>
                    <button onClick={() => handleDeletePermanent(note.id)} className="glass" style={{ padding: '8px', borderRadius: '10px', color: '#ef4444' }} title="Delete Permanently">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: 0 }}>
                  {note.content}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Trash;
