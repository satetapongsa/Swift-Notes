import React, { useState, useEffect } from 'react';
import { Delete, X } from 'lucide-react';
import './PinCodeModal.css';

const PinCodeModal = ({ isOpen, onClose, onSuccess, title = "Enter Passcode", expectedPin }) => {
  const [pin, setPin] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (pin.length === 6) {
      if (pin === expectedPin) {
        onSuccess();
        setPin('');
      } else {
        setIsError(true);
        setTimeout(() => {
          setIsError(false);
          setPin('');
        }, 600);
      }
    }
  }, [pin, expectedPin, onSuccess]);

  if (!isOpen) return null;

  const handleKeyPress = (digit) => {
    if (pin.length < 6) {
      setPin(prev => prev + digit);
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
  };

  return (
    <div className="pin-modal-overlay">
      <div className={`pin-modal-container ${isError ? 'shake' : ''}`}>
        <button onClick={onClose} style={{ position: 'absolute', top: '30px', right: '30px', color: 'var(--text-muted)' }}>
          <X size={28} />
        </button>

        <div className="pin-header">
          <h2>{title}</h2>
          <p>{isError ? "Incorrect passcode. Try again." : "Enter your 6-digit security code"}</p>
        </div>

        <div className="pin-dots">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i} 
              className={`pin-dot ${i < pin.length ? 'filled' : ''} ${isError ? 'error' : ''}`} 
            />
          ))}
        </div>

        <div className="pin-keypad">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button key={num} onClick={() => handleKeyPress(num.toString())} className="keypad-btn">
              {num}
            </button>
          ))}
          <button className="keypad-btn action" onClick={onClose}>Cancel</button>
          <button onClick={() => handleKeyPress('0')} className="keypad-btn">0</button>
          <button className="keypad-btn action" onClick={handleDelete}>
            <Delete size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PinCodeModal;
