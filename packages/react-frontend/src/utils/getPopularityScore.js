// Averages the popularity of the artists
// Avg score is from 0 to 100 where 0 is unpopular and 100 is very popular
export function getPopularityScore(artists) {
    const totalWeight = artists.length * (artists.length + 1) / 2; 
    const weightedSum = artists.reduce((sum, artist, index) => {
        const weight = artists.length - index; // Higher weight for earlier artists
        return sum + artist.popularity * weight;
    }, 0);

    const weightedAvgPopScore = weightedSum / totalWeight;
    console.log("Weighted Avg popscore: ", weightedAvgPopScore);
    return weightedAvgPopScore;

}