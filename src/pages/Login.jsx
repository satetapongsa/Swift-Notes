import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, User, ArrowRight, UserPlus } from 'lucide-react';
import { authService } from '../lib/authService';
import './Login.css';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await authService.register(email, password);
        // Automatically login after register
        const user = await authService.login(email, password);
        localStorage.setItem('neon_user', JSON.stringify(user));
        navigate('/home');
      } else {
        const user = await authService.login(email, password);
        localStorage.setItem('neon_user', JSON.stringify(user));
        navigate('/home');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card glass fade-in">
        <div className="login-header">
          <div className="logo-glow"></div>
          <h1>Swift Notes</h1>
          <p>{isRegister ? 'Create a new account' : 'Sign in to your account'}</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-msg">{error}</div>}
          
          <div className="input-group">
            <Mail className="input-icon" size={20} />
            <input 
              type="email" 
              placeholder="Email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          
          <div className="input-group">
            <Lock className="input-icon" size={20} />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            <span>{loading ? 'Processing...' : isRegister ? 'Create Account' : 'Continue'}</span>
            {isRegister ? <UserPlus size={20} /> : <LogIn size={20} />}
          </button>
        </form>

        <p className="signup-link">
          {isRegister ? 'Already have an account?' : 'Don\'t have an account?'} 
          <a href="#" onClick={(e) => { e.preventDefault(); setIsRegister(!isRegister); }}>
            {isRegister ? ' Sign in' : ' Sign up now'}
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
