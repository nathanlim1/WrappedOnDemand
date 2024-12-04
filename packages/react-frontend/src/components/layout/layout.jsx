import { useLocation } from "react-router-dom";
import Navbar from "../navbar/navbar";
import TimeRangeSelector from "../timerangeSelector/timerangeSelector";
import "./layout.css";

function Layout({ children, timeRange, setTimeRange }) {
  const location = useLocation();

  // Determine whether to show the TimeRangeSelector
  const showNavbarAndTimerangeselector = location.pathname != "/login" && location.pathname != "/"

  // Add a conditional class based on whether the Navbar is shown (make space for navbar)
  const containerClass = showNavbarAndTimerangeselector
    ? "page-container with-navbar"
    : "page-container";

  return (
    <>
      {showNavbarAndTimerangeselector && (
        <>
          <Navbar/>
            <TimeRangeSelector
              currentRange={timeRange}
              setRange={setTimeRange}
            />
        </>
      )}
      <div className={containerClass}>{children}</div>
    </>
  );
}

export default Layout;
