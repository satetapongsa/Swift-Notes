import React, { useState } from 'react';
import { X, Folder } from 'lucide-react';
import './FolderModal.css';

const FolderModal = ({ isOpen, onClose, onSave }) => {
  const [folderName, setFolderName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (folderName.trim()) {
      onSave(folderName);
      setFolderName('');
      onClose();
    }
  };

  return (
    <div className="modal-overlay fade-in">
      <div className="modal-content glass slide-up">
        <header className="modal-header">
          <h2>Create New Folder</h2>
          <button onClick={onClose} className="close-btn glass">
            <X size={20} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="input-wrapper">
            <Folder className="input-icon" size={20} />
            <input 
              autoFocus
              type="text" 
              placeholder="Folder Name" 
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              required 
            />
          </div>
          
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
            <button type="submit" className="save-btn">Create Folder</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FolderModal;
