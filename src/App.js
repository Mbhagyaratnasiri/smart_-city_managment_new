import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import CityDetails from './pages/CityDetails';
import ReportIssue from './pages/ReportIssue';
import Login from './pages/Login';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { user, logout } = useAuth();

  return (
    <div>
      <header className="app-header">
        <div style={{marginLeft:16}}>
          <strong>Smart City App</strong>
        </div>
        <nav style={{marginRight:16}}>
          <Link to="/" className="link" style={{marginRight:12}}>Home</Link>
          {user ? (
            <>
              {user.role === 'admin' && <Link to="/admin" className="link" style={{marginRight:12}}>Admin Dashboard</Link>}
              {user.role === 'user' && <Link to="/report" className="link" style={{marginRight:12}}>Report Issue</Link>}
              <span style={{color:'#fff'}}>
                <span className="small" style={{marginRight:8}}>Hello, {user.name}</span>
                <button className="button" onClick={logout}>Logout</button>
              </span>
            </>
          ) : (
            <Link to="/login" className="link">Sign in</Link>
          )}
        </nav>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/city/:id" element={<CityDetails />} />
          <Route path="/report" element={user ? <ReportIssue /> : <Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={user?.role === 'admin' ? <AdminDashboard /> : <Login />} />
        </Routes>
      </main>
    </div>
  );
}
