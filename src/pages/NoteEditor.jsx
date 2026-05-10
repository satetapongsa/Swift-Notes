import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ChevronLeft, Check, Trash2, Clock, Share2, Sparkles, Loader2 } from 'lucide-react';
import { noteService } from '../lib/noteService';
import { aiService } from '../lib/aiService';
import './NoteEditor.css';
import ShareModal from '../components/ShareModal';

const NoteEditor = () => {
  const { id: routeId } = useParams();
  const [id, setId] = useState(routeId);
  const location = useLocation();
  const navigate = useNavigate();
  
  const queryParams = new URLSearchParams(location.search);
  const folderIdFromQuery = queryParams.get('folderId');

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [folderId, setFolderId] = useState(folderIdFromQuery || null);
  const [lastSaved, setLastSaved] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isAiSummarizing, setIsAiSummarizing] = useState(false);
  
  const saveTimeoutRef = useRef(null);

  // Load note if editing
  useEffect(() => {
    if (id && id !== 'new') {
      const loadNote = async () => {
        try {
          const note = await noteService.getNoteById(id);
          if (note) {
            setTitle(note.title);
            setContent(note.content);
            setFolderId(note.folderId || null);
            setLastSaved(new Date(note.updatedAt));
          }
        } catch (err) {
          console.error('Failed to load note:', err);
        }
      };
      loadNote();
    }
  }, [id]);

  // Save logic
  const saveNote = useCallback(async (currentTitle, currentContent) => {
    if (!currentTitle && !currentContent) return;

    setIsSaving(true);
    try {
      const [saved] = await noteService.saveNote({
        id: (id === 'new' || !id) ? null : id,
        title: currentTitle,
        content: currentContent,
        type: 'general',
        color: null,
        folderId
      });
      
      if (saved) {
        if (!id || id === 'new') {
          setId(saved.id);
          window.history.replaceState(null, '', `/editor/${saved.id}`);
        }
        setLastSaved(new Date(saved.updatedAt));
      }
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setIsSaving(false);
    }
  }, [id, folderId]);

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setTitle(val);
    triggerAutoSave(val, content);
  };

  const handleContentChange = (e) => {
    const val = e.target.value;
    setContent(val);
    triggerAutoSave(title, val);
  };

  const triggerAutoSave = (t, c) => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      saveNote(t, c);
    }, 1500);
  };

  const handleAiSummarize = async () => {
    if (isAiSummarizing || !content.trim()) return;
    
    setIsAiSummarizing(true);
    try {
      const summary = await aiService.summarizeNote(content);
      const newContent = `${content}\n\n---\n✨ AI Summary:\n${summary}`;
      setContent(newContent);
      saveNote(title, newContent);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsAiSummarizing(false);
    }
  };

  const handleBack = async () => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    await saveNote(title, content);
    navigate(-1);
  };

  const handleDone = async () => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    await saveNote(title, content);
    navigate('/notes');
  };

  const handleDelete = async () => {
    if (id && id !== 'new') {
      if (window.confirm('Delete this note?')) {
        await noteService.deleteNote(id);
        navigate('/notes');
      }
    } else {
      navigate('/notes');
    }
  };

  return (
    <div className="editor-page fade-in">
      <header className="editor-header">
        <button onClick={handleBack} className="back-btn glass">
          <ChevronLeft size={24} />
        </button>
        
        <div className="status-info">
          {isSaving ? (
            <span className="saving-text">Saving...</span>
          ) : lastSaved ? (
            <span className="last-saved">Saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          ) : null}
        </div>

        <div className="header-actions">
          <button onClick={handleDone} className="done-btn">
            <Check size={20} />
            <span>Done</span>
          </button>
          <button onClick={() => setIsShareModalOpen(true)} className="more-btn glass">
            <Share2 size={20} />
          </button>
        </div>
      </header>

      <div className="editor-body">
        <input 
          type="text" 
          className="title-input" 
          placeholder="Note Title" 
          value={title}
          onChange={handleTitleChange}
        />
        
        <textarea 
          className="content-textarea" 
          placeholder="Start writing..."
          value={content}
          onChange={handleContentChange}
        ></textarea>
      </div>

      <div className="editor-toolbar glass">
        <div className="toolbar-left">
          <button 
            onClick={handleAiSummarize} 
            className={`ai-btn ${isAiSummarizing ? 'loading' : ''}`}
            disabled={isAiSummarizing}
            title="Summarize with AI"
          >
            {isAiSummarizing ? <Loader2 size={20} className="spin" /> : <Sparkles size={20} />}
            <span>AI Summarize</span>
          </button>
        </div>
        
        <div className="toolbar-right">
          <button onClick={handleDelete} className="toolbar-btn"><Trash2 size={20} color="#ef4444" /></button>
          <div className="toolbar-spacer"></div>
          <span className="char-count">{content.length} characters</span>
        </div>
      </div>

      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        noteId={id} 
      />
    </div>
  );
};

export default NoteEditor;
