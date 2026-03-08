'use client';

import { Col, Container, Row } from 'reactstrap';
import Slider from 'react-slick';
import Image from 'next/image';
import { RiDoubleQuotesR } from 'react-icons/ri';
import { reviewsSlider } from '@/data/SliderSettings';
import { LeafSVG } from '@/components/common/CommonSVG';
import ProductBox1Rating from '@/components/common/productBox/productBox1/ProductBox1Rating';
import CustomHeading from '../common/CustomHeading';
import user4 from '../../../public/assets/images/inner-page/user/4.jpg';
import user from '../../../public/assets/images/inner-page/user/1.jpg';
import user2 from '../../../public/assets/images/inner-page/user/2.jpg';
import user6 from '../../../public/assets/images/inner-page/user/6.jpg';

const reviewsData = [
  {
    name: 'Betty J. Turner',
    designation: 'CTO',
    short_description: 'Top Quality, Beautiful Location',
    description: `I usually try to keep my sadness pent up inside where it can fester quietly as a mental illness. There, now he's trapped in a book I wrote: a crummy world of plot holes and spelling errors! As an interesting side note.`,
    profile_image: user4,
  },
  {
    name: 'Alfredo S. Rocha',
    designation: 'ProjectManager',
    short_description: 'Top Quality, Beautiful Location',
    description: `My busy schedule leaves little, if any, time for blogging and social media. The Lorem Ipsum Company has been a huge part of helping me grow my business through organic search and content marketing.
Professional, responsive, and able to keep up with ever-changing demand and tight deadlines: That's how I would describe Jeramy and his team at The Lorem Ipsum Company. When it comes to content marketing.
After being forced to move twice within five years, our customers had a hard time finding us and our sales plummeted. The Lorem Ipsum Co. not only revitalized our brand.
Professional, responsive, and able to keep up with ever-changing demand and tight deadlines: That's how I would describe Jeramy and his team at The Lorem Ipsum Company. When it comes to content marketing.
Jeramy and his team at the Lorem Ipsum Company whipped my website into shape just in time for tax season. I was excited by the results and am proud to direct clients to my website once again.
Yeah, and if you were the pope they'd be all, Straighten your pope hat. And Put on your good vestments. What are their names? Yep, I remember. They came in last at the Olympics!`,
    profile_image: user6,
  },
  {
    name: 'Donald C. Spurr',
    designation: 'SaleAgents',
    short_description: 'Top Quality, Beautiful Location',
    description: `My busy schedule leaves little, if any, time for blogging and social media. The Lorem Ipsum Company has been a huge part of helping me grow my business through organic search and content marketing.
Professional, responsive, and able to keep up with ever-changing demand and tight deadlines: That's how I would describe Jeramy and his team at The Lorem Ipsum Company. When it comes to content marketing.
After being forced to move twice within five years, our customers had a hard time finding us and our sales plummeted. The Lorem Ipsum Co. not only revitalized our brand.
Professional, responsive, and able to keep up with ever-changing demand and tight deadlines: That's how I would describe Jeramy and his team at The Lorem Ipsum Company. When it comes to content marketing.
Jeramy and his team at the Lorem Ipsum Company whipped my website into shape just in time for tax season. I was excited by the results and am proud to direct clients to my website once again.
Yeah, and if you were the pope they'd be all, Straighten your pope hat. And Put on your good vestments. What are their names? Yep, I remember. They came in last at the Olympics!`,
    profile_image: user2,
  },
  {
    name: 'Terry G. Fain',
    designation: 'Photographer',
    short_description: 'Top Quality, Beautiful Location',
    description: `My busy schedule leaves little, if any, time for blogging and social media. The Lorem Ipsum Company has been a huge part of helping me grow my business through organic search and content marketing.
Professional, responsive, and able to keep up with ever-changing demand and tight deadlines: That's how I would describe Jeramy and his team at The Lorem Ipsum Company. When it comes to content marketing.
After being forced to move twice within five years, our customers had a hard time finding us and our sales plummeted. The Lorem Ipsum Co. not only revitalized our brand.
Professional, responsive, and able to keep up with ever-changing demand and tight deadlines: That's how I would describe Jeramy and his team at The Lorem Ipsum Company. When it comes to content marketing.
Jeramy and his team at the Lorem Ipsum Company whipped my website into shape just in time for tax season. I was excited by the results and am proud to direct clients to my website once again.
Yeah, and if you were the pope they'd be all, Straighten your pope hat. And Put on your good vestments. What are their names? Yep, I remember. They came in last at the Olympics!`,
    profile_image: user,
  },
  {
    name: 'Gwen J. Geiger',
    designation: 'Designer',
    short_description: 'Top Quality, Beautiful Location',
    description: `My busy schedule leaves little, if any, time for blogging and social media. The Lorem Ipsum Company has been a huge part of helping me grow my business through organic search and content marketing.
Professional, responsive, and able to keep up with ever-changing demand and tight deadlines: That's how I would describe Jeramy and his team at The Lorem Ipsum Company. When it comes to content marketing.
After being forced to move twice within five years, our customers had a hard time finding us and our sales plummeted. The Lorem Ipsum Co. not only revitalized our brand.
Professional, responsive, and able to keep up with ever-changing demand and tight deadlines: That's how I would describe Jeramy and his team at The Lorem Ipsum Company. When it comes to content marketing.
Jeramy and his team at the Lorem Ipsum Company whipped my website into shape just in time for tax season. I was excited by the results and am proud to direct clients to my website once again.
Yeah, and if you were the pope they'd be all, Straighten your pope hat. And Put on your good vestments. What are their names? Yep, I remember. They came in last at the Olympics!`,
    profile_image: user,
  },
  {
    name: 'Constance K. Whang',
    designation: 'CEO',
    short_description: 'Top Quality, Beautiful Location',
    description: `My busy schedule leaves little, if any, time for blogging and social media. The Lorem Ipsum Company has been a huge part of helping me grow my business through organic search and content marketing.
Professional, responsive, and able to keep up with ever-changing demand and tight deadlines: That's how I would describe Jeramy and his team at The Lorem Ipsum Company. When it comes to content marketing.
After being forced to move twice within five years, our customers had a hard time finding us and our sales plummeted. The Lorem Ipsum Co. not only revitalized our brand.
Professional, responsive, and able to keep up with ever-changing demand and tight deadlines: That's how I would describe Jeramy and his team at The Lorem Ipsum Company. When it comes to content marketing.
Jeramy and his team at the Lorem Ipsum Company whipped my website into shape just in time for tax season. I was excited by the results and am proud to direct clients to my website once again.
Yeah, and if you were the pope they'd be all, Straighten your pope hat. And Put on your good vestments. What are their names? Yep, I remember. They came in last at the Olympics!`,
    profile_image: user,
  },
];

