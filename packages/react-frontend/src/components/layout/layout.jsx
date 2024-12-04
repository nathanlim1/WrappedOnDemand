import { useLocation } from "react-router-dom";
import Navbar from "../navbar/navbar";
import TimeRangeSelector from "../timerangeSelector/timerangeSelector";
import "./layout.css";

function Layout({ children, loggedIn, timeRange, setTimeRange }) {
  const location = useLocation();

  // Define routes where the time range selector should not be shown
  const dontShow = ["/login"];

  // Determine whether to show the Navbar

  // Determine whether to show the TimeRangeSelector
  const showNavAndTimeSelector = !dontShow.includes(
    location.pathname
  );

  // Add a conditional class based on whether the Navbar is shown (make space for navbar)
  const containerClass = showNavAndTimeSelector
    ? "page-container with-navbar"
    : "page-container";

  return (
    <>
      {showNavAndTimeSelector && (
        <>
          <Navbar/>
            <TimeRangeSelector
              currentRange={timeRange}
              setRange={setTimeRange}
              loggedIn={loggedIn}
            />
        </>
      )}
      <div className={containerClass}>{children}</div>
    </>
  );
}

export default Layout;
