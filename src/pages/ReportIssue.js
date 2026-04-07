import React, { useState, useEffect } from 'react';
import { fetchCities, postReport } from '../api/api';
import { useAuth } from '../context/AuthContext';

function useCityList() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchCities().then(setCities).catch(() => {}).finally(() => setLoading(false));
  }, []);
  return { cities, loading };
}

export default function ReportIssue() {
  const [form, setForm] = useState({ cityId: '', title: '', description: '', contact: '' });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { cities, loading: citiesLoading } = useCityList();
  const { user } = useAuth();

  function validate() {
    const next = {};
    if (!form.cityId) next.cityId = 'Please select a city';
    if (!form.title.trim()) next.title = 'Title is required';
    if (!form.description.trim()) next.description = 'Description is required';
    return next;
  }

  async function submit(e) {
    e.preventDefault();
    setSubmitError('');
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length) return;

    setLoading(true);
    try {
      await postReport(form, user?.token);
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err.message || 'Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (submitted) return (
    <div className="card">
      <h3>Thank you — issue reported</h3>
      <div className="small">We received your report and will forward it to the relevant department.</div>
    </div>
  );

  return (
    <div className="card">
      <h3>Report an Issue</h3>
      <form onSubmit={submit} style={{ display: 'grid', gap: 8 }}>
        <label className="field-label">
          City
          <select
            className="input"
            value={form.cityId}
            onChange={(e) => {
              setForm({ ...form, cityId: e.target.value });
              setErrors({ ...errors, cityId: '' });
            }}
            disabled={citiesLoading}
          >
            <option value="">Select city</option>
            {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          {errors.cityId && <div className="small" style={{ color: 'red' }}>{errors.cityId}</div>}
        </label>
        <label className="field-label">
          Title
          <input
            className="input"
            value={form.title}
            onChange={(e) => {
              setForm({ ...form, title: e.target.value });
              setErrors({ ...errors, title: '' });
            }}
          />
          {errors.title && <div className="small" style={{ color: 'red' }}>{errors.title}</div>}
        </label>
        <label className="field-label">
          Description
          <textarea
            className="input"
            rows="4"
            value={form.description}
            onChange={(e) => {
              setForm({ ...form, description: e.target.value });
              setErrors({ ...errors, description: '' });
            }}
          />
          {errors.description && <div className="small" style={{ color: 'red' }}>{errors.description}</div>}
        </label>
        <label className="field-label">
          Contact (optional)
          <input
            className="input"
            value={form.contact}
            onChange={(e) => setForm({ ...form, contact: e.target.value })}
          />
        </label>
        {submitError && <div className="small" style={{ color: 'red' }}>{submitError}</div>}
        <div>
          <button className="button" type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit Report'}</button>
        </div>
      </form>
    </div>
  );
}
