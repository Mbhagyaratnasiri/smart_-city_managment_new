import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import cities from '../data/cities.json';
import AIChatbot from './AIChatbot';
import { fetchAiActions } from '../api/api';
import { useAuth } from '../context/AuthContext';

function SearchBar({ value, onChange }) {
  return <input className="input" placeholder="Search city" value={value} onChange={e => onChange(e.target.value)} />;
}

export default function Home() {
  const [query, setQuery] = useState('');
  const [aiActions, setAiActions] = useState([]);
  const { user } = useAuth();
  const filtered = cities.filter(c => c.name.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    if (user) {
      fetchAiActions().then(setAiActions).catch(() => {});
      const interval = setInterval(() => {
        fetchAiActions().then(setAiActions).catch(() => {});
      }, 5000); // Poll every 5 seconds
      return () => clearInterval(interval);
    }
  }, [user]);

  if (!user) {
    return (
      <div>
        <div style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', padding: '40px 20px', textAlign: 'center', marginBottom: '20px'}}>
          <h1 style={{fontSize: '3rem', margin: 0, fontWeight: 'bold'}}>Smart City Management</h1>
          <p style={{fontSize: '1.2rem', margin: '10px 0 0 0'}}>Intelligent, autonomous city operations powered by AI</p>
        </div>
        <div className="card" style={{background: '#f8f9fa', border: '1px solid #e9ecef'}}>
          <h3 style={{color: '#495057'}}>Discover the Future of Urban Living</h3>
          <p style={{fontSize: '1.1rem', lineHeight: '1.6', color: '#6c757d'}}>
            Experience a city that manages itself! Our AI-powered platform autonomously handles lighting, traffic, and maintenance based on real-time data. Report issues, chat with our AI assistant, and watch as the city responds instantly. From smart streetlights that activate at dusk to automated maintenance teams dispatched for problems, this is urban management reimagined.
          </p>
          <div style={{display: 'flex', justifyContent: 'space-around', marginTop: '20px'}}>
            <div style={{textAlign: 'center'}}>
              <h4 style={{color: '#007bff'}}>🤖 AI Autonomous</h4>
              <p>Self-managing city systems</p>
            </div>
            <div style={{textAlign: 'center'}}>
              <h4 style={{color: '#28a745'}}>⚡ Real-Time</h4>
              <p>Instant updates and responses</p>
            </div>
            <div style={{textAlign: 'center'}}>
              <h4 style={{color: '#ffc107'}}>💬 Interactive</h4>
              <p>AI chatbot for queries</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const actionCards = (
    <div className="card">
      <h4>AI City Management</h4>
      <div className="small">Recent autonomous actions:</div>
      {aiActions.slice(-3).map(a => (
        <div key={a.id} className="list-item">
          <strong>{a.type}: {a.action}</strong>
          <div className="small">{a.location} | {new Date(a.timestamp).toLocaleTimeString()}</div>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <div className="card" style={{background: '#f8f9fa', border: '1px solid #e9ecef'}}>
        <h2>Welcome back, {user.name}!</h2>
        <p className="small">Your dashboard is ready. Choose your task below:</p>
        <div style={{display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 16}}>
          {user.role === 'admin' ? (
            <Link to="/admin" className="button">Go to Admin Dashboard</Link>
          ) : (
            <Link to="/report" className="button">Report an Issue</Link>
          )}
          <Link to="/" className="button">View Cities</Link>
        </div>
      </div>
      <div className="grid">
        <div>
          <div className="card">
            <h3>Cities</h3>
            <div>
              {filtered.map(c => (
                <div key={c.id} className="list-item">
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <div>
                      <strong>{c.name}</strong>
                      <div className="small">Population: {c.population.toLocaleString()}</div>
                    </div>
                    <div>
                      <Link to={`/city/${c.id}`} className="link">View</Link>
                    </div>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && <div className="small">No results.</div>}
            </div>
          </div>
        </div>
        <aside>
          <div className="card">
            <h4>Quick Actions</h4>
            <div style={{display:'flex', flexDirection:'column', gap:8}}>
              {user.role === 'user' && <Link to="/report" className="link">Report an issue</Link>}
              {user.role === 'admin' && <Link to="/admin" className="link">Admin dashboard</Link>}
              <Link to="/login" className="link">Reload Home</Link>
            </div>
          </div>
          {actionCards}
          <AIChatbot />
        </aside>
      </div>
    </div>
  );
}
