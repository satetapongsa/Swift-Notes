import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderPlus, Folder, ChevronRight, X } from 'lucide-react';
import { noteService } from '../lib/noteService';

const Folders = () => {
  const [folders, setFolders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState('#3b82f6');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      const data = await noteService.getFolders();
      setFolders(data);
    } catch (err) {
      console.error('Failed to fetch folders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    try {
      await noteService.createFolder(newFolderName, newFolderColor);
      setNewFolderName('');
      setIsModalOpen(false);
      fetchFolders();
    } catch (err) {
      console.error('Failed to create folder:', err);
    }
  };

  return (
    <div className="folders-page fade-in">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1>Folders</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="glass" 
          style={{ padding: '10px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-color)', fontWeight: '600' }}
        >
          <FolderPlus size={20} />
          <span>New</span>
        </button>
      </header>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading folders...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {folders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
              <p>No folders yet.</p>
            </div>
          ) : (
            folders.map((folder) => (
              <div 
                key={folder.id} 
                onClick={() => navigate(`/folders/${folder.id}`)}
                className="glass" 
                style={{ padding: '16px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: `${folder.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: folder.color }}>
                  <Folder size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '1rem', marginBottom: '2px' }}>{folder.name}</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Notes organized here</span>
                </div>
                <ChevronRight size={20} color="var(--text-muted)" />
              </div>
            ))
          )}
        </div>
      )}

      {/* Folder Creation Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', padding: '20px' }}>
          <div className="glass scale-in" style={{ width: '90%', maxWidth: '440px', maxHeight: '90vh', overflowY: 'auto', padding: '32px', borderRadius: '32px', border: '1px solid var(--border-color)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem' }}>New Folder</h2>
              <button onClick={() => setIsModalOpen(false)} className="glass" style={{ width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={20} />
              </button>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px', marginLeft: '4px' }}>Folder Name</label>
              <input 
                type="text" 
                autoFocus
                placeholder="Work, Personal, Ideas..." 
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                style={{ width: '100%', background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '16px', color: 'white', outline: 'none', fontSize: '1rem' }}
              />
            </div>

            <div style={{ marginBottom: '32px' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px', marginLeft: '4px' }}>Theme Color</p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {colors.map(c => (
                  <button 
                    key={c} 
                    onClick={() => setNewFolderColor(c)}
                    style={{ 
                      width: '36px', 
                      height: '36px', 
                      borderRadius: '50%', 
                      background: c, 
                      border: newFolderColor === c ? '3px solid white' : 'none', 
                      boxShadow: newFolderColor === c ? `0 0 15px ${c}` : 'none',
                      transition: 'transform 0.2s',
                      transform: newFolderColor === c ? 'scale(1.1)' : 'scale(1)'
                    }}
                  />
                ))}
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '16px', borderRadius: '16px', color: 'white', fontWeight: '600', fontSize: '1rem' }} className="glass">Cancel</button>
              <button onClick={handleCreateFolder} style={{ flex: 1, padding: '16px', borderRadius: '16px', background: 'var(--primary-color)', color: 'white', fontWeight: '600', fontSize: '1rem' }}>Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Folders;
