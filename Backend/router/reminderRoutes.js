const express = require("express");
const { scheduleEmailReminder } = require("../controllers/reminderController");

const router = express.Router();

router.post("/schedule", scheduleEmailReminder);

module.exports = router;
