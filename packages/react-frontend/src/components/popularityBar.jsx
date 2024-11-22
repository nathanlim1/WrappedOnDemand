import React, { useState, useEffect } from "react";
import { getPopularityScore } from "../utils/getPopularityScore";

const PopularityBar = ({ artists }) => {
  const [percentage, setPercentage] = useState(0); // Start from 0 for animation

  useEffect(() => {
    const score = getPopularityScore(artists).toFixed(1);
    setTimeout(() => setPercentage(score), 100); // Delay to trigger animation
  }, [artists]);

  return (
    <section className="flex justify-center bg-zinc-800 py-8 px-8">
      <div className="w-3/4">
        <div className="flex justify-between mb-2">
          <span className="text-2xl font-bold">Popularity Score</span>
          <span className="text-2xl font-bold">{(percentage / 10).toFixed(1)}/10</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
          <div
            className="h-4 rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${percentage}%`,
              backgroundColor: "#4caf50",
            }}
          ></div>
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-sm text-gray-300">The average popularity of the artists you listen to</span>
        </div>
      </div>
    </section>
  );
};

export default PopularityBar;