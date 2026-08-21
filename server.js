const express = require('express');
const app = express();

app.use(express.json());

// Stage 0: Root endpoint
app.get('/', (req, res) => {
  res.json({ name: "Task API", version: "1.0", endpoints: ["/tasks"] });
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
