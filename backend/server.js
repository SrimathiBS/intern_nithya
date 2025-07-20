const express = require("express");
const path = require("path");
const app = express();

// Middleware to handle form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from the frontend folder
app.use(express.static(path.join(__dirname, "../frontend")));

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/register.html"));
});

app.post("/register", (req, res) => {
  const { username, email, phone, gender, dob, password } = req.body;
  console.log("User registered:", req.body);

  // You can add MongoDB saving code here later
  res.send("Registration successful!");
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
