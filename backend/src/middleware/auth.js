const jwt = require('jsonwebtoken');

function auth(required = true) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) {
      if (required) return res.status(401).json({ error: 'Missing token' });
      return next();
    }
    try {
      const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      req.user = { id: payload.sub, roles: payload.roles || [] };
      return next();
    } catch (err) {
      if (required) return res.status(401).json({ error: 'Invalid or expired token' });
      return next();
    }
  };
}

function requireRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const userRoles = req.user.roles || [];
    const ok = roles.some(r => userRoles.includes(r));
    if (!ok) return res.status(403).json({ error: 'Forbidden' });
    next();
  };
}

module.exports = { auth, requireRoles };
