import { useLocation } from "react-router-dom";
import Navbar from "../navbar/navbar";
import TimeRangeSelector from "../timerangeSelector/timerangeSelector";
import "./layout.css";

function Layout({ children, loggedIn, timeRange, setTimeRange }) {
  const location = useLocation();

  // Define routes where the time range selector should not be shown
  const noTimeSelectorRoutes = ["/sharing"];

  // Determine whether to show the Navbar
  const showNavbar = loggedIn;

  // Determine whether to show the TimeRangeSelector
  const showTimeRangeSelector = !noTimeSelectorRoutes.includes(
    location.pathname
  );

  // Add a conditional class based on whether the Navbar is shown (make space for navbar)
  const containerClass = showNavbar
    ? "page-container with-navbar"
    : "page-container";

  return (
    <>
      {showNavbar && (
        <>
          <Navbar loggedIn={loggedIn} />
          {showTimeRangeSelector && (
            <TimeRangeSelector
              currentRange={timeRange}
              setRange={setTimeRange}
              loggedIn={loggedIn}
            />
          )}
        </>
      )}
      <div className={containerClass}>{children}</div>
    </>
  );
}

export default Layout;
