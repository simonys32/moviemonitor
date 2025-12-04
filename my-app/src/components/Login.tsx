import { useState } from 'react';
import '../App.css';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (
      username === import.meta.env.VITE_ADMIN_USERNAME && 
      password === import.meta.env.VITE_ADMIN_PASSWORD
    ) {
      setError('');
      onLogin();
    } else {
      setError('Invalid credentials');
      setPassword('');
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-container">
        <h1>The holy medialibrary</h1>
        <form onSubmit={handleSubmit}>
          <div className="login-form-group">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              autoFocus
              required
            />
          </div>
          <div className="login-form-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>
          {error && <div className="login-error">{error}</div>}
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};
