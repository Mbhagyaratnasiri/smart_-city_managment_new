const BASE = process.env.REACT_APP_API_URL || '/api';

export async function login(username, password){
  const res = await fetch(BASE + '/login', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({username,password}) });
  if(!res.ok) throw new Error('Login failed');
  return res.json();
}

export async function fetchCities(token){
  const res = await fetch(BASE + '/cities', { headers: token ? { 'Authorization': 'Bearer ' + token } : {} });
  return res.json();
}

export async function postReport(report, token){
  const res = await fetch(BASE + '/reports', { method: 'POST', headers: {'Content-Type':'application/json', ...(token?{'Authorization':'Bearer '+token}:{})}, body: JSON.stringify(report) });
  return res.json();
}

export async function fetchReports(token){
  const res = await fetch(BASE + '/reports', { headers: {'Authorization':'Bearer ' + token} });
  return res.json();
}

export async function saveCity(city, token){
  const method = city.id ? 'PUT' : 'POST';
  const url = BASE + '/cities' + (city.id ? ('/' + city.id) : '');
  const res = await fetch(url, { method, headers: {'Content-Type':'application/json', 'Authorization':'Bearer ' + token}, body: JSON.stringify(city) });
  return res.json();
}

export async function deleteCity(id, token){
  const res = await fetch(BASE + '/cities/' + id, { method: 'DELETE', headers: {'Authorization':'Bearer ' + token} });
  return res.json();
}

export async function updateReport(id, report, token){
  const res = await fetch(BASE + '/reports/' + id, { method: 'PUT', headers: {'Content-Type':'application/json', 'Authorization':'Bearer ' + token}, body: JSON.stringify(report) });
  return res.json();
}

export async function deleteReport(id, token){
  const res = await fetch(BASE + '/reports/' + id, { method: 'DELETE', headers: {'Authorization':'Bearer ' + token} });
  return res.json();
}

export async function analyzeReport(description){
  const res = await fetch(BASE + '/ai/analyze-report', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({description}) });
  return res.json();
}

export async function fetchAiActions(){
  const res = await fetch(BASE + '/ai-actions');
  return res.json();
}
