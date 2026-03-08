'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import styles from './CareerOpportunities.module.scss';

const opportunities = [
  {
    id: 1,
    title: 'Culture & Ethics',
    description:
      'Equality, Trust and Empowerment form the three pillars of the company’s value system. Diversity and inclusion are embodied in the Company’s values; we understand the impact teamwork has on achieving sustained business success. Every team member is encouraged to participate in the decision-making process and thereby assumes a sense of ownership towards their assignments. We celebrate autonomy at every level of our organisation.',
    image: '/assets/images/career/culture.png',
  },
  {
    id: 2,
    title: 'A healthy work-life balance',
    description:
      'Our desire to succeed professionally can lead us to neglect our own well-being or treat it as less important. At SDL, a healthy work-life balance is a critical element of the work culture. Our policies have been designed to respect and support the health, safety and dignity of each worker. In addition, we celebrate the big and small successes, birthdays, festivals and special occasions – all the little things that matter to the growth & well-being of every individual, and thereby also to the growth of the company as a whole.',
    image: '/assets/images/career/balance.jpg',
  },
  {
    id: 3,
    title: 'Equal Opportunities',
    description:
      'Our teams constantly strive to come up with, and implement innovative solutions to refine the “Business Quotient” in our processes and make way for a focused, transparent and operational environment.',
    image: '/assets/images/career/equality.png',
  },
];

const CareerOpportunities = () => {
  const [expandedId, setExpandedId] = useState(null);

  const toggleReadMore = (id) => {
    setExpandedId((prevId) => (prevId === id ? null : id));
  };

  return (
    <section id="career-opportunities" className={`${styles.section} section-b-space section-lg-space`}>
      <div className="container-fluid-lg">
        <div className="row justify-content-center">
          <div className="col-12 text-center">
            <h2 className={styles.heading}>Explore Career Opportunities</h2>
            <p className={styles.subHeading}>
              Discover roles that match your passion and expertise. Join us in shaping the future of
              Ayurvedic healthcare.
            </p>
          </div>
        </div>

        <div className="row g-3 g-md-4">
          {opportunities.map((item) => {
            const isExpanded = expandedId === item.id;

            return (
              <div key={item.id} className="col-lg-4 col-md-6 col-sm-12">
                <div className={styles.card}>
                  <div className={styles.cardImageWrapper}>
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className={styles.cardImage}
                    />
                  </div>

                  <div className={styles.cardBody}>
                    <h3 className={styles.cardTitle}>{item.title}</h3>
                    <div
                      className={`${styles.descriptionWrapper} ${
                        isExpanded ? styles.descriptionExpanded : ''
                      }`}
                    >
                      <p className={styles.cardDescription}>{item.description}</p>
                    </div>
                    <button
                      type="button"
                      className={styles.readMoreBtn}
                      onClick={() => toggleReadMore(item.id)}
                    >
                      {isExpanded ? 'Read Less - ' : 'Read More +'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CareerOpportunities;

