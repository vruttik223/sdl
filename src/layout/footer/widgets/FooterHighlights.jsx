import React, { useMemo, useContext } from 'react';
import {
  FiHeadphones,
  FiPhoneCall,
  FiMail,
  FiMapPin,
} from 'react-icons/fi';
import ThemeOptionContext from '@/helper/themeOptionsContext';

const FooterHighlights = () => {
  const { themeOption } = useContext(ThemeOptionContext);

  const highlights = useMemo(
    () => [
      {
        id: 1,
        label: 'Support',
        // value:themeOption?.footer?.support_number ||
        // themeOption?.header?.support_number || '',
        value:'1800-229-874',
        icon: <FiHeadphones />,
      },
      {
        id: 2,
        label: 'Sales',
        value:'1800-229-874',
        icon: <FiPhoneCall />,
      },
      {
        id: 3,
        label: 'Email',
        // value: themeOption?.footer?.support_email || '',
        value:'healthcare@sdlindia.com',
        icon: <FiMail />,
      },
      {
        id: 4,
        label: 'Address',
        // value: themeOption?.footer?.about_address || '',
        value: '135, Nanubhai Desai Road, Khetwadi, Girgaon, Mumbai,- 400004',
        icon: <FiMapPin />,
      },
    ],
    [
      themeOption?.footer?.about_address,
      themeOption?.footer?.support_email,
      themeOption?.footer?.support_number,
      themeOption?.header?.support_number,
    ]
  );

  return (
    <div className="footer-highlights">
      {highlights.map((item) => (
        <div className="highlight-item" key={item.id}>
          <span className="highlight-icon">{item.icon}</span>
          <div className="highlight-content">
            <h5 className="highlight-title">{item.label}</h5>
            {item.value ? (
              <p className="highlight-subtitle">{item.value}</p>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FooterHighlights;

