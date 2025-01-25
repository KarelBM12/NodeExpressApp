const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const http = require("http");
const JobData = require("./Jobdata");

dotenv.config();

const app = express();

// Allow CORS with proper configuration
const allowedOrigins = [
  "http://localhost:5176",
  "https://api-mirana.azurewebsites.net",
  "https://jolly-rock-0d59e9600.4.azurestaticapps.net"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Not allowed by CORS: ${origin}`));
      }
    },
    methods: ["GET", "POST", "PUT", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Allow cookies and credentials
  })
);

// Handle preflight requests
app.options("*", cors());

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// MongoDB connection
const mongoUri = process.env.MONGODB_AC;
if (!mongoUri) {
  console.error("MONGODB_AC is not defined in the environment variables");
  process.exit(1);
}

mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 30000,
    socketTimeoutMS: 45000,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((error) => {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1);
  });

// API routes
app.get("/api/formdata", async (req, res) => {
  try {
    const formData = await JobData.find();
    res.json(formData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/formdata", async (req, res) => {
  const formData = new JobData(req.body);
  try {
    const newFormData = await formData.save();
    res.status(201).json(newFormData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put("/api/formdata/:id", async (req, res) => {
  try {
    const updatedFormData = await JobData.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedFormData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Start the server
const port = process.env.PORT || 8482;

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
