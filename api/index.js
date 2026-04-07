const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '..', 'server', 'db.json');
let db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));

const tokens = {
  admintoken: { role: 'admin', name: 'Admin' },
  usertoken: { role: 'user', name: 'User' }
};

function getAuthUser(req) {
  const auth = req.headers.authorization || '';
  const token = auth.replace('Bearer ', '');
  return tokens[token] || null;
}

async function parseBody(req) {
  if (req.method === 'GET' || req.method === 'DELETE') return {};
  const buffers = [];
  for await (const chunk of req) buffers.push(chunk);
  const raw = Buffer.concat(buffers).toString();
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch (err) {
    return {};
  }
}

function sendJson(res, payload, status = 200) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

function generateId() {
  return String(Date.now() + Math.floor(Math.random() * 1000));
}

function ensureRoute(req) {
  const parts = req.url.split('?')[0].split('/').filter(Boolean);
  if (parts[0] === 'api') return parts.slice(1);
  return parts;
}

module.exports = async (req, res) => {
  const body = await parseBody(req);
  const user = getAuthUser(req);
  const route = ensureRoute(req);
  const method = req.method;

  if (route.length === 0 && method === 'GET') {
    return sendJson(res, { message: 'API is working' });
  }

  if (route[0] === 'login' && method === 'POST') {
    const { username, password } = body;
    if (username === 'admin' && password === 'admin') {
      return sendJson(res, { token: 'admintoken', role: 'admin', name: 'Admin' });
    }
    if (username === 'user' && password === 'user') {
      return sendJson(res, { token: 'usertoken', role: 'user', name: 'User' });
    }
    return sendJson(res, { error: 'Invalid credentials' }, 401);
  }

  if (route[0] === 'cities') {
    if (route.length === 1) {
      if (method === 'GET') {
        return sendJson(res, db.cities);
      }
      if (method === 'POST') {
        if (!user || user.role !== 'admin') return sendJson(res, { error: 'Forbidden' }, 403);
        const city = { ...body, id: generateId() };
        db.cities.push(city);
        return sendJson(res, city);
      }
    }
    if (route.length === 2) {
      const id = route[1];
      const idx = db.cities.findIndex(c => c.id === id);
      if (idx === -1) return sendJson(res, { error: 'Not found' }, 404);
      if (method === 'PUT') {
        if (!user || user.role !== 'admin') return sendJson(res, { error: 'Forbidden' }, 403);
        db.cities[idx] = { ...db.cities[idx], ...body };
        return sendJson(res, db.cities[idx]);
      }
      if (method === 'DELETE') {
        if (!user || user.role !== 'admin') return sendJson(res, { error: 'Forbidden' }, 403);
        db.cities = db.cities.filter(c => c.id !== id);
        return sendJson(res, { ok: true });
      }
    }
  }

  if (route[0] === 'reports') {
    if (route.length === 1) {
      if (method === 'POST') {
        const report = {
          ...body,
          id: generateId(),
          createdAt: new Date().toISOString(),
          status: 'open'
        };
        db.reports.push(report);
        return sendJson(res, report);
      }
      if (method === 'GET') {
        if (!user || user.role !== 'admin') return sendJson(res, { error: 'Forbidden' }, 403);
        return sendJson(res, db.reports);
      }
    }
    if (route.length === 2) {
      const id = route[1];
      const idx = db.reports.findIndex(r => r.id === id);
      if (idx === -1) return sendJson(res, { error: 'Not found' }, 404);
      if (method === 'PUT') {
        if (!user || user.role !== 'admin') return sendJson(res, { error: 'Forbidden' }, 403);
        db.reports[idx] = { ...db.reports[idx], ...body };
        return sendJson(res, db.reports[idx]);
      }
      if (method === 'DELETE') {
        if (!user || user.role !== 'admin') return sendJson(res, { error: 'Forbidden' }, 403);
        db.reports = db.reports.filter(r => r.id !== id);
        return sendJson(res, { ok: true });
      }
    }
  }

  if (route[0] === 'ai') {
    if (route[1] === 'analyze-report' && method === 'POST') {
      const categories = ['Infrastructure', 'Environment', 'Safety', 'Traffic'];
      const priorities = ['Low', 'Medium', 'High', 'Critical'];
      const suggestions = [
        'Monitor the situation.',
        'Schedule maintenance.',
        'Inspect and repair immediately.',
        'Alert emergency services.'
      ];
      return sendJson(res, {
        category: categories[Math.floor(Math.random() * categories.length)],
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        suggestion: suggestions[Math.floor(Math.random() * suggestions.length)]
      });
    }
  }

  if (route[0] === 'ai-actions' && method === 'GET') {
    const now = new Date();
    const hour = now.getHours();
    if (db.reports.some(r => r.status === 'open')) {
      db.aiActions.push({
        id: generateId(),
        type: 'Response',
        action: 'Dispatch maintenance team',
        location: 'Reported Area',
        timestamp: now.toISOString(),
        status: 'Pending'
      });
    }
    if (hour >= 18 || hour < 6) {
      db.aiActions.push({
        id: generateId(),
        type: 'Lighting',
        action: 'Activate street lighting',
        location: 'Citywide',
        timestamp: now.toISOString(),
        status: 'Executed'
      });
    }
    return sendJson(res, db.aiActions);
  }

  return sendJson(res, { error: 'Not found' }, 404);
};
