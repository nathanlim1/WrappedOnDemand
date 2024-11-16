// Averages the popularity of the artists
// Avg score is from 0 to 100 where 0 is unpopular and 100 is very popular
export function getPopularityScore(artists) {
    const popScores = artists.map((a) => a.popularity);
    const avgPopScore = popScores.reduce((sum, number) => sum + number, 0) / popScores.length;
    console.log("Avg popscore: ", avgPopScore);
    return avgPopScore
}