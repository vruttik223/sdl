import Image from 'next/image';
import WrapperComponent from '@/components/common/WrapperComponent';
import { Col, Container, Row } from 'reactstrap';

const CTABanner = () => {
  return (
    <Container fluid>
      <WrapperComponent classes={{ fluidClass: 'px-0' }} noRowCol={true}>
        <Row>
          <Col>
            {/* Desktop */}
            <div className="hero-banner">
              <div className="desktop-banner">
                <Image
                  src="/assets/images/cake/banner/11.jpg"
                  alt="Hero Banner"
                  width={1440}
                  height={500}
                  priority
                  className="banner-img"
                />
              </div>

              {/* Mobile */}
              <div className="mobile-banner">
                <Image
                  src="/assets/images/cake/banner/event-banner-1.png"
                  alt="Hero Banner"
                  width={600}
                  height={300}
                  priority
                  className="banner-img"
                />
              </div>
            </div>
          </Col>
        </Row>
      </WrapperComponent>
    </Container>
  );
};

export default CTABanner;
