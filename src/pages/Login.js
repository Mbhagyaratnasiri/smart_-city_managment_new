import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin } from '../api/api';
import { useAuth } from '../context/AuthContext';

export default function Login(){
  const [form, setForm] = useState({username:'', password:''});
  const [error, setError] = useState('');
  const nav = useNavigate();
  const { login } = useAuth();

  async function submit(e){
    e.preventDefault();
    try{
      const data = await apiLogin(form.username, form.password);
      login(data);
      if (data.role === 'admin') {
        nav('/admin');
      } else {
        nav('/report');
      }
    }catch(err){
      setError('Invalid credentials');
    }
  }

  return (
    <div className="card">
      <h3>Sign in</h3>
      <form onSubmit={submit} style={{display:'grid', gap:8}}>
        <input className="input" placeholder="username" value={form.username} onChange={e=>setForm({...form, username:e.target.value})} />
        <input className="input" placeholder="password" type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} />
        {error && <div className="small" style={{color:'red'}}>{error}</div>}
        <div>
          <button className="button" type="submit">Login</button>
        </div>
      </form>
      <div className="small" style={{marginTop:8}}>Demo credentials: <strong>admin/admin</strong> or <strong>user/user</strong></div>
    </div>
  );
}
