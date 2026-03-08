'use client';

import Slider from 'react-slick';
import Image from 'next/image';
import { eventsCarouselSlider } from '@/data/SliderSettings';

const EventsCarousel = ({ slides = [] }) => {
  if (!slides || slides.length === 0) {
    return (
      <div className="events-carousel-empty">
        <div className="text-center py-5">
          <p>No carousel images available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="events-carousel-section">
      <div className="slider-banner">
        <Slider {...eventsCarouselSlider}>
          {slides.map((slide, index) => (
            <div key={slide.id}>
              <div className="banner-contain">
                <Image
                  src={slide.image}
                  className="bg-img"
                  alt={slide.alt}
                  width={800}
                  height={450}
                  priority={true}
                  unoptimized
                />
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default EventsCarousel;
