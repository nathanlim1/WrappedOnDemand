import allGenres from "../../../../genres.json"

// Gets the top N genres for the user, based on the artists given
export function getUsersTopNGenreCounts(maxGenres, artists) {
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

// Gets the counts for the all general genres (see genres.json), based on the artists given
export function getUsersGeneralGenreCounts(artists) {
    const genres = ["pop", "electronic", "hip-hop", "r&b", "latin", "rock", "metal",
        "country", "folk", "classical", "jazz", "blues", "easy-listening", "new-age", "world"]

    function numArtistsInThisGenre(artists, genre) {

        function isArtistInThisGenre(artist, genre) {
            const artistGenres = artist.genres
            const subgenres = allGenres[genre]

            // If any of the artist's genres are included in the target genre, then the artist has that genre
            return artistGenres.some(artistGenre => subgenres.includes(artistGenre))
        }

        return artists.filter(artist => isArtistInThisGenre(artist, genre)).length;

    }

    return genres.map((genre) => [genre, numArtistsInThisGenre(artists, genre)]);
}