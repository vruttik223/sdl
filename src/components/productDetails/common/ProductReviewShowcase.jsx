import { RiStarFill } from 'react-icons/ri';
import CustomHeading from '@/components/common/CustomHeading';
import { LeafSVG } from '@/components/common/CommonSVG';

const ratingSummary = {
  average: 4.4,
  totalRatings: 50,
  distribution: [
    { stars: 5, count: 70 },
    { stars: 4, count: 40 },
    { stars: 3, count: 35 },
    { stars: 2, count: 10 },
    { stars: 1, count: 0 },
  ],
};

const testimonials = [
  {
    name: 'Rohan Singh',
    rating: 4,
    text: 'After 2 months of regular use, I’ve noticed my child falling sick much less often.',
    avatar: '/assets/images/reviews/user-1.png',
  },
  {
    name: 'Rohini Magdum',
    rating: 5,
    text: 'After 2 months of regular use, I’ve noticed my child falling sick much less often.',
    avatar: '/assets/images/reviews/user-2.png',
  },
  {
    name: 'Subramanyam Iyer',
    rating: 5,
    text: 'After 2 months of regular use, I’ve noticed my child falling sick much less often.',
    avatar: '/assets/images/reviews/user-3.png',
  },
  {
    name: 'Acharya Hemnath',
    rating: 5,
    text: 'After 2 months of regular use, I’ve noticed my child falling sick much less often.',
    avatar: '/assets/images/reviews/user-4.png',
  },
];

const ProductReviewShowcase = () => {
  return (
    <section className="productReviewsSection section-b-space">
      <div className="container-fluid-lg">
        <CustomHeading
          customClass="mb-0 text-center"
          title="Product Reviews"
          subTitle="What our customers say"
          svgUrl={<LeafSVG className="icon-width" />}
        />

        <div className="row g-3 g-md-4 align-items-stretch">
          {/* Left: rating distribution */}
          <div className="col-lg-5">
            <div className="leftCol">
              <ul className="ratingDistribution">
                {ratingSummary.distribution.map((item) => (
                  <li key={item.stars} className="ratingRow">
                    <div className="starLabel">
                      <span>{item.stars}</span>
                      <RiStarFill />
                    </div>
                    <div className="progressTrack">
                      <div
                        className="progressFill"
                        style={{
                          width: `${Math.min(item.count, 100)}%`,
                        }}
                      />
                    </div>
                    <span className="count">{item.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Center: main rating card */}
          <div className="col-lg-3">
            <div className="centerCol">
              <div className="mainRatingCard">
                <div className="mainRatingValue">
                  <span>{ratingSummary.average}</span>
                </div>
                <div className="mainRatingStars">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <RiStarFill key={index} />
                  ))}
                </div>
                <p className="mainRatingMeta">
                  {ratingSummary.totalRatings} Ratings
                </p>
              </div>
            </div>
          </div>

          {/* Right: CTA card */}
          <div className="col-lg-4">
            <div className="rightCol h-100">
              <div className="reviewCtaCard">
                <h3>Review This Product</h3>
                <p>Let our customers know what you think.</p>
                <button type="button" className="reviewButton">
                  Write a Review
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: testimonials */}
        <div className="row g-3 g-md-4 bottomRow">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="col-sm-6 col-lg-3 d-flex"
            >
              <article className="testimonialCard w-100">
                <div className="quoteMark quoteMark-top">&ldquo;</div>
                <div className="quoteMark quoteMark-bottom">&rdquo;</div>

                <div className="testimonialAvatar">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    loading="lazy"
                  />
                </div>

                <h4 className="testimonialName">{testimonial.name}</h4>

                <div className="testimonialStars">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <RiStarFill
                      key={index}
                      className={
                        index < testimonial.rating
                          ? 'starFilled'
                          : 'starEmpty'
                      }
                    />
                  ))}
                </div>

                <p className="testimonialText">{testimonial.text}</p>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductReviewShowcase;

