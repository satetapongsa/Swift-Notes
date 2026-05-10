import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, FileText, Folder, MoreVertical, X, Check } from 'lucide-react';
import { noteService } from '../lib/noteService';

const WorkspaceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workspace, setWorkspace] = useState(null);
  const [items, setItems] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [availableNotes, setAvailableNotes] = useState([]);
  const [availableFolders, setAvailableFolders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkspaceData();
  }, [id]);

  const fetchWorkspaceData = async () => {
    try {
      const allWs = await noteService.getWorkspaces();
      const current = allWs.find(w => w.id === parseInt(id));
      setWorkspace(current);

      const wsItems = await noteService.getWorkspaceItems(id);
      setItems(wsItems);

      const notes = await noteService.getNotes();
      const folders = await noteService.getFolders();
      setAvailableNotes(notes);
      setAvailableFolders(folders);
    } catch (err) {
      console.error('Failed to fetch workspace data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (type, itemId) => {
    try {
      if (type === 'note') {
        await noteService.addNoteToWorkspace(id, itemId);
      } else {
        await noteService.addFolderToWorkspace(id, itemId);
      }
      fetchWorkspaceData();
    } catch (err) {
      console.error('Failed to add item:', err);
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Workspace...</div>;

  return (
    <div className="workspace-detail fade-in">
      <header style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        <button onClick={() => navigate('/shared')} className="glass" style={{ width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>{workspace?.name}</h1>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>Shared working space</p>
        </div>
      </header>

      <section style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0 }}>Items in Workspace</h3>
          <button 
            onClick={() => setIsAdding(true)}
            className="glass" 
            style={{ padding: '8px 16px', borderRadius: '12px', color: 'var(--primary-color)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus size={18} /> Add Item
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px dashed var(--border-color)' }}>
              <p style={{ color: 'var(--text-muted)' }}>No items added yet. Click "Add Item" to pull in your existing notes or folders.</p>
            </div>
          ) : (
            items.map((item) => (
              <div 
                key={item.id} 
                className="glass" 
                style={{ padding: '16px', borderRadius: '18px', display: 'flex', alignItems: 'center', gap: '16px' }}
                onClick={() => item.note ? navigate(`/editor/${item.note.id}`) : navigate(`/folders/${item.folder.id}`)}
              >
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--surface-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)' }}>
                  {item.note ? <FileText size={20} /> : <Folder size={20} />}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: '1rem' }}>{item.note ? item.note.title : item.folder.name}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.note ? 'Note' : 'Folder'}</span>
                </div>
                <MoreVertical size={18} color="var(--text-muted)" />
              </div>
            ))
          )}
        </div>
      </section>

      {/* Add Items Modal */}
      {isAdding && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', padding: '20px' }}>
          <div className="glass scale-in" style={{ width: '100%', maxWidth: '500px', maxHeight: '80vh', borderRadius: '32px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Select Items to Add</h2>
              <button onClick={() => setIsAdding(false)} className="glass" style={{ width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={18} />
              </button>
            </div>
            
            <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ color: 'var(--text-muted)', marginBottom: '12px', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Folders</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {availableFolders.map(f => {
                    const isAdded = items.some(i => i.folderId === f.id);
                    return (
                      <div key={f.id} className="glass" style={{ padding: '12px', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: isAdded ? 0.5 : 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <Folder size={18} color={f.color} />
                          <span style={{ fontWeight: '500' }}>{f.name}</span>
                        </div>
                        {isAdded ? <Check size={18} color="#10b981" /> : (
                          <button onClick={() => handleAddItem('folder', f.id)} style={{ color: 'var(--primary-color)', fontSize: '0.85rem', fontWeight: '600' }}>Add</button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 style={{ color: 'var(--text-muted)', marginBottom: '12px', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Notes</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {availableNotes.map(n => {
                    const isAdded = items.some(i => i.noteId === n.id);
                    return (
                      <div key={n.id} className="glass" style={{ padding: '12px', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: isAdded ? 0.5 : 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <FileText size={18} />
                          <span style={{ fontWeight: '500' }}>{n.title}</span>
                        </div>
                        {isAdded ? <Check size={18} color="#10b981" /> : (
                          <button onClick={() => handleAddItem('note', n.id)} style={{ color: 'var(--primary-color)', fontSize: '0.85rem', fontWeight: '600' }}>Add</button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid var(--border-color)' }}>
              <button onClick={() => setIsAdding(false)} style={{ width: '100%', padding: '14px', borderRadius: '16px', background: 'var(--primary-color)', color: 'white', fontWeight: '600' }}>Done</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspaceDetail;
