const nodemailer = require("nodemailer");
const cron = require("node-cron");

let scheduledTasks = {}; // Store scheduled tasks by unique ID

const scheduleEmailReminder = (req, res) => {
  const { email, contestName, reminderTime } = req.body;

  if (!email || !contestName || !reminderTime) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const reminderDate = new Date(reminderTime);
  if (isNaN(reminderDate.getTime())) {
    return res.status(400).json({ message: "Invalid reminder time" });
  }

  // Create a unique ID for this reminder
  const reminderId = `${email}-${contestName}-${reminderTime}`;
  
  // Convert reminderTime to cron format
  const cronTime = `${reminderDate.getUTCMinutes()} ${reminderDate.getUTCHours()} ${reminderDate.getUTCDate()} ${reminderDate.getUTCMonth() + 1} *`;

  if (scheduledTasks[reminderId]) {
    return res.status(400).json({ message: "Reminder already scheduled" });
  }

  scheduledTasks[reminderId] = cron.schedule(cronTime, () => {
    sendEmailReminder(email, contestName);
    delete scheduledTasks[reminderId]; // Remove task after execution
  });

  return res.status(200).json({ message: "Reminder scheduled successfully" });
};

const sendEmailReminder = async (email, contestName) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Reminder: ${contestName} is starting soon!`,
      text: `Your contest "${contestName}" is about to start. Get ready!`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Reminder email sent to ${email}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = { scheduleEmailReminder };
