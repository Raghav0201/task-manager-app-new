import React, { useState } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL;

const ShareTask = ({ taskId }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  const handleShare = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const res = await axios.post(
        `${API}/api/tasks/share`,
        { taskId, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatus(res.data.message || 'Invitation sent!');
      setEmail('');
    } catch (err) {
      setStatus(err.response?.data?.message || 'Failed to share task.');
    }
  };

  return (
    <div style={{ marginTop: '10px' }}>
      <form onSubmit={handleShare} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input
          type="email"
          placeholder="Collaborator's email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            padding: '10px',
            borderRadius: '10px',
            border: '1px solid #ccc',
            fontSize: '14px'
          }}
        />
        <button
          type="submit"
          style={{
            padding: '10px 16px',
            backgroundColor: '#007aff',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: 500
          }}
        >
          Share
        </button>
      </form>
      {status && <p style={{ marginTop: '5px', fontSize: '14px' }}>{status}</p>}
    </div>
  );
};

export default ShareTask;
