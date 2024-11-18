import React, { useEffect, useRef, useState } from "react";
import { useSpotifyApi } from "../../SpotifyContext";
import LoadingSpinner from "../loadingSpinner";

const AlbumGridImage = ({ n, time_range }) => {
  const canvasRef = useRef(null);
  const spotifyApi = useSpotifyApi();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAndDrawAlbums = async () => {
      try {
        // fetch top tracks
        const topTracksData = await spotifyApi.getMyTopTracks({
          limit: 50, // fetch enough tracks to ensure enough unique albums
          time_range: time_range,
        });
        const tracks = topTracksData.items;

        // gt unique album image URLs
        const uniqueAlbums = new Map();

        tracks.forEach((track) => {
          const albumId = track.album.id;
          if (!uniqueAlbums.has(albumId)) {
            const imageUrl = track.album.images[0]?.url;
            if (imageUrl) {
              uniqueAlbums.set(albumId, imageUrl);
            }
          }
        });

        // convert the Map values to an array of image URLs
        const albumImages = Array.from(uniqueAlbums.values());

        // limit to n^2 images
        const limitedAlbumImages = albumImages.slice(0, n * n);

        // load images
        const loadedImages = await Promise.all(
          limitedAlbumImages.map((src) => loadImage(src))
        );

        // put images on canvas
        drawImagesOnCanvas(loadedImages);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching top albums:", error);
      }
    };

    fetchAndDrawAlbums();
  }, [spotifyApi, n, time_range]);

  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
      img.src = src;
    });
  };

  const drawImagesOnCanvas = (images) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("Canvas not found");
      return;
    }
    const context = canvas.getContext("2d");

    const gridSize = n;
    const imageSize = 100;
    const canvasSize = gridSize * imageSize;

    canvas.width = canvasSize;
    canvas.height = canvasSize;

    context.clearRect(0, 0, canvas.width, canvas.height);

    images.forEach((img, index) => {
      const x = (index % gridSize) * imageSize;
      const y = Math.floor(index / gridSize) * imageSize;
      context.drawImage(img, x, y, imageSize, imageSize);
    });
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative group">
        <canvas
          ref={canvasRef}
          className="mb-4 rounded-3xl transition-transform transform group-hover:scale-105 group-hover:shadow-2xl"
        ></canvas>

        {isLoading && (
          <div className="absolute rounded-3xl inset-0 flex items-center justify-center bg-zinc-900 bg-opacity-75">
            <p className="text-white">Loading album cover grid...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlbumGridImage;
