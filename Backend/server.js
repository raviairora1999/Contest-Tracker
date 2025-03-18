require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const reminderRoutes = require("./router/reminderRoutes");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api/reminders", reminderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
