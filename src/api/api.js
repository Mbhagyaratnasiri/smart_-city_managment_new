const BASE = process.env.REACT_APP_API_URL || '/api';

async function handleResponse(res) {
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (err) {
    data = { message: text || res.statusText };
  }

  if (!res.ok) {
    const message = data?.error || data?.message || `Request failed with status ${res.status}`;
    const error = new Error(message);
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
}

function buildHeaders(addJson = false, token) {
  const headers = {};
  if (addJson) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = 'Bearer ' + token;
  return headers;
}

export async function login(username, password) {
  const res = await fetch(BASE + '/login', {
    method: 'POST',
    headers: buildHeaders(true),
    body: JSON.stringify({ username, password }),
  });
  return handleResponse(res);
}

export async function fetchCities(token) {
  const res = await fetch(BASE + '/cities', {
    headers: buildHeaders(false, token),
  });
  return handleResponse(res);
}

export async function postReport(report, token) {
  const res = await fetch(BASE + '/reports', {
    method: 'POST',
    headers: buildHeaders(true, token),
    body: JSON.stringify(report),
  });
  return handleResponse(res);
}

export async function fetchReports(token) {
  const res = await fetch(BASE + '/reports', {
    headers: buildHeaders(false, token),
  });
  return handleResponse(res);
}

export async function saveCity(city, token) {
  const method = city.id ? 'PUT' : 'POST';
  const url = BASE + '/cities' + (city.id ? '/' + city.id : '');
  const res = await fetch(url, {
    method,
    headers: buildHeaders(true, token),
    body: JSON.stringify(city),
  });
  return handleResponse(res);
}

export async function deleteCity(id, token) {
  const res = await fetch(BASE + '/cities/' + id, {
    method: 'DELETE',
    headers: buildHeaders(false, token),
  });
  return handleResponse(res);
}

export async function updateReport(id, report, token) {
  const res = await fetch(BASE + '/reports/' + id, {
    method: 'PUT',
    headers: buildHeaders(true, token),
    body: JSON.stringify(report),
  });
  return handleResponse(res);
}

export async function deleteReport(id, token) {
  const res = await fetch(BASE + '/reports/' + id, {
    method: 'DELETE',
    headers: buildHeaders(false, token),
  });
  return handleResponse(res);
}

export async function analyzeReport(description) {
  const res = await fetch(BASE + '/ai/analyze-report', {
    method: 'POST',
    headers: buildHeaders(true),
    body: JSON.stringify({ description }),
  });
  return handleResponse(res);
}

export async function fetchAiActions() {
  const res = await fetch(BASE + '/ai-actions');
  return handleResponse(res);
}
