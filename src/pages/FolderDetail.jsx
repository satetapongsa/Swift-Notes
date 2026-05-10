import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, FileText, MoreVertical } from 'lucide-react';

const FolderDetail = () => {
  const { folderId } = useParams();
  const navigate = useNavigate();
  const [folder, setFolder] = useState(null);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    // Fetch folder info
    const savedFolders = JSON.parse(localStorage.getItem('neon_folders') || '[]');
    const currentFolder = savedFolders.find(f => f.id === folderId);
    setFolder(currentFolder);

    // Fetch notes for this folder
    const savedNotes = JSON.parse(localStorage.getItem('neon_notes') || '[]');
    const folderNotes = savedNotes.filter(n => n.folderId === folderId);
    setNotes(folderNotes);
  }, [folderId]);

  return (
    <div className="folder-detail-page fade-in">
      <header style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <button onClick={() => navigate('/folders')} className="glass" style={{ width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifySelf: 'center' }}>
          <ChevronLeft size={24} />
        </button>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>{folder?.name || 'Folder'}</h1>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
        {notes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            <p>No notes in this folder yet.</p>
          </div>
        ) : (
          notes.map(note => (
            <div 
              key={note.id} 
              className="glass" 
              onClick={() => navigate(`/editor/${note.id}`)}
              style={{ padding: '20px', borderRadius: '20px', position: 'relative', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', gap: '12px', marginBottom: '8px' }}>
                <FileText size={18} color={folder?.color || 'var(--primary-color)'} />
                <h4 style={{ fontSize: '1rem' }}>{note.title}</h4>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {note.content}
              </p>
            </div>
          ))
        )}
      </div>

      <button 
        className="fab-button" 
        onClick={() => navigate(`/editor?folderId=${folderId}`)}
      >
        <Plus size={28} />
      </button>
    </div>
  );
};

export default FolderDetail;
