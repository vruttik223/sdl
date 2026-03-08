'use client';

import Slider from 'react-slick';
import Image from 'next/image';
import { heroCarouselSlider } from '@/data/SliderSettings';
import WrapperComponent from '../common/WrapperComponent';

const HeroCarousel = () => {
  const dummySlides = [
    {
      id: 1,
      image: '/assets/images/cake/banner/event-banner-1.png',
      alt: 'SDL Events - Connecting People, Creating Opportunities',
    },
    {
      id: 2,
      image: '/assets/images/cake/banner/event-banner-1.png',
      alt: 'Join Our Community Events and Workshops',
    },
    {
      id: 3,
      image: '/assets/images/cake/banner/event-banner-1.png',
      alt: 'Technology Conferences and Innovation Summits',
    },
    {
      id: 4,
      image: '/assets/images/cake/banner/event-banner-1.png',
      alt: 'Professional Networking and Growth Opportunities',
    },
    {
      id: 5,
      image: '/assets/images/cake/banner/event-banner-1.png',
      alt: 'Hands-on Training and Skill Development Programs',
    },
  ];
  
  return (
    <WrapperComponent
      classes={{
        fluidClass: 'container-fluid-lg',
        sectionClass: 'pt-0',
        col:'px-0'
      }}
    >
      <div className="hero-carousel-section">
        <div className="slider-banner">
          <Slider {...heroCarouselSlider}>
            {dummySlides.map((slide, index) => (
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
    </WrapperComponent>
  );
};

export default HeroCarousel;
