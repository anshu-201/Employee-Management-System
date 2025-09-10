const app = require('../server');

// Vercel expects a default-exported handler in /api/*
module.exports = (req, res) => app(req, res);


