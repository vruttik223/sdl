'use client';

import React from 'react';
import Link from 'next/link';
import WrapperComponent from '../common/WrapperComponent';
import CustomHeading from '@/components/common/CustomHeading';
import { LeafSVG } from '@/components/common/CommonSVG';
import { Col, Row } from 'reactstrap';
import { useHome } from '@/utils/hooks/useHome';
import styles from './HealthConcerns.module.scss';

// Dummy data for development
const DUMMY_HEALTH_CONCERNS = [
  {
    uid: '1',
    name: 'Heart Care',
    slug: 'heart-care',
    image: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=400&h=400&fit=crop',
    imageAlt: 'Heart Care',
    description: 'Products for cardiovascular health',
  },
  {
    uid: '2',
    name: 'Stomach Care',
    slug: 'stomach-care',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop',
    imageAlt: 'Stomach Care',
    description: 'Digestive health solutions',
  },
  {
    uid: '3',
    name: 'Liver Care',
    slug: 'liver-care',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=400&fit=crop',
    imageAlt: 'Liver Care',
    description: 'Liver health supplements',
  },
  {
    uid: '4',
    name: 'Bone, Joint & Muscle Care',
    slug: 'bone-joint-muscle-care',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    imageAlt: 'Bone, Joint & Muscle Care',
    description: 'Support for bones, joints and muscles',
  },
  {
    uid: '5',
    name: 'Kidney Care',
    slug: 'kidney-care',
    image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=400&h=400&fit=crop',
    imageAlt: 'Kidney Care',
    description: 'Kidney health products',
  },
  {
    uid: '6',
    name: 'Derma Care',
    slug: 'derma-care',
    image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=400&h=400&fit=crop',
    imageAlt: 'Derma Care',
    description: 'Skin care solutions',
  },
  {
    uid: '7',
    name: 'Respiratory Care',
    slug: 'respiratory-care',
    image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=400&h=400&fit=crop',
    imageAlt: 'Respiratory Care',
    description: 'Respiratory health support',
  },
  {
    uid: '8',
    name: 'Immunity Care',
    slug: 'immunity-care',
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400&h=400&fit=crop',
    imageAlt: 'Immunity Care',
    description: 'Boost your immune system',
  },
  {
    uid: '9',
    name: 'Mental Wellness',
    slug: 'mental-wellness',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=400&fit=crop',
    imageAlt: 'Mental Wellness',
    description: 'Mental health support',
  },
  {
    uid: '10',
    name: 'Women Health',
    slug: 'women-health',
    image: 'https://images.unsplash.com/photo-1494597564530-871f2b93ac55?w=400&h=400&fit=crop',
    imageAlt: 'Women Health',
    description: 'Women-specific health products',
  },
];

const ShopByHealthConcerns = () => {
  const { data, isLoading, isError } = useHome();

  const healthConcerns = data?.data?.healthConcerns || DUMMY_HEALTH_CONCERNS;

  return (
    <WrapperComponent classes={{ sectionClass: styles['health-concerns-section'] }} noRowCol={true}>
      <Row>
        <Col>
          <CustomHeading
            customClass="mb-0"
            title="Shop by Health Concerns"
            subTitle="Explore More Health Topics"
            svgUrl={<LeafSVG className="icon-width" />}
          />
        </Col>
      </Row>
      
      <Row>
        <Col>
          <div className={styles['health-concerns-grid-wrapper']}>
            {isLoading ? (
              <div className={styles['health-concerns-loading']}>
                <div className={styles['loading-spinner']}></div>
              </div>
            // ) : isError ? (
            //   <div className={styles['health-concerns-empty']}>
            //     <p>Unable to load health concerns. Please try again later.</p>
            //   </div>
            ) : healthConcerns.length === 0 ? (
              <div className={styles['health-concerns-empty']}>
                <p>No health concerns available at the moment.</p>
              </div>
            ) : (
              <div className={styles['health-concerns-grid']} data-lenis-prevent>
                {healthConcerns.map((concern) => (
                  <Link
                    key={concern.uid}
                    href={`/collections?health_interest=${concern.slug}`}
                    className={styles['health-concern-card']}
                  >
                    <div className={styles['health-concern-image-wrapper']}>
                      <img
                        src={concern.image}
                        alt={concern.imageAlt || concern.name}
                        className={styles['health-concern-image']}
                      />
                    </div>
                    <h3 className={styles['health-concern-name']}>
                      {concern.name}
                    </h3>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </Col>
      </Row>
    </WrapperComponent>
  );
};

export default ShopByHealthConcerns;
