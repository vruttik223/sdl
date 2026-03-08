import React, { useEffect, useRef } from 'react';

const RatioImage = (props) => {
  const bgImg = useRef(null);

  useEffect(() => {
    const image = bgImg.current;
    if (image.classList.contains('bg-img')) {
      const parentElement = image.parentElement;
      const src = image.getAttribute('src');
      // Safely handle URLs that contain spaces, parentheses, etc.
      // - encodeURI keeps existing encoding but converts unsafe characters like spaces
      // - wrap in quotes so CSS parses the full URL correctly
      const safeSrc = encodeURI(src || '').replace(/"/g, '\\"');
      parentElement.classList.add('bg-size');
      image.style.display = 'none';
      parentElement.setAttribute(
        'style',
        `
        background-image: url("${safeSrc}");
        background-size:cover; 
        // background-size:contain;
        border: 1px solid #e0e0e0;
        background-position: center;
        background-repeat: no-repeat;
        display: block;
        `
      );
    }
  }, [props]);

  return <img ref={bgImg} {...props} />;
};
export default RatioImage;
