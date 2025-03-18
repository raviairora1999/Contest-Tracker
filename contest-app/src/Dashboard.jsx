import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import "./styles.css";
import ContestTable from "./component/ContestTable";

const Button = ({ children, onClick, className }) => (
  <button onClick={onClick} className={`button ${className}`}>
    {children}
  </button>
);

export default function Dashboard() {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState("All Platforms");
  const [contestData, setContestData] = useState([]);
  const [error, setError] = useState(null);
  const [pastContest, setPastcontest] = useState([]);
  const [upcomingContest, setUpcomingcontest] = useState([]);

  var now = new Date();
  const pastDate = new Date();
  pastDate.setDate(now.getDate() - 8 );
  const nowString =
    pastDate.toISOString().substring(0, 11) + now.toISOString().substring(11, 19);

  var todayStart  = new Date();
  todayStart.setDate(todayStart.getDate() - 8);
  todayStart.setHours(0, 0, 0);

  var todayStartString =
    todayStart.toISOString().substring(0, 11) +
    todayStart.toISOString().substring(11, 19);
  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0);

  var host;
  host = ["leetcode.com", "codeforces.com", "codechef.com"];
  var apiData = [];

  function filterDataAccordingToDate() {
    const pastContests = [];
    const upcomingContests = [];

    const now = new Date(); // Current Date and Time
    console.log('size>>>' , apiData.length);
    apiData.forEach((contest) => {
      // console.log(contest);
      // console.log(typeof(contest.start));
      const contStart = new Date(contest.start + `Z`);
      // Convert Start Time
      const contEnd = new Date(contest.end + `Z`); // Convert End Time

      // Check if contest belongs to any host in the `host` array
      // console.log('here23');
      if (host.includes(contest.resource)) {
        const minutes = (parseInt(contest.duration) / 60) % 60;
        const hours = parseInt((parseInt(contest.duration) / 3600) % 24);
        const days = parseInt(parseInt(contest.duration) / 3600 / 24);

        let dur = "";
        if (days > 0) dur += `${days} days `;
        if (hours > 0) dur += `${hours} hours `;
        if (minutes > 0) dur += `${minutes} minutes `;

        // Format Start Date & Time
        let start = contStart.toLocaleString("en-US");
        const time = start.split(", ");
        const date = time[0].split("/");

        // Prepare contest entry
        const contestEntry = {
          name: contest.event,
          startDate: `${date[1]}/${date[0]}/${date[2]}`,
          startTime: time[1],
          duration: dur,
          platform: contest.resource,
          url: contest.href,
        };

        // Categorize contest into upcoming or past
        var future7Day = new Date();
        future7Day.setDate(now.getDate() + 10);
        if (contStart >= now) {
          if(contEnd < future7Day) upcomingContests.push(contestEntry);
        } else {
          pastContests.push(contestEntry);
        }
      }
      console.log("here23");
    });

    console.log("Upcoming Contests347143:", upcomingContests);
    console.log("Past Contests3871471:", pastContests);

    setUpcomingcontest(upcomingContests);
    setPastcontest(pastContests);
  }


  const fetchContests = async () => {
    try {
      console.log("here");
      let apiUrl =
        "https://clist.by:443/api/v4/contest/?username=shantanu101&api_key=9396e46cf4572cd47b87a632ef6a91f547d84886&format=json&order_by=start&limit=1000";
      apiUrl = apiUrl + `&end__gt=${nowString}&start__gt=${todayStartString}`;
      console.log('here>>>>>> ' + apiUrl);
      const response = await fetch(apiUrl, {
        method: "GET",
      });
      console.log("here");


      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      apiData = data.objects || [];
      console.log('hello'  , apiData);
      if(apiData ) filterDataAccordingToDate();

      // setContests(contests);
    } catch (err) {
      throw new Error(`error in fethching `);
    } finally {
      //setLoading(false);
    }
  };

  useEffect(() => {
    fetchContests();
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (
      savedTheme === "dark" ||
      (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setDarkMode(false);
    }
  }, []);

  const toggleTheme = () => {
    setDarkMode((prev) => {
      const newTheme = !prev;
      localStorage.setItem("theme", newTheme ? "dark" : "light");
      document.documentElement.classList.toggle("dark", newTheme);
      return newTheme;
    });
  };

  const platforms = ["All Platforms", "LeetCode", "CodeChef", "CodeForces"];

  const filterByPlatform = (contests) => {
    if (selectedPlatform === "All Platforms") return contests;
    const platformMap = {
      LeetCode: "leetcode.com",
      CodeChef: "codechef.com",
      CodeForces: "codeforces.com",
    };
    return contests.filter(
      (contest) => contest.platform === platformMap[selectedPlatform]
    );
  };

  const currentDate = new Date();

  const filteredData =
    selectedPlatform === "All Platforms"
      ? Object.values(contestData).flat()
      : contestData[selectedPlatform] || [];

  return (
    <div className="dashboard">
      <div className="header">
        <div className="center-container">
          <div className="contest-title">Contest Tracker</div>
        </div>
        <Button onClick={toggleTheme} className="theme-toggle">
          {darkMode ? (
            <Sun className="icon sun" />
          ) : (
            <Moon className="icon moon" />
          )}
        </Button>
      </div>

      <div className="platform-buttons">
        {platforms.map((platform) => (
          <Button
            key={platform}
            onClick={() => setSelectedPlatform(platform)}
            className={`platform-button ${
              platform === "LeetCode"
                ? "leetcode"
                : platform === "CodeChef"
                ? "codechef"
                : platform === "CodeForces"
                ? "codeforces"
                : "all"
            } ${selectedPlatform === platform ? "active" : ""}`}
          >
            {platform}
          </Button>
        ))}
      </div>

      <ContestTable
        title="Upcoming Contests"
        filteredData={filterByPlatform(upcomingContest)}
      />
      <ContestTable
        title="Past Contests"
        filteredData={filterByPlatform(pastContest)}
      />
    </div>
  );
}
