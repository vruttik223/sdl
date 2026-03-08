import { useContext } from 'react';
import Image from 'next/image';
import { useTranslation } from '@/utils/translations';

const NoDataFound = ({ data = {} }) => {
  const { t } = useTranslation('common');
  return (
    <div className={data?.customClass ? data?.customClass : ''}>
      {data?.imageUrl && (
        <Image
          src={data?.imageUrl}
          className="img-fluid"
          alt="no-data"
          height={data?.height}
          width={data?.width}
          unoptimized
        />
      )}
      <h4>{t(data?.title)}</h4>
      <p>{t(data?.description)}</p>
    </div>
  );
};

export default NoDataFound;
