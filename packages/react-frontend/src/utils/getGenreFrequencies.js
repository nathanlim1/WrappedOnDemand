
export function getNGenreFrequencies(maxGenres, artists) {
    const artistGenres = artists.map((a) => a.genres);
    const genres = artistGenres.flat();
    const genreFrequencies = genres.reduce((acc, item) => {
        acc[item] = (acc[item] || 0) + 1; 
        return acc;
      }, {});
    const genresFrequenciesSorted = Object.entries(genreFrequencies).sort((a, b) => b[1] - a[1]);
    const slicedGenres = genresFrequenciesSorted.slice(0, maxGenres);
    const genresAlphabeticalOrder = slicedGenres.sort((a, b) => {
        if (a[0] < b[0]) return -1; 
        if (a[0] > b[0]) return 1;
        return 0;
    });
    return genresAlphabeticalOrder;
};