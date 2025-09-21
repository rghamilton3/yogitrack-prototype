const express = require("express");
const path = require("path");
const app = express();

// Serve static files from the public dir
app.use(express.static("public"));
app.use(express.json());

// API routes
app.use("/api/instructor", require("./routes/instructorRoutes.cjs"));
app.use("/api/customer", require("./routes/customerRoutes.cjs"));

// Serve React app for specific routes
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

app.get('/instructors', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

app.get('/customers', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});



// Start the web server
const PORT = process.env.PORT || 8080;
app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}...`);
  console.log('Open http://localhost:8080/index.html in your browser to view the app.');
});
