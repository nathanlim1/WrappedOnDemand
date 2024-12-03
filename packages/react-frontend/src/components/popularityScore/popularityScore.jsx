import React, { useState, useEffect } from 'react';
import { useSpotifyApi } from '../SpotifyContext';

function PopularityScore({ n, time_range }) {

    const spotifyApi = useSpotifyApi();

    // State to hold the calculated average popularity score
    const [averagePopularity, setAveragePopularity] = useState(null);

    // Effect to fetch top artists and calculate average popularity when component mounts or dependencies change
    useEffect(() => {
        // Asynchronous function to fetch top artists and compute average popularity
        const fetchTopArtists = async () => {
            try {
                const limit = Math.min(n, 50);

                // Fetch the user's top artists based on the specified time range and limit
                const response = await spotifyApi.getMyTopArtists({ time_range, limit });

                // Extract the list of artist objects from the response
                const artists = response.items;

                // Check if any artists were returned
                if (artists.length > 0) {
                    // Calculate the total popularity score by summing individual artist popularity
                    const totalPopularity = artists.reduce((sum, artist) => sum + artist.popularity, 0);

                    // Compute the average popularity score
                    const avgPopularity = totalPopularity / artists.length;

                    // Update the state with the calculated average popularity
                    setAveragePopularity(avgPopularity);
                } else {
                    // If no artists are returned, set average popularity to 0
                    setAveragePopularity(0);
                }
            } catch (error) {
                // Log any errors encountered during the fetch operation
                console.error('Error fetching top artists:', error);

                // Set average popularity to null to indicate an error state
                setAveragePopularity(null);
            }
        };

        // Invoke the asynchronous function to fetch data
        fetchTopArtists();
    }, [spotifyApi, time_range, n]); // Dependencies: spotifyApi instance, time_range, and n

    // Render the component UI
    return (
        <div>
            <h2>Average Popularity Score</h2>
            {averagePopularity !== null ? (
                // Display the average popularity score formatted to two decimal places
                <p>{averagePopularity.toFixed(2)} / 100</p>
            ) : (
                // Display a loading message while data is being fetched
                <p>Loading...</p>
            )}
        </div>
    );
}

export default PopularityScore ;
