import { useState, useEffect, useRef } from 'react';

function ColorPercentage({ src }) {
  const canvasRef = useRef(null);
  const [colors, setColors] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const img = new Image();
    img.src = src;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      context.drawImage(img, 0, 0);

      const pixelData = context.getImageData(0, 0, canvas.width, canvas.height).data;

      const colorCounts = {};
      const pixelCount = pixelData.length / 4;

      for (let i = 0; i < pixelData.length; i += 4) {
        const r = pixelData[i];
        const g = pixelData[i + 1];
        const b = pixelData[i + 2];
        const color = `rgb(${r},${g},${b})`;

        if (colorCounts[color]) {
          colorCounts[color]++;
        } else {
          colorCounts[color] = 1;
        }
      }

      const colorPercentages = Object.entries(colorCounts).map(([color, count]) => {
        const percentage = (count / pixelCount) * 100;
        return { color, percentage };
      });

      setColors(colorPercentages);
    };
  }, [src]);

  return (
    <div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <ul>
        {colors.map(({ color, percentage }) => (
          <li key={color}>
            {color}: {percentage.toFixed(2)}%
          </li>
        ))}
      </ul>
    </div>
  );
}

//<ColorPercentage src="https://example.com/image.jpg" />