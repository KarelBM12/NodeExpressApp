const mongoose = require("mongoose");

const formDataSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: String, required: true },
  email: { type: String, required: true },
  experience: { type: String, required: true },
  jobRole: { type: String, required: true },
  company: { type: String, required: true },
});

const JobData = mongoose.model("FormData", formDataSchema);

module.exports = JobData;