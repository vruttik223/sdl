import Link from 'next/link';
import { Col } from 'reactstrap';

const FooterUseFul = ({ footerMenu, setFooterMenu }) => {

  return (
    <Col xl={2} lg={3} md={4} sm={6}>
      <div
        className={`footer-title ${footerMenu == 'usefull' ? 'show' : ''}`}
        onClick={() =>
          setFooterMenu((prev) => (prev !== 'usefull' ? 'usefull' : ''))
        }
      >
        <h4>Useful Links</h4>
      </div>
      <div className="footer-contain">
        <ul>
          {/* {themeOption?.footer?.useful_link?.map((elem, i) => (
            <li key={i}>
              <Link
                href={`/${elem.link}`}
                className="text-content text-capitalize"
              >
                {elem.label}
              </Link>
            </li>
          ))} */}
          <li style={{marginBottom:'8px'}}>
            <Link href={`/clinics/find`} className="text-content">
              Find a Clinic
            </Link>
          </li>
          <li style={{marginBottom:'8px'}}>
            <Link href={`/stores/find`} className="text-content">
              Find a Store
            </Link>
          </li>
          <li style={{marginBottom:'8px'}}>
            <Link
              href={`/resources/journal-publications`}
              className="text-content"
            >
              Journal Publications
            </Link>
          </li>
          <li style={{marginBottom:'8px'}}>
            <Link href={`/herbs`} className="text-content">
              Herbs
            </Link>
          </li>
          <li style={{marginBottom:'8px'}}>
            <Link href={`/cultivators`} className="text-content">
              Cultivators
            </Link>
          </li>
        </ul>
      </div>
    </Col>
  );
};

export default FooterUseFul;
