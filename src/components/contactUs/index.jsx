'use client';

import WrapperComponent from '../common/WrapperComponent';
import MapSection from './MapSection';
import ContactLeftSideBox from './ContactLeftSideBox';
import ContactRightSidebar from './contactRightSidebar';
import ContactImageBox from './ContactImageBox';
import Breadcrumb from '../common/Breadcrumb';
import { Row } from 'reactstrap';
import CustomHeading from '../common/CustomHeading';

const ContactUsContent = () => {
  return (
    <>
      {/* <Breadcrumb title={'ContactUs'} subNavigation={[{ name: 'ContactUs' }]} /> */}
      <WrapperComponent
        classes={{ sectionClass: 'contact-box-section' }}
        customCol={true}
        noRowCol={true}
      >
        <Row className="g-4 align-items-stretch">
        <CustomHeading
        title={'ContactUs'}
        customtitleClass={'d-xxl-none d-block'}
      />
          <ContactImageBox />
          <ContactRightSidebar />
        </Row>
        <Row className="mt-4">
          <ContactLeftSideBox />
        </Row>
      </WrapperComponent>
      <MapSection />
    </>
  );
};

export default ContactUsContent;
