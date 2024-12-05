import { useRef, useEffect } from 'react';
import './timerangeSelector.css';

const TimeRangeSelector = ({ currentRange, setRange }) => {
  const indicatorRef = useRef(null);

  useEffect(() => {
    const updateIndicator = () => {
      const activeButton = document.querySelector(`.selector-button.${currentRange}`);
      if (activeButton && indicatorRef.current) {
        indicatorRef.current.style.width = `${activeButton.offsetWidth}px`;
        indicatorRef.current.style.left = `${activeButton.offsetLeft}px`;
      }
    };

    // timeout to ensure the effect runs after the component and buttons are rendered
    const timeout = setTimeout(updateIndicator, 0);

    // clean up the timeout on component unmount
    return () => clearTimeout(timeout);
  }, [currentRange]);

  const handleButtonClick = (range) => {
    setRange(range);
  };

  return (
    <div className="notch-selector">
      <div className="indicator" ref={indicatorRef}></div>
      <button
        className={`selector-button ${currentRange === "short_term" ? "short_term active" : "short_term"}`}
        onClick={() => handleButtonClick("short_term")}
      >
        1 Month
      </button>
      <button
        className={`selector-button ${currentRange === "medium_term" ? "medium_term active" : "medium_term"}`}
        onClick={() => handleButtonClick("medium_term")}
      >
        6 Months
      </button>
      <button
        className={`selector-button ${currentRange === "long_term" ? "long_term active" : "long_term"}`}
        onClick={() => handleButtonClick("long_term")}
      >
        Lifetime
      </button>
    </div>
  );
};

export default TimeRangeSelector;
