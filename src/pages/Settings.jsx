import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Bell, Shield, Moon, LogOut, ChevronRight, Save, Trash2, Key } from 'lucide-react';
import { authService } from '../lib/authService';

const Settings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [passcode, setPasscode] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('neon_user'));
    if (savedUser) {
      setUser(savedUser);
      setName(savedUser.name || '');
      setPasscode(savedUser.passcode || '');
    }
  }, []);

  const handleSaveProfile = async () => {
    if (!user) return;
    setIsSaving(true);
    setMessage('');
    try {
      // Update Name
      const updatedUser = await authService.updateProfile(user.id, name);
      // Update Passcode if changed
      if (passcode.length === 6) {
        await authService.setPasscode(user.id, passcode);
        updatedUser.passcode = passcode;
      }
      
      if (updatedUser) {
        localStorage.setItem('neon_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setMessage('Settings updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.error('Failed to update settings:', err);
      setMessage('Update failed.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('neon_user');
    navigate('/');
  };

  return (
    <div className="settings-page fade-in">
      <header style={{ marginBottom: '32px' }}>
        <h1>Settings</h1>
      </header>

      <section className="profile-section glass" style={{ padding: '24px', borderRadius: '24px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '20px', color: 'var(--text-secondary)' }}>Profile & Security</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>
          <div className="input-field">
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Display Name</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <User size={18} style={{ position: 'absolute', left: '12px', color: 'var(--primary-color)' }} />
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                style={{ background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '12px 12px 12px 40px', color: 'white', width: '100%' }}
              />
            </div>
          </div>

          <div className="input-field">
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Note Passcode (6 digits)</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Key size={18} style={{ position: 'absolute', left: '12px', color: '#f59e0b' }} />
              <input 
                type="password" 
                maxLength={6}
                placeholder="6-digit pin"
                value={passcode} 
                onChange={(e) => setPasscode(e.target.value.replace(/\D/g, ''))}
                style={{ background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '12px 12px 12px 40px', color: 'white', width: '100%', letterSpacing: '4px' }}
              />
            </div>
          </div>
        </div>
        
        {message && (
          <div style={{ padding: '10px', borderRadius: '10px', background: message.includes('success') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: message.includes('success') ? '#10b981' : '#ef4444', fontSize: '0.85rem', marginBottom: '16px', textAlign: 'center' }}>
            {message}
          </div>
        )}

        <button 
          onClick={handleSaveProfile}
          disabled={isSaving}
          className="save-btn-p" 
          style={{ width: '100%', padding: '14px', borderRadius: '16px', background: 'var(--primary-color)', color: 'white', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          <Save size={20} />
          <span>{isSaving ? 'Saving...' : 'Update Settings'}</span>
        </button>
      </section>

      <div className="settings-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div onClick={() => navigate('/trash')} className="settings-item glass" style={{ padding: '16px 20px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}>
          <Trash2 size={20} color="#ef4444" />
          <span style={{ flex: 1 }}>Trash</span>
          <ChevronRight size={20} color="var(--surface-accent)" />
        </div>
        <div onClick={() => navigate('/about')} className="settings-item glass" style={{ padding: '16px 20px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}>
          <Shield size={20} color="var(--primary-color)" />
          <span style={{ flex: 1 }}>About Swift Notes</span>
          <ChevronRight size={20} color="var(--surface-accent)" />
        </div>
        <div className="settings-item glass" style={{ padding: '16px 20px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Moon size={20} color="var(--text-muted)" />
          <span style={{ flex: 1 }}>Appearance</span>
          <ChevronRight size={20} color="var(--surface-accent)" />
        </div>
        
        <button 
          onClick={handleLogout}
          className="glass" 
          style={{ marginTop: '20px', padding: '16px 20px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '16px', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' }}
        >
          <LogOut size={20} />
          <span style={{ fontWeight: '600' }}>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Settings;
