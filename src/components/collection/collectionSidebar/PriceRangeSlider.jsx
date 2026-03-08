import React, { useState } from 'react';

export default function PriceRangeSlider() {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(3300);
  const absoluteMin = 0;
  const absoluteMax = 3300;

  const handleMinChange = (e) => {
    const value = Math.min(Number(e.target.value), maxPrice - 100);
    setMinPrice(value);
  };

  const handleMaxChange = (e) => {
    const value = Math.max(Number(e.target.value), minPrice + 100);
    setMaxPrice(value);
  };

  const minPercent = ((minPrice - absoluteMin) / (absoluteMax - absoluteMin)) * 100;
  const maxPercent =
    ((maxPrice - absoluteMin) / (absoluteMax - absoluteMin)) * 100;

  return (
    <div className="price-range-container">
      <style jsx>{`
        .price-range-container {
          width: 100%;
          padding: 20px 0px;
          background: white;
        //   border-radius: 8px;
          // border-top: 1px solid var(--border-color);
          // border-bottom: 1px solid var(--border-color);
        }

        .slider-wrapper {
          position: relative;
          height: 5px;
          margin-bottom: 20px;
        }

        .slider-track {
          position: absolute;
          width: 100%;
          height: 5px;
          background: #e0e0e0;
          border-radius: 5px;
        }

        .slider-range {
          position: absolute;
          height: 5px;
          background: var(--theme-color);
          border-radius: 5px;
        }

        .slider-input {
          position: absolute;
          width: 100%;
          height: 5px;
          background: none;
          pointer-events: none;
          -webkit-appearance: none;
          appearance: none;
        }

        .slider-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--theme-color);
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
          cursor: pointer;
          pointer-events: all;
          position: relative;
          z-index: 4;
          margin-top: -6.5px;
        }

        .slider-input::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--theme-color);
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
          cursor: pointer;
          pointer-events: all;
          position: relative;
          z-index: 4;
        }

        .slider-input::-webkit-slider-runnable-track {
          -webkit-appearance: none;
          appearance: none;
          height: 5px;
        }

        .slider-input::-moz-range-track {
          height: 5px;
        }

        .price-display {
          font-size: 14px;
          color: #666;
          font-weight: 500;
          margin-top: 10px;
        }

        @media (max-width: 768px) {
          .price-range-container {
            padding: 15px;
          }
        }
      `}</style>

      <div className="slider-wrapper">
        <div className="slider-track"></div>
        <div 
          className="slider-range"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`
          }}
        ></div>
        
        <input
          type="range"
          min={absoluteMin}
          max={absoluteMax}
          value={minPrice}
          onChange={handleMinChange}
          className="slider-input"
          style={{ zIndex: minPrice > absoluteMax - 100 ? 5 : 3 }}
        />
        
        <input
          type="range"
          min={absoluteMin}
          max={absoluteMax}
          value={maxPrice}
          onChange={handleMaxChange}
          className="slider-input"
          style={{ zIndex: 4 }}
        />
      </div>

      <div className="price-display">
        ₹{minPrice.toLocaleString('en-IN')} - ₹{maxPrice.toLocaleString('en-IN')}+
      </div>
    </div>
  );
}