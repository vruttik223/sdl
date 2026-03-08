'use client';

import Image from 'next/image';
import { Col, Row } from 'reactstrap';
import { FiMail, FiTrendingUp } from 'react-icons/fi';
import WrapperComponent from '@/components/common/WrapperComponent';
import Breadcrumb from '@/components/common/Breadcrumb';

const CultivatorsPageContent = () => {
  return (
    <>
      {/* Breadcrumb Section */}
      {/* <Breadcrumb
        title="Cultivators"
        subNavigation={[{ name: 'Cultivators' }]}
      /> */}

      {/* Main Content Section */}
      <WrapperComponent
        classes={{
          sectionClass: 'cultivators-section section-b-space',
          fluidClass: 'container-fluid-lg',
        }}
        noRowCol
      >
        <Row className="g-4 align-items-stretch">
          {/* Left Side - Image */}
          <Col lg={5} md={12} className="cultivators-image-col">
            <div className="cultivators-image-box">
              <Image
                src="/assets/uploads/cultivators.png"
                alt="Herb Cultivation"
                width={400}
                height={400}
                className="cultivators-main-image"
                priority
              />
            </div>
          </Col>

          {/* Right Side - Content */}
          <Col lg={7} md={12} className="cultivators-content-col">
            <div className="cultivators-content-wrapper">
              {/* Introduction */}
              <div className="cultivators-intro">
                <h3 className="cultivators-heading">Dear Cultivator,</h3>
                <p className="cultivators-text mb-3">
                  Please find on this link the annual requirement of herbs by
                  SDL:{' '} <br />
                  <a
                    href="/annual-requirement-of-herbs"
                    className="cultivators-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Annual Requirement of Herbs
                  </a>
                </p>
                <p className="cultivators-text">
                  If you wish to provide us with herbs listed as per our
                  requirement, kindly download the cultivated crop offer form/s
                  below:
                </p>
              </div>

              {/* Download Forms Section */}
              <div className="cultivators-forms-section">
                <Row className="g-3">
                  <Col md={6} sm={12}>
                    <a
                      href="/assets/uploads/Annual_Requirement_Hindi.pdf"
                      className="cultivators-btn cultivators-btn-primary btn-primary"
                      download
                    >
                      <span className="btn-label">
                        Hindi <FiTrendingUp />
                      </span>
                      <span className="btn-sublabel">
                        Cultivated Crop Offer Form
                      </span>
                    </a>
                  </Col>
                  <Col md={6} sm={12}>
                    <a
                      href="/assets/uploads/Annual_Requirement_English.pdf"
                      className="cultivators-btn cultivators-btn-primary btn-primary"
                      download
                    >
                      <span className="btn-label">
                        English <FiTrendingUp />
                      </span>
                      <span className="btn-sublabel">
                        Cultivated Crop Offer Form
                      </span>
                    </a>
                  </Col>
                </Row>
              </div>

              {/* Submission Instructions */}
              {/* <div className="cultivators-submission">
                <p className="cultivators-text">
                  The filled & signed form/s must be sent to : <br />
                  <span className="d-flex flex-wrap gap-lg-3">
                    <span className="d-flex gap-2 align-items-center">
                      <FiMail className="theme-color" />
                      <a
                        href="mailto:dgj@teamsdl.in"
                        className="cultivators-email-link"
                      >
                        dgj@teamsdl.in
                      </a>
                    </span>
                    &
                    <span className="d-flex gap-2 align-items-center">
                      <FiMail className="theme-color" />
                      <a
                        href="mailto:healthcare@sdlindia.com"
                        className="cultivators-email-link"
                      >
                        healthcare@sdlindia.com
                      </a>
                    </span>
                  </span>
                </p>
              </div> */}

              <div className="cultivators-submission cultivators-disclaimer">
                <h5 className="disclaimer-heading">Note:</h5>
                <p className="disclaimer-text">
                  The filled & signed form/s must be sent to :
                </p>
                <p className="disclaimer-text mb-0">
                  <span className="d-flex gap-2 align-items-center">
                    <FiMail className="theme-color" />
                    <a
                      href="mailto:dgj@teamsdl.in"
                      className="cultivators-email-link"
                    >
                      dgj@teamsdl.in
                    </a>
                  </span>
                  <span className="d-flex gap-2 align-items-center">
                    <FiMail className="theme-color" />
                    <a
                      href="mailto:healthcare@sdlindia.com"
                      className="cultivators-email-link"
                    >
                      healthcare@sdlindia.com
                    </a>
                  </span>
                </p>
              </div>

              {/* Disclaimer Box */}
              <div className="cultivators-disclaimer">
                <h5 className="disclaimer-heading">Disclaimer:</h5>
                <p className="disclaimer-text">
                  The requirement of herbs given herein are on the basis of
                  average consumption of last three years which may vary as per
                  production plan.
                </p>
                <p className="disclaimer-text mb-0">
                  It is not binding on the Company to enter into contract with
                  anyone on receipt of forms from the vendors. Company solely
                  reserves the right to take the decision as per the
                  company&apos;s policy.
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </WrapperComponent>
    </>
  );
};

export default CultivatorsPageContent;
