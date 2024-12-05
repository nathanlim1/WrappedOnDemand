// Get the images from a list of albums (album covers) or artists (profile photos)

export const getImages = (list) => {
  return list
    .map((item) => item.images[0]?.url)
    .filter((url) => url !== undefined);
};
