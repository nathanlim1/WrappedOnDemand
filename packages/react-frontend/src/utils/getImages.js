// Get the images from a list of albums (album covers) or artists (profile photos)

export const getAlbumImages = (albums) => {
  return albums
    .map((album) => album.images[0]?.url)
    .filter((url) => url !== undefined);
};

export const getArtistImages = (artists) => {
  return artists
    .map((artist) => artist.images[0]?.url)
    .filter((url) => url !== undefined);
};
