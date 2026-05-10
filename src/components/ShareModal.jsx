import React, { useState } from 'react';
import { X, UserPlus, Mail, Send } from 'lucide-react';
import './ShareModal.css';

const ShareModal = ({ isOpen, onClose, noteId }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleInvite = async () => {
    if (!email.trim()) return;
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      alert(`Invitation sent to ${email}`);
      setEmail('');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="share-modal-overlay" onClick={onClose}>
      <div className="share-modal-container scale-in" onClick={e => e.stopPropagation()}>
        <button className="close-modal-btn glass" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="share-modal-header">
          <div className="share-icon-wrapper">
            <UserPlus size={24} />
          </div>
          <div>
            <h2>Share Note</h2>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Invite others to collaborate</p>
          </div>
        </div>

        <div className="share-input-group">
          <div className="share-input-wrapper">
            <Mail className="input-icon" size={18} />
            <input 
              type="email" 
              className="share-input" 
              placeholder="Enter email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
            />
          </div>
          <button 
            className="invite-btn" 
            onClick={handleInvite}
            disabled={loading || !email.trim()}
          >
            {loading ? 'Sending...' : 'Send Invitation'}
          </button>
        </div>

        <div className="collaborators-section">
          <h3>Collaborators</h3>
          <div className="collaborators-list">
            <div className="empty-collaborators">
              No one else has access to this note yet.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
