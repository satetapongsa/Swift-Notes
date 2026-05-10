import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, Folder, FileText, ChevronRight, Share2, Globe } from 'lucide-react';
import { noteService } from '../lib/noteService';

const Shared = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = async () => {
    try {
      const data = await noteService.getWorkspaces();
      setWorkspaces(data);
    } catch (err) {
      console.error('Failed to fetch workspaces:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorkspace = async () => {
    if (!newWorkspaceName.trim()) return;
    try {
      await noteService.createWorkspace(newWorkspaceName, 'Collaborative workspace');
      setNewWorkspaceName('');
      setIsModalOpen(false);
      fetchWorkspaces();
    } catch (err) {
      console.error('Failed to create workspace:', err);
    }
  };

  return (
    <div className="shared-page fade-in">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}>
              <Globe size={24} />
            </div>
            <h1>Workspaces</h1>
          </div>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>Collaborate on notes and folders</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="glass" 
          style={{ width: '48px', height: '48px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)' }}
        >
          <Plus size={24} />
        </button>
      </header>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
          {workspaces.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '32px', border: '1px dashed var(--border-color)' }}>
              <Users size={48} color="var(--surface-accent)" style={{ marginBottom: '16px' }} />
              <h3>No workspaces yet</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Create a workspace to start collaborating with others.</p>
              <button 
                onClick={() => setIsModalOpen(true)}
                style={{ marginTop: '20px', padding: '12px 24px', borderRadius: '14px', background: 'var(--primary-color)', color: 'white', fontWeight: '600' }}
              >
                Create Workspace
              </button>
            </div>
          ) : (
            workspaces.map((ws) => (
              <div 
                key={ws.id} 
                className="glass" 
                onClick={() => navigate(`/shared/workspace/${ws.id}`)}
                style={{ padding: '24px', borderRadius: '24px', cursor: 'pointer', transition: 'transform 0.2s' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--surface-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)' }}>
                      <Share2 size={24} />
                    </div>
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem' }}>{ws.name}</h4>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Workspace • Shared with 0 members</span>
                    </div>
                  </div>
                  <ChevronRight size={20} color="var(--text-muted)" />
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Create Workspace Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="glass slide-up" style={{ width: '100%', maxWidth: '500px', padding: '32px', borderRadius: '32px 32px 0 0', border: '1px solid var(--border-color)' }}>
            <h2 style={{ marginBottom: '8px' }}>New Workspace</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Create a shared area for notes and folders.</p>
            
            <input 
              type="text" 
              autoFocus
              placeholder="Workspace Name" 
              value={newWorkspaceName}
              onChange={(e) => setNewWorkspaceName(e.target.value)}
              style={{ width: '100%', background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '16px', color: 'white', marginBottom: '24px', outline: 'none' }}
            />
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '16px', borderRadius: '16px', color: 'white', fontWeight: '600' }} className="glass">Cancel</button>
              <button onClick={handleCreateWorkspace} style={{ flex: 1, padding: '16px', borderRadius: '16px', background: 'var(--primary-color)', color: 'white', fontWeight: '600' }}>Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shared;
