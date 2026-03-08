'use client';

import React from 'react';
import Link from 'next/link';
import WrapperComponent from '@/components/common/WrapperComponent';
import { Col, Row } from 'reactstrap';
import CustomHeading from '@/components/common/CustomHeading';
import { LeafSVG } from '@/components/common/CommonSVG';
import { useHome } from '@/utils/hooks/useHome';
import styles from './ShopByDepartment.module.scss';

// Dummy data for development
const DUMMY_DEPARTMENTS = [
  {
    uid: '1',
    name: 'Ayurvedic Medicines',
    slug: 'ayurvedic-medicines',
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400&h=400&fit=crop',
    imageAlt: 'Ayurvedic Medicines',
  },
  {
    uid: '2',
    name: 'Personal Care',
    slug: 'personal-care',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
    imageAlt: 'Personal Care',
  },
  {
    uid: '3',
    name: 'Health Supplements',
    slug: 'health-supplements',
    image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=400&h=400&fit=crop',
    imageAlt: 'Health Supplements',
  },
];

const ShopByDepartment = () => {
  const { data, isLoading, isError } = useHome();

  const departments = data?.data?.departments || DUMMY_DEPARTMENTS;
  // Always show only 3 departments
  const limitedDepartments = departments.slice(0, 3);

  return (
    <WrapperComponent 
      classes={{ sectionClass: styles['department-section'] }} 
      noRowCol={true}
    >
      <Row>
        <Col>
          <CustomHeading
            customClass="mb-0"
            title="Shop by Department"
            subTitle="Explore Our Top Departments"
            svgUrl={<LeafSVG className="icon-width" />}
          />
        </Col>
      </Row>

      <Row>
        <Col>
          <div className={styles['department-grid-wrapper']}>
            {isLoading ? (
              <div className={styles['department-loading']}>
                <div className={styles['loading-spinner']}></div>
              </div>
            ) : limitedDepartments.length === 0 ? (
              <div className={styles['department-empty']}>
                <p>No departments available at the moment.</p>
              </div>
            ) : (
              <div className={styles['department-grid']}>
                {limitedDepartments.map((department) => (
                  <Link
                    key={department.uid}
                    href={`/collections?department=${department.slug}`}
                    className={styles['department-card']}
                  >
                    <div className={styles['department-image-wrapper']}>
                      <img
                        src={department.image}
                        alt={department.imageAlt || department.name}
                        className={styles['department-image']}
                      />
                    </div>
                    <h3 className={styles['department-name']}>
                      {department.name}
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

export default ShopByDepartment;
