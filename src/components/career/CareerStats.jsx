'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './CareerStats.module.scss';

const stats = [
  { id: 1, value: 150, suffix: '+', label: 'Years of Ayurvedic legacy' },
  { id: 2, value: 500, suffix: '+', label: 'Passionate team members' },
  { id: 3, value: 25, suffix: '+', label: 'Innovative products & lines' },
  { id: 4, value: 10, suffix: '+', label: 'Departments & career paths' },
];

const AnimatedStat = ({ value, suffix }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const frameRate = 30;
    const totalFrames = Math.round((duration / 1000) * frameRate);
    let frame = 0;

    const counter = setInterval(() => {
      frame += 1;
      const progress = Math.min(frame / totalFrames, 1);
      const currentValue = Math.round(value * progress);
      setCount(currentValue);

      if (progress === 1) {
        clearInterval(counter);
      }
    }, 1000 / frameRate);

    return () => clearInterval(counter);
  }, [value]);

  return (
    <>
      {count}
      {suffix}
    </>
  );
};

const CareerStats = () => {
  return (
    <section className={`${styles.section} section-b-space section-lg-space`}>
      <div className="container-fluid-lg">
        <div className="row align-items-center g-4 g-lg-5">
          <div className="col-lg-5 col-12">
            <div className={styles.imageWrapper}>
              <Image
                src="/assets/images/career/stats_img.jpg"
                alt="Our people and workplace"
                fill
                sizes="(max-width: 992px) 100vw, 33vw"
                className={styles.image}
                priority={false}
              />
            </div>
          </div>

          <div className="col-lg-7 col-12">
            <div className={styles.content}>
              <h2 className={styles.heading}>Shree Dhootpapeshwar at a glance</h2>
              <p className={styles.subHeading}>
                A quick snapshot of our people, legacy, and opportunities for you to grow with a
                purpose-driven Ayurvedic organisation.
              </p>

              <div className={`row g-3 g-md-4 ${styles.statsRow}`}>
                {stats.map((item) => (
                  <div key={item.id} className="col-sm-6 col-12">
                    <div className={styles.statCard}>
                      <div className={styles.statValue}>
                        <AnimatedStat value={item.value} suffix={item.suffix} />
                      </div>
                      <div className={styles.statLabel}>{item.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CareerStats;