const Reviews = () => {
  return (
    <section className="review-section section-lg-space section-t-space">
      <Container fluid>
        <CustomHeading
          customClass="mb-0 text-center"
          title="Our Reviews"
          subTitle="Explore What Our Customers Say"
          svgUrl={<LeafSVG className="icon-width" />}
        />
        <Row className="gap-4">
          <Col xs="12">
            <Slider
              className="slider-4-half product-wrapper"
              {...reviewsSlider}
            >
              {reviewsData.map((data, index) => (
                <div className="reviewer-box" key={index}>
                  <div className="icon">
                    <RiDoubleQuotesR />
                  </div>
                  <div className="product-rating">
                    <ProductBox1Rating
                      totalRating={Math.floor(Math.random() * 5) + 1}
                    />
                  </div>
                  <h3>{data.short_description}</h3>
                  <p data-lenis-prevent>{data.description}</p>
                  <div className="reviewer-profile">
                    <div className="reviewer-image">
                      <Image
                        height={74.53}
                        width={74.53}
                        src={data.profile_image}
                        alt={data?.name}
                        unoptimized
                      />
                    </div>
                    <div className="reviewer-name">
                      <h4>{data.name}</h4>
                      <h6>{data.designation}</h6>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </Col>
          <Col xs="12">
            <Slider
              className="slider-4-half product-wrapper"
              {...reviewsSlider}
              rtl={true}
            >
              {reviewsData.map((data, index) => (
                <div className="reviewer-box" key={index}>
                  <div className="icon">
                    <RiDoubleQuotesR />
                  </div>
                  <div className="product-rating">
                    <ProductBox1Rating
                      totalRating={Math.floor(Math.random() * 5) + 1}
                    />
                  </div>
                  <h3>{data.short_description}</h3>
                  <p data-lenis-prevent>{data.description}</p>
                  <div className="reviewer-profile">
                    <div className="reviewer-image">
                      <Image
                        height={74.53}
                        width={74.53}
                        src={data.profile_image}
                        alt={data?.name}
                        unoptimized
                      />
                    </div>
                    <div className="reviewer-name">
                      <h4>{data.name}</h4>
                      <h6>{data.designation}</h6>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Reviews;
