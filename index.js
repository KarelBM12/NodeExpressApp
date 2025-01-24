const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const JobData = require("./Jobdata");

dotenv.config();

const app = express();


const allowedOrigins = ["http://localhost:5174", "https://api-karel.azurewebsites.net/"];
app.use(cors({ origin: allowedOrigins, credentials: true }));


app.use(bodyParser.json());


app.post("/api/formdata", async (req, res) => {
      try {
          const formData = new JobData(req.body);
          await formData.save();
          res.status(200).json({ message: "Form data saved successfully", _id: formData._id });
      } catch (error) {
          console.error("Error saving form data:", error);
          res.status(500).json({ message: "Error saving form data", error: error.message });
      }
  });
  
  app.put("/api/formdata/:id", async (req, res) => {
      try {
          const { id } = req.params;
          const updatedFormData = await JobData.findByIdAndUpdate(id, req.body, { new: true });
          if (!updatedFormData) {
              return res.status(404).json({ message: "Form data not found" });
          }
          res.status(200).json({ message: "Form data updated successfully", data: updatedFormData });
      } catch (error) {
          console.error("Error updating form data:", error);
          res.status(500).json({ message: "Error updating form data", error: error.message });
      }
  });
  
  app.get("/api/formdata", async (req, res) => {
      try {
          const formData = await JobData.find();
          res.json(formData);
      } catch (error) {
          console.error("Error fetching form data:", error);
          res.status(500).json({ message: "Error fetching form data", error: error.message });
      }
  });


const PORT = process.env.PORT || 8300;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

console.log("MONGODB_AC:", "sucess");

mongoose
    .connect(process.env.MONGODB_AC)
    .then(() => console.log("MongoDB Connected"))
    .catch((error) => {
        console.error("MongoDB Connection Error:", error.message);
        process.exit(1);
    });




