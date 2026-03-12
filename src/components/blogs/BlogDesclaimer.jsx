import React from 'react';
import styles from '../career/CareerDisclaimer.module.scss';

const BlogDesclaimer = () => {
  return (
    <section className={`${styles.section} section-b-space`}>
      {/* <div className="container-fluid-lg"> */}
        <div className="row justify-content-center">
          {/* <div className="col-xl-9 col-lg-10"> */}
          <div className="col-12">
            <div className={styles.box}>
              <h3 className={styles.title}>Blog Disclaimer</h3>
                <p className={styles.text}>
                    The information shared in this blog is for general awareness. Shree Doothpappeshwar Limited follows a transparent, merit-based recruitment process and does not request any fees or deposits. Readers are encouraged to stay alert against fraudulent job offers.
                </p>

              <p className={styles.text}>
              If you receive any unauthorised, suspicious or fraudulent offers or interview call or in case of any queries, please email us at <a href="mailto:career@teamsdl.in">career@teamsdl.in</a>
              </p>
            </div>
          </div>
        </div>
      {/* </div> */}
    </section>
  );
};

export default BlogDesclaimer;

