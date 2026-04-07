import React, { useState, useEffect } from 'react';
import { fetchCities, postReport } from '../api/api';
import { useAuth } from '../context/AuthContext';

// We will fetch cities from API so that admin changes are reflected
function useCityList(){
  const [cities, setCities] = useState([]);
  useEffect(()=>{ fetchCities().then(setCities).catch(()=>{}); }, []);
  return cities;
}

export default function ReportIssue(){
  const [form, setForm] = useState({cityId:'', title:'', description:'', contact:''});
  const [submitted, setSubmitted] = useState(false);
  const cities = useCityList();
  const { user } = useAuth();

  function submit(e){
    e.preventDefault();
    // POST report to backend API
    postReport(form, user?.token).then(json => {
      console.log('Report submitted', json);
      setSubmitted(true);
    }).catch(err => {
      console.error(err);
      alert('Error submitting report. If running locally, ensure the backend server is started.');
    });
  }

  if(submitted) return (
    <div className="card"><h3>Thank you — issue reported</h3><div className="small">We received your report and will forward it to the relevant department.</div></div>
  );

  return (
    <div className="card">
      <h3>Report an Issue</h3>
      <form onSubmit={submit} style={{display:'grid', gap:8}}>
        <label>
          City
          <select className="input" value={form.cityId} onChange={e=>setForm({...form, cityId: e.target.value})}>
            <option value="">Select city</option>
            {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </label>
        <label>
          Title
          <input className="input" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} />
        </label>
        <label>
          Description
          <textarea className="input" rows="4" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
        </label>
        <label>
          Contact (optional)
          <input className="input" value={form.contact} onChange={e=>setForm({...form, contact:e.target.value})} />
        </label>
        <div>
          <button className="button" type="submit">Submit Report</button>
        </div>
      </form>
    </div>
  );
}
