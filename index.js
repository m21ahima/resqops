const express = require('express');
const client = require('prom-client');

const app = express();
app.use(express.static('public'));
const PORT = process.env.PORT || 3000;

client.collectDefaultMetrics();

const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status']
});

// Tracks whether the app is currently in a "forced unhealthy" state
let isCrashed = false;

app.use((req, res, next) => {
  res.on('finish', () => {
    httpRequestCounter.inc({
      method: req.method,
      route: req.path,
      status: res.statusCode
    });
  });
  next();
});

app.get('/health', (req, res) => {
  if (isCrashed) {
    // Report unhealthy on purpose — this is what Docker/monitoring will detect
    return res.status(500).json({ status: 'unhealthy', uptime: process.uptime() });
  }
  res.json({ status: 'ok', uptime: process.uptime() });
});



app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

// Simulate a crash: flips the app into "unhealthy" mode
// Doesn't actually kill the process — just makes /health start failing,
// which is exactly what a real bug (e.g. a broken DB connection) looks like
// from the outside.
app.get('/simulate-crash', (req, res) => {
  isCrashed = true;
  res.json({ message: 'App is now simulating a crash. /health will report unhealthy.' });
});

// Recovery endpoint: manually flip back to healthy
// (later, this is what an automated rollback would call, or you call it
// yourself during a demo to show recovery)
app.get('/recover', (req, res) => {
  isCrashed = false;
  res.json({ message: 'App has recovered. /health will report healthy again.' });
});

// Simulate slow responses: adds artificial delay
// Useful for showing latency spikes on your Grafana dashboard
app.get('/simulate-slow', (req, res) => {
  const delayMs = 3000;
  setTimeout(() => {
    res.json({ message: `Responded after ${delayMs}ms delay` });
  }, delayMs);
});

app.listen(PORT, () => {
  console.log(`ResQOps listening on port ${PORT}`);
});