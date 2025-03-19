// import React, { useState } from "react";
// import "./ContestTable.css";
// import { BellRing } from "lucide-react";
// import Modal from "react-modal";
// import { toast, ToastContainer, Flip } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// Modal.setAppElement("#root");

// export default function ContestTable({ title, filteredData }) {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedContest, setSelectedContest] = useState(null);
//   const [reminderTime, setReminderTime] = useState(null);
//   const [userEmail, setUserEmail] = useState(""); // New state for email input
//   const [showEmailInput, setShowEmailInput] = useState(false); // Controls email input visibility

//   const openModal = (contest) => {
//     setSelectedContest(contest);
//     setIsModalOpen(true);
//     setShowEmailInput(false); // Reset email input visibility
//     setReminderTime(null); // Reset reminder time
//     setUserEmail(""); // Clear email input field
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setReminderTime(null);
//     setUserEmail("");
//     setShowEmailInput(false);
//   };

//   const handleReminder = (minutes) => {
//     if (!selectedContest) return;

//     const currentTime = new Date();
//     const [day, month, year] = selectedContest.startDate.split("/");
//     let [time, modifier] = selectedContest.startTime.split(" ");
//     let [hours, minutesStr, seconds] = time.split(":").map(Number);

//     if (modifier === "PM" && hours < 12) hours += 12;
//     if (modifier === "AM" && hours === 12) hours = 0;

//     const contestTime = new Date(
//       year, month - 1, day, hours, minutesStr, seconds
//     );

//     if (isNaN(contestTime)) {
//       setReminderTime("Invalid contest date or time format.");
//       return;
//     }

//     const reminderDateTime = new Date(contestTime.getTime() - minutes * 60000);
//     if (reminderDateTime <= currentTime) {
//       setReminderTime("The reminder time has already passed.");
//       return;
//     }

//     setReminderTime(reminderDateTime.toLocaleString());
//     setShowEmailInput(true); // Show email input after selecting time
//   };

//   const confirmReminder = async () => {
//     if (!reminderTime || !selectedContest || !userEmail.trim()) {
//       toast.error("Please enter a valid email!");
//       return;
//     }

//     try {
//       const response = await fetch(
//         "http://localhost:5000/api/reminders/schedule",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             email: userEmail,
//             contestName: selectedContest.name,
//             reminderTime,
//           }),
//         }
//       );

//       const data = await response.json();
//       if (response.ok) {
//         toast.success(`Reminder set successfully for ${reminderTime}!`, {
//           autoClose: 3000,
//         });
//       } else {
//         toast.error(data.message || "Failed to set reminder");
//       }
//     } catch (error) {
//       console.error("Error setting reminder:", error);
//       toast.error("Error setting reminder");
//     }

//     closeModal();
//   };

//   return (
//     <div className="table-container">
//       <h2 className="contest-title">{title}</h2>
//       <table className="contest-table">
//         <thead>
//           <tr>
//             <th>Contest Name</th>
//             <th>Start Date</th>
//             <th>Start Time</th>
//             <th>Duration</th>
//             <th>Platform</th>
//             <th className="w-14">Notify Me</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredData.length > 0 ? (
//             filteredData.map((contest, index) => (
//               <tr key={index}>
//                 <td>
//                   <a
//                     href={contest.url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="contest-link"
//                   >
//                     {contest.name}
//                   </a>
//                 </td>
//                 <td>{contest.startDate}</td>
//                 <td>{contest.startTime}</td>
//                 <td>{contest.duration}</td>
//                 <td>{contest.platform}</td>
//                 <td>
//                   <BellRing
//                     className="icon bell-icon"
//                     onClick={() => openModal(contest)}
//                   />
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="6" className="no-data">
//                 No contests available.
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>

//       <Modal
//         isOpen={isModalOpen}
//         onRequestClose={closeModal}
//         contentLabel="Reminder Modal"
//         className="modal"
//         overlayClassName="overlay"
//       >
//         <h2>🔔 Set a Reminder</h2>
//         <p>Select when you'd like to be reminded:</p>

//         <div className="reminder-options">
//           {[15, 30, 45, 60].map((min) => (
//             <button key={min} onClick={() => handleReminder(min)}>
//               {min} min before
//             </button>
//           ))}
//         </div>

//         {showEmailInput && (
//           <div className="email-input-container fade-in">
//             <label htmlFor="email">Enter your Email:</label>
//             <input
//               type="email"
//               id="email"
//               placeholder="yourname@example.com"
//               value={userEmail}
//               onChange={(e) => setUserEmail(e.target.value)}
//             />
//           </div>
//         )}

//         {reminderTime && showEmailInput && (
//           <div className="confirmation">
//             <p>
//               Confirm reminder for: <strong>{reminderTime}</strong>
//             </p>
//             <button className="confirm-btn" onClick={confirmReminder}>
//               Confirm
//             </button>
//           </div>
//         )}

//         <button className="close-btn" onClick={closeModal}>
//           Close
//         </button>
//       </Modal>

//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         closeOnClick
//         pauseOnHover
//         draggable
//         transition={Flip}
//       />
//     </div>
//   );
// }


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
  const [userEmail, setUserEmail] = useState(""); // Email state
  const [showEmailInput, setShowEmailInput] = useState(false); // Show/hide email input
  const [emailError, setEmailError] = useState(""); // Email validation error
  const [reminders, setReminders] = useState(() => {
    const savedReminders = localStorage.getItem("reminders");
    return savedReminders ? JSON.parse(savedReminders) : {};
  });

  const getContestId = (contest) =>
    `${contest.name}-${contest.startDate}-${contest.startTime}`;
  const getContestUrl = (contest)=>
    `${contest.url}`;
 
  const openModal = (contest) => {
    setSelectedContest(contest);
    setIsModalOpen(true);
    setShowEmailInput(false);
    setReminderTime(null);
    setUserEmail("");
    setEmailError("");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setReminderTime(null);
    setUserEmail("");
    setShowEmailInput(false);
    setEmailError("");
  };

  const handleReminder = (minutes) => {
    if (!selectedContest) return;

    const currentTime = new Date();
    const [day, month, year] = selectedContest.startDate.split("/");
    let [time, modifier] = selectedContest.startTime.split(" ");
    let [hours, minutesStr, seconds] = time.split(":").map(Number);

    if (modifier === "PM" && hours < 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    const contestTime = new Date(
      year, month - 1, day, hours, minutesStr, seconds
    );

    if (isNaN(contestTime)) {
      setReminderTime("Invalid contest date or time format.");
      return;
    }

    const reminderDateTime = new Date(contestTime.getTime() - minutes * 60000);
    if (reminderDateTime <= currentTime) {
      setReminderTime("The reminder time has already passed.");
      return;
    }

    setReminderTime(reminderDateTime.toLocaleString());
    setShowEmailInput(true);
  };

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleEmailChange = (e) => {
    setUserEmail(e.target.value);
    if (!validateEmail(e.target.value)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  };

  const confirmReminder = async () => {
    if (!reminderTime || !selectedContest) return;
    if (!userEmail.trim() || !validateEmail(userEmail)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    const contestId = getContestId(selectedContest);
    const contestUrl = getContestUrl(selectedContest);
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
            email: userEmail,
            contestName: selectedContest.name,
            reminderTime,
            contestUrl: contestUrl,
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
              const contestUrl  = getContestUrl(contest);
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
        <h2>🔔 Set a Reminder</h2>
        <p>Select when you'd like to be reminded:</p>

        <div className="reminder-options">
          {[15, 30, 45, 60].map((min) => (
            <button key={min} onClick={() => handleReminder(min)}>
              {min} min before
            </button>
          ))}
        </div>

        {showEmailInput && (
          <div className="email-input-container fade-in">
            <label htmlFor="email">Enter your Email:</label>
            <input
              type="email"
              id="email"
              placeholder="yourname@example.com"
              value={userEmail}
              onChange={handleEmailChange}
              className={emailError ? "input-error" : ""}
            />
            {emailError && <p className="error-text">{emailError}</p>}
          </div>
        )}

        {reminderTime && showEmailInput && (
          <div className="confirmation">
            <p>
              Confirm reminder for: <strong>{reminderTime}</strong>
            </p>
            <button className="confirm-btn" onClick={confirmReminder}>
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
