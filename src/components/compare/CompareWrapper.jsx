import { useTranslation } from '@/utils/translations';
import React, { useContext } from 'react';

const CompareWrapper = ({ data = {}, children }) => {
  const { t } = useTranslation('common');
  return (
    <>
      <div className="detail-part">
        <div className="title-detail">
          <h5>{t(data?.title)}</h5>
        </div>
        <div className="inner-detail">
          {children ? children : <p>{data?.value}</p>}
        </div>
      </div>
    </>
  );
};

export default CompareWrapper;
