import React from 'react';
import { useParams, Link } from 'react-router-dom';
import cities from '../data/cities.json';

export default function CityDetails(){
  const { id } = useParams();
  const city = cities.find(c => c.id === id);
  if(!city) return (<div className="card"><h3>City not found</h3><Link to="/">Back</Link></div>);

  return (
    <div>
      <div className="card">
        <h2>{city.name}</h2>
        <div className="small">Population: {city.population.toLocaleString()}</div>
        <h4>Services</h4>
        <ul>
          {city.services.map((s, i) => <li key={i}>{s.type} — {s.status}</li>)}
        </ul>
        <h4>Infrastructure</h4>
        <ul>
          {Object.entries(city.infrastructure).map(([k,v]) => <li key={k}>{k}: {v}</li>)}
        </ul>
        <h4>Amenities</h4>
        <ul>
          {city.amenities.map((a,i) => <li key={i}>{a}</li>)}
        </ul>
        <div style={{marginTop:12}}>
          <Link to="/report" className="link">Report an issue about this city</Link>
        </div>
      </div>
    </div>
  );
}
