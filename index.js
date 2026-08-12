const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Basic health check endpoint
// Monitoring tools (and later, Docker/AWS) will call this
// to know if the app is running correctly.
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.get('/', (req, res) => {
  res.send('ResQOps is running');
});

app.listen(PORT, () => {
  console.log(`ResQOps listening on port ${PORT}`);
});