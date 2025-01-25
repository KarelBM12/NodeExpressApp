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
  "http://localhost:5173",
  "https://server-backend.azurewebsites.net",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error(`Not allowed by CORS: ${origin}`));
      }
    },
    methods: ["GET", "POST", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(bodyParser.json());

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
    const newFormData = await formData.save(); // Fixed save method
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

const port = process.env.PORT || 8482;

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`); // Fixed syntax error
});
