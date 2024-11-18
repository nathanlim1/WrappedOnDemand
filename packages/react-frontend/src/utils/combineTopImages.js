import { createCanvas, loadImage } from 'canvas';

/**
 * Fetch and combine the top 4 artists or tracks from Spotify into a 2x2 image grid.
 * @param {Object} spotifyApi - The Spotify Web API instance.
 * @param {string} type - 'artists' or 'tracks'.
 * @param {string} timeRange - 'short_term', 'medium_term', or 'long_term'.
 * @returns {Promise<Buffer>} - A promise that resolves to a PNG image buffer.
 */
async function combineTopImages(spotifyApi, type = 'artists', timeRange = 'medium_term') {

    console.log('Spotify API:', spotifyApi);
    console.log('Type:', type);
    console.log('Time Range:', timeRange);



    if (!spotifyApi) {
        throw new Error('Spotify API instance is required.');
    }
    if (!['artists', 'tracks'].includes(type)) {
        throw new Error('Invalid type. Use "artists" or "tracks".');
    }
    if (!['short_term', 'medium_term', 'long_term'].includes(timeRange)) {
        throw new Error('Invalid time range. Use "short_term", "medium_term", or "long_term".');
    }

    // Fetch the top 4 items (artists or tracks)
    const fetchTopItems = async () => {
        if (type === 'artists') {
            return spotifyApi.getMyTopArtists({ time_range: timeRange, limit: 4 });
        } else {
            return spotifyApi.getMyTopTracks({ time_range: timeRange, limit: 4 });
        }
    };

    // Fetch data from Spotify API
    const response = await fetchTopItems();
    const imageUrls = response.items.map((item) => item.images?.[0]?.url).filter(Boolean);

    if (imageUrls.length < 4) {
        throw new Error('Not enough images to create a collage. At least 4 are required.');
    }

    // Combine the images into a 2x2 grid
    const canvasSize = 400; // 400x400 pixels
    const imageSize = canvasSize / 2; // Each image is 200x200 pixels
    const canvas = createCanvas(canvasSize, canvasSize);
    const ctx = canvas.getContext('2d');

    // Load and draw images
    const loadedImages = await Promise.all(
        imageUrls.map((url) => loadImage(url).catch((err) => {
            console.error(`Failed to load image from URL: ${url}`, err);
            throw err;
        }))
    );

    loadedImages.forEach((img, index) => {
        const x = (index % 2) * imageSize; // 0 or 200
        const y = Math.floor(index / 2) * imageSize; // 0 or 200
        ctx.drawImage(img, x, y, imageSize, imageSize);
    });

    return canvas.toBuffer(); // Return PNG buffer
}

export { combineTopImages };
