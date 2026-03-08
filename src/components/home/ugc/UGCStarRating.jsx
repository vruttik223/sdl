'use client';

import React from 'react';
import { RiStarFill, RiStarHalfFill, RiStarLine } from 'react-icons/ri';

/**
 * Render 5-star rating with support for half stars.
 * @param {number} rating - e.g. 4.5
 * @param {string} [className] - optional extra class
 */
const UGCStarRating = ({ rating = 0, className = '' }) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<RiStarFill key={i} />);
    } else if (rating >= i - 0.5) {
      stars.push(<RiStarHalfFill key={i} />);
    } else {
      stars.push(<RiStarLine key={i} />);
    }
  }

  return <ul className={`ugc-rating ${className}`}>{stars.map((s, i) => <li key={i}>{s}</li>)}</ul>;
};

export default UGCStarRating;
