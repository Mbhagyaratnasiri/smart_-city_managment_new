import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin } from '../api/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const { login } = useAuth();

  function validate() {
    const next = {};
    if (!form.username.trim()) next.username = 'Username is required';
    if (!form.password) next.password = 'Password is required';
    return next;
  }

  async function submit(e) {
    e.preventDefault();
    setServerError('');
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length) return;

    setLoading(true);
    try {
      const data = await apiLogin(form.username.trim(), form.password);
      login(data);
      if (data.role === 'admin') {
        nav('/admin');
      } else {
        nav('/report');
      }
    } catch (err) {
      setServerError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h3>Sign in</h3>
      <form onSubmit={submit} style={{ display: 'grid', gap: 8 }}>
        <label className="field-label">
          Username
          <input
            className="input"
            placeholder="username"
            value={form.username}
            onChange={(e) => {
              setForm({ ...form, username: e.target.value });
              setErrors({ ...errors, username: '' });
            }}
          />
          {errors.username && <div className="small" style={{ color: 'red' }}>{errors.username}</div>}
        </label>
        <label className="field-label">
          Password
          <input
            className="input"
            placeholder="password"
            type="password"
            value={form.password}
            onChange={(e) => {
              setForm({ ...form, password: e.target.value });
              setErrors({ ...errors, password: '' });
            }}
          />
          {errors.password && <div className="small" style={{ color: 'red' }}>{errors.password}</div>}
        </label>
        {serverError && <div className="small" style={{ color: 'red' }}>{serverError}</div>}
        <div>
          <button className="button" type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</button>
        </div>
      </form>
      <div className="small" style={{ marginTop: 8 }}>
        Demo credentials: <strong>admin/admin</strong> or <strong>user/user</strong>
      </div>
    </div>
  );
}
