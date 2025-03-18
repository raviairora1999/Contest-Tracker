import React, { useState } from "react";
import "./ContestTable.css";
import { BellRing } from "lucide-react";
import Modal from "react-modal";
import { toast, ToastContainer, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

Modal.setAppElement("#root");

export default function ContestTable({ title, filteredData }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContest, setSelectedContest] = useState(null);
  const [reminderTime, setReminderTime] = useState(null);
  const [reminders, setReminders] = useState(() => {
    const savedReminders = localStorage.getItem("reminders");
    return savedReminders ? JSON.parse(savedReminders) : {};
  });

  // Generate a unique ID for each contest
  const getContestId = (contest) =>
    `${contest.name}-${contest.startDate}-${contest.startTime}`;

  const openModal = (contest) => {
    setSelectedContest(contest);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setReminderTime(null);
  };

  const handleReminder = async (minutes) => {
    if (!selectedContest) return;

    const currentTime = new Date();

    if (!selectedContest.startDate || !selectedContest.startTime) {
      setReminderTime("Invalid contest date or time.");
      return;
    }

    const [day, month, year] = selectedContest.startDate.split("/");
    let [time, modifier] = selectedContest.startTime.split(" ");
    let [hours, minutesStr, seconds] = time.split(":").map(Number);

    if (modifier === "PM" && hours < 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    const contestTime = new Date(
      year,
      month - 1,
      day,
      hours,
      minutesStr,
      seconds
    );
    if (isNaN(contestTime)) {
      setReminderTime("Invalid contest date or time format.");
      return;
    }

    const reminderDateTime = new Date(contestTime.getTime() - minutes * 60000);
    if (reminderDateTime <= currentTime) {
      setReminderTime(
        "The contest has already started or the reminder time has passed."
      );
      return;
    }

    setReminderTime(reminderDateTime.toLocaleString());
  };

  const confirmReminder = async () => {
    if (!reminderTime || !selectedContest) return;

    const contestId = getContestId(selectedContest);
    const updatedReminders = { ...reminders, [contestId]: true };

    setReminders(updatedReminders);
    localStorage.setItem("reminders", JSON.stringify(updatedReminders));

    try {
      const response = await fetch(
        "http://localhost:5000/api/reminders/schedule",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "user@example.com", // Replace with the actual user's email
            contestName: selectedContest.name,
            reminderTime,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        toast.success(`Reminder set successfully for ${reminderTime}!`, {
          autoClose: 3000,
        });
      } else {
        toast.error(data.message || "Failed to set reminder");
      }
    } catch (error) {
      console.error("Error setting reminder:", error);
      toast.error("Error setting reminder");
    }

    closeModal();
  };

  return (
    <div className="table-container">
      <h2 className="contest-title">{title}</h2>
      <table className="contest-table">
        <thead>
          <tr>
            <th>Contest Name</th>
            <th>Start Date</th>
            <th>Start Time</th>
            <th>Duration</th>
            <th>Platform</th>
            <th className="w-14">Notify Me</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((contest, index) => {
              const contestId = getContestId(contest);
              return (
                <tr key={index}>
                  <td>
                    <a
                      href={contest.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contest-link"
                    >
                      {contest.name}
                    </a>
                  </td>
                  <td>{contest.startDate}</td>
                  <td>{contest.startTime}</td>
                  <td>{contest.duration}</td>
                  <td>{contest.platform}</td>
                  <td>
                    <BellRing
                      className={`icon bell-icon ${
                        reminders[contestId] ? "reminder-active" : ""
                      }`}
                      onClick={() => openModal(contest)}
                    />
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="6" className="no-data">
                No contests available.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Reminder Modal"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>🔔 Remind Me</h2>
        <p>Select when you'd like to be reminded:</p>

        <div className="reminder-options">
          {[15, 30, 45, 60].map((min) => (
            <button key={min} onClick={() => handleReminder(min)}>
              {min} minutes before
            </button>
          ))}
        </div>

        {reminderTime && (
          <div className="confirmation">
            <p>
              Confirm reminder for: <strong>{reminderTime}</strong>
            </p>
            <button
              className="confirm-btn"
              onClick={confirmReminder}
              disabled={reminderTime && reminderTime.includes("passed")}
            >
              Confirm
            </button>
          </div>
        )}

        <button className="close-btn" onClick={closeModal}>
          Close
        </button>
      </Modal>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        transition={Flip}
      />
    </div>
  );
}
