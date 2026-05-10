import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Home from './pages/Home';
import Notes from './pages/Notes';
import Folders from './pages/Folders';
import Shared from './pages/Shared';
import Settings from './pages/Settings';
import NoteEditor from './pages/NoteEditor';
import FolderDetail from './pages/FolderDetail';
import Trash from './pages/Trash';
import WorkspaceDetail from './pages/WorkspaceDetail';
import About from './pages/About';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/editor/:id?" element={<NoteEditor />} />
        
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/folders" element={<Folders />} />
          <Route path="/folders/:folderId" element={<FolderDetail />} />
          <Route path="/trash" element={<Trash />} />
          <Route path="/about" element={<About />} />
          <Route path="/shared" element={<Shared />} />
          <Route path="/shared/workspace/:id" element={<WorkspaceDetail />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
