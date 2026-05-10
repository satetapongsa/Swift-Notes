import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ChevronLeft, Check, Trash2, Share2, Sparkles, Loader2 } from 'lucide-react';
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

  // Load note
  useEffect(() => {
    if (id && id !== 'new') {
      const loadNote = async () => {
        try {
          const note = await noteService.getNoteById(id);
          if (note) {
            setTitle(note.title || '');
            setContent(note.content || '');
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
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => saveNote(val, content), 1500);
  };

  const handleContentChange = (e) => {
    const val = e.target.value;
    setContent(val);
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => saveNote(title, val), 1500);
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
          {isSaving ? "Saving..." : lastSaved ? `Saved ${lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : "New Note"}
        </div>

        <div className="header-actions">
          <button onClick={() => setIsShareModalOpen(true)} className="glass" style={{ width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Share2 size={20} />
          </button>
          <button onClick={handleDone} className="done-btn">
            <Check size={20} />
            <span>Done</span>
          </button>
        </div>
      </header>

      <main className="editor-body">
        <input 
          type="text" 
          className="title-input" 
          placeholder="Note Title" 
          value={title}
          onChange={handleTitleChange}
          autoFocus={!title}
        />
        
        <textarea 
          className="content-textarea" 
          placeholder="Start writing your thoughts..."
          value={content}
          onChange={handleContentChange}
        />
      </main>

      <footer className="editor-toolbar">
        <button 
          onClick={handleAiSummarize} 
          className={`ai-btn ${isAiSummarizing ? 'loading' : ''}`}
          disabled={isAiSummarizing}
        >
          {isAiSummarizing ? <Loader2 size={18} className="spin" /> : <Sparkles size={18} />}
          <span>AI Summarize</span>
        </button>
        
        <div className="toolbar-right">
          <button onClick={handleDelete} className="toolbar-btn">
            <Trash2 size={20} />
          </button>
          <span className="char-count">{content.length} chars</span>
        </div>
      </footer>

      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        noteId={id} 
      />
    </div>
  );
};

export default NoteEditor;
