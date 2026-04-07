const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const DB_PATH = path.join(__dirname, 'db.json');

function readDB(){
  const raw = fs.readFileSync(DB_PATH, 'utf8');
  return JSON.parse(raw);
}

function writeDB(obj){
  fs.writeFileSync(DB_PATH, JSON.stringify(obj, null, 2));
}

// Simple auth for demo purposes
const tokens = {
  'admintoken': { role: 'admin', name: 'Admin' },
  'usertoken': { role: 'user', name: 'User' }
};

app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};
  // Demo credentials: admin/admin and user/user
  if(username === 'admin' && password === 'admin'){
    return res.json({ token: 'admintoken', role: 'admin', name: 'Admin' });
  }
  if(username === 'user' && password === 'user'){
    return res.json({ token: 'usertoken', role: 'user', name: 'User' });
  }
  return res.status(401).json({ error: 'Invalid credentials' });
});

function authMiddleware(req, res, next){
  const auth = req.headers['authorization'];
  if(!auth) return next();
  const token = auth.replace('Bearer ', '');
  const u = tokens[token];
  if(u) req.user = u;
  next();
}

app.use(authMiddleware);

app.get('/api/cities', (req, res) => {
  const db = readDB();
  res.json(db.cities);
});

app.post('/api/cities', (req, res) => {
  if(!req.user || req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const db = readDB();
  const city = req.body;
  city.id = String(Date.now());
  db.cities.push(city);
  writeDB(db);
  res.json(city);
});

app.put('/api/cities/:id', (req, res) => {
  if(!req.user || req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const db = readDB();
  const idx = db.cities.findIndex(c => c.id === req.params.id);
  if(idx === -1) return res.status(404).json({ error: 'Not found' });
  db.cities[idx] = req.body;
  writeDB(db);
  res.json(db.cities[idx]);
});

app.delete('/api/cities/:id', (req, res) => {
  if(!req.user || req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const db = readDB();
  db.cities = db.cities.filter(c => c.id !== req.params.id);
  writeDB(db);
  res.json({ ok: true });
});

app.post('/api/reports', (req, res) => {
  const db = readDB();
  const report = req.body;
  report.id = String(Date.now());
  report.createdAt = new Date().toISOString();
  report.status = 'open';
  db.reports.push(report);
  writeDB(db);
  res.json(report);
});

app.get('/api/reports', (req, res) => {
  // only admin can view full reports
  if(!req.user || req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const db = readDB();
  res.json(db.reports);
});

app.put('/api/reports/:id', (req, res) => {
  if(!req.user || req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const db = readDB();
  const idx = db.reports.findIndex(r => r.id === req.params.id);
  if(idx === -1) return res.status(404).json({ error: 'Not found' });
  db.reports[idx] = { ...db.reports[idx], ...req.body };
  writeDB(db);
  res.json(db.reports[idx]);
});

app.delete('/api/reports/:id', (req, res) => {
  if(!req.user || req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  const db = readDB();
  db.reports = db.reports.filter(r => r.id !== req.params.id);
  writeDB(db);
  res.json({ ok: true });
});

app.post('/api/ai/analyze-report', (req, res) => {
  const { description } = req.body;
  // Mock AI analysis
  const categories = ['Infrastructure', 'Environment', 'Safety', 'Traffic'];
  const priorities = ['Low', 'Medium', 'High', 'Critical'];
  const suggestions = [
    'Monitor the situation.',
    'Schedule maintenance.',
    'Inspect and repair immediately.',
    'Alert emergency services.'
  ];
  const analysis = {
    category: categories[Math.floor(Math.random() * categories.length)],
    priority: priorities[Math.floor(Math.random() * priorities.length)],
    suggestion: suggestions[Math.floor(Math.random() * suggestions.length)]
  };
  res.json(analysis);
});

app.get('/api/ai-actions', (req, res) => {
  const db = readDB();
  // Simulate AI generating actions based on reports and time
  const now = new Date();
  const hour = now.getHours();
  if (db.reports.some(r => r.status === 'open')) {
    // If there are open reports, generate a response action
    const action = {
      id: String(Date.now()),
      type: 'Response',
      action: 'Dispatch maintenance team',
      location: 'Reported Area',
      timestamp: now.toISOString(),
      status: 'Pending'
    };
    db.aiActions.push(action);
    writeDB(db);
  }
  if (hour >= 18 || hour < 6) {
    // Evening/night: turn on lights
    const lightAction = {
      id: String(Date.now() + 1),
      type: 'Lighting',
      action: 'Activate street lighting',
      location: 'Citywide',
      timestamp: now.toISOString(),
      status: 'Executed'
    };
    db.aiActions.push(lightAction);
    writeDB(db);
  }
  res.json(db.aiActions);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API server listening on port ${PORT}`));
