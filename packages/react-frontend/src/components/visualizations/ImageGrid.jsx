import React, { useEffect, useRef } from "react";

const ImageGrid = ({ imageUrls, gridSize }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const drawImagesOnCanvas = async () => {
      if (!imageUrls || imageUrls.length === 0) return;

      const canvas = canvasRef.current;
      if (!canvas) {
        console.error("Canvas not found");
        return;
      }
      const context = canvas.getContext("2d");

      const canvasSize = 500; // fixed canvas size

      // calculate the largest nxn grid
      const totalImages = imageUrls.length;
      const maxGridSize = Math.min(
        gridSize,
        Math.floor(Math.sqrt(totalImages))
      );
      const imagesPerRow = maxGridSize; // number of images per row
      const imageSize = canvasSize / imagesPerRow; // size of each image

      canvas.width = canvasSize;
      canvas.height = canvasSize;

      context.clearRect(0, 0, canvas.width, canvas.height);

      // Load images
      const loadedImages = await Promise.all(
        imageUrls
          .slice(0, maxGridSize * maxGridSize)
          .map((src) => loadImage(src))
      );

      loadedImages.forEach((img, index) => {
        const x = (index % imagesPerRow) * imageSize;
        const y = Math.floor(index / imagesPerRow) * imageSize;
        context.drawImage(img, x, y, imageSize, imageSize);
      });
    };

    const loadImage = (src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
        img.src = src;
      });
    };

    drawImagesOnCanvas();
  }, [imageUrls, gridSize]);

  return (
    <canvas
      ref={canvasRef}
      className="mb-4 rounded-3xl transition-transform transform group-hover:scale-105 group-hover:shadow-2xl"
    ></canvas>
  );
};

export default ImageGrid;
