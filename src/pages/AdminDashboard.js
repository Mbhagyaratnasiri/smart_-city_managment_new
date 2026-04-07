import React, { useState, useEffect } from 'react';
import { fetchCities, saveCity, deleteCity, fetchReports, updateReport, deleteReport, analyzeReport, fetchAiActions } from '../api/api';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const [cities, setCities] = useState([]);
  const [reports, setReports] = useState([]);
  const [aiActions, setAiActions] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editingReport, setEditingReport] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    fetchCities(user.token).then(setCities).catch(() => setError('Unable to load cities.'));
    fetchReports(user.token).then(setReports).catch(() => setError('Unable to load reports.'));
    fetchAiActions().then(setAiActions).catch(() => setError('Unable to load AI actions.'));
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      fetchCities(user.token).then(setCities).catch(() => {});
      fetchReports(user.token).then(setReports).catch(() => {});
      fetchAiActions().then(setAiActions).catch(() => {});
    }, 5000);
    return () => clearInterval(interval);
  }, [user]);

  function startEdit(id) {
    const c = cities.find(x => x.id === id);
    setEditing({ ...c });
  }

  async function save() {
    if (!editing?.name?.trim()) {
      setMessage('City name is required.');
      return;
    }
    if (!editing?.population || editing.population <= 0) {
      setMessage('Population must be a positive number.');
      return;
    }
    try {
      const updated = await saveCity(editing, user?.token);
      setCities(prev => prev.map(p => p.id === updated.id ? updated : p));
      setEditing(null);
      setMessage('Saved to server.');
      setError('');
      const actions = await fetchAiActions();
      setAiActions(actions);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error saving city.');
      setMessage('');
    }
  }

  function addCity() {
    setEditing({ name: '', population: 0 });
  }

  async function deleteC(id) {
    if (window.confirm('Delete this city?')) {
      try {
        await deleteCity(id, user?.token);
        setCities(prev => prev.filter(c => c.id !== id));
        setMessage('Deleted.');
        setError('');
        const actions = await fetchAiActions();
        setAiActions(actions);
      } catch (err) {
        setError(err.message || 'Error deleting city.');
      }
    }
  }

  function startEditReport(id) {
    const r = reports.find(x => x.id === id);
    setEditingReport({ ...r });
    setAiAnalysis(null);
  }

  async function saveReport() {
    if (!editingReport?.title?.trim()) {
      setMessage('Report title is required.');
      return;
    }
    if (!editingReport?.description?.trim()) {
      setMessage('Report description is required.');
      return;
    }
    try {
      const updated = await updateReport(editingReport.id, editingReport, user?.token);
      setReports(prev => prev.map(p => p.id === updated.id ? updated : p));
      setEditingReport(null);
      setMessage('Report updated.');
      setError('');
      const actions = await fetchAiActions();
      setAiActions(actions);
    } catch (err) {
      setError(err.message || 'Error updating report.');
    }
  }

  async function deleteR(id) {
    if (window.confirm('Delete this report?')) {
      try {
        await deleteReport(id, user?.token);
        setReports(prev => prev.filter(r => r.id !== id));
        setMessage('Report deleted.');
        setError('');
        const actions = await fetchAiActions();
        setAiActions(actions);
      } catch (err) {
        setError(err.message || 'Error deleting report.');
      }
    }
  }

  async function analyze() {
    if (editingReport) {
      try {
        const analysis = await analyzeReport(editingReport.description);
        setAiAnalysis(analysis);
      } catch (err) {
        setAiAnalysis({ error: 'Analysis failed' });
      }
    }
  }

  const predictions = [
    { type: 'Traffic Congestion', location: 'Downtown', probability: 'High', timeframe: 'Next 2 hours' },
    { type: 'Waste Overflow', location: 'Residential Area', probability: 'Medium', timeframe: 'Tomorrow' },
    { type: 'Water Supply Issue', location: 'Suburb', probability: 'Low', timeframe: 'Next week' }
  ];

  return (
    <div>
      <div className="card">
        <h3>Admin Dashboard</h3>
        <div className="small">Manage city information, services, and reports with AI assistance</div>
      </div>
      <div className="grid">
        <div>
          <div className="card">
            <h4>AI Predictive Analytics</h4>
            <div className="small">Predicted issues based on data trends:</div>
            {predictions.map((p, i) => (
              <div key={i} className="list-item">
                <strong>{p.type}</strong> at {p.location} - {p.probability} probability in {p.timeframe}
              </div>
            ))}
          </div>
          <div className="card">
            <h4>Cities</h4>
            <button className="button" onClick={addCity}>Add City</button>
            {cities.map(c => (
              <div key={c.id} className="list-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>{c.name}</strong>
                  <div className="small">Population: {c.population.toLocaleString()}</div>
                </div>
                <div>
                  <button className="button" onClick={() => startEdit(c.id)}>Edit</button>
                  <button className="button" style={{ marginLeft: 4 }} onClick={() => deleteC(c.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
          <div className="card">
            <h4>Reports</h4>
            {reports.map(r => (
              <div key={r.id} className="list-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>{r.title || 'Untitled'}</strong>
                  <div className="small">Status: {r.status}</div>
                </div>
                <div>
                  <button className="button" onClick={() => startEditReport(r.id)}>Edit</button>
                  <button className="button" style={{ marginLeft: 4 }} onClick={() => deleteR(r.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
          <div className="card">
            <h4>AI Autonomous Actions</h4>
            <div className="small">Real-time AI-driven city management:</div>
            {aiActions.slice(-5).map(a => (
              <div key={a.id} className="list-item">
                <strong>{a.type}: {a.action}</strong>
                <div className="small">Location: {a.location} | Status: {a.status} | {new Date(a.timestamp).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
        <aside>
          <div className="card">
            {editing ? (
              <div>
                <h4>{editing.id ? 'Edit' : 'Add'} City</h4>
                <label className="small">Name</label>
                <input className="input" value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} />
                <label className="small">Population</label>
                <input className="input" type="number" value={editing.population} onChange={e => setEditing({ ...editing, population: Number(e.target.value) })} />
                <div style={{ marginTop: 8 }}>
                  <button className="button" onClick={save}>Save</button>
                  <button style={{ marginLeft: 8 }} onClick={() => setEditing(null)}>Cancel</button>
                </div>
              </div>
            ) : editingReport ? (
              <div>
                <h4>Edit Report</h4>
                <label className="small">Title</label>
                <input className="input" value={editingReport.title} onChange={e => setEditingReport({ ...editingReport, title: e.target.value })} />
                <label className="small">Description</label>
                <textarea className="input" value={editingReport.description} onChange={e => setEditingReport({ ...editingReport, description: e.target.value })} />
                <label className="small">Status</label>
                <select className="input" value={editingReport.status} onChange={e => setEditingReport({ ...editingReport, status: e.target.value })}>
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="closed">Closed</option>
                </select>
                <div style={{ marginTop: 8 }}>
                  <button className="button" onClick={analyze}>AI Analyze</button>
                  <button className="button" style={{ marginLeft: 8 }} onClick={saveReport}>Save</button>
                  <button style={{ marginLeft: 8 }} onClick={() => setEditingReport(null)}>Cancel</button>
                </div>
                {aiAnalysis && (
                  <div style={{ marginTop: 8 }}>
                    <h5>AI Analysis</h5>
                    <div className="small">Category: {aiAnalysis.category}</div>
                    <div className="small">Priority: {aiAnalysis.priority}</div>
                    <div className="small">Suggestion: {aiAnalysis.suggestion}</div>
                  </div>
                )}
              </div>
            ) : (
              <div className="small">Select a city or report to edit</div>
            )}
            {message && <div style={{ marginTop: 8 }} className="small">{message}</div>}
            {error && <div style={{ marginTop: 8, color: 'red' }} className="small">{error}</div>}
          </div>
        </aside>
      </div>
    </div>
  );
}
