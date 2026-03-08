import { useContext } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/utils/translations';
import CompareContext from '@/helper/compareContext';

const StickyCompare = () => {
  const { compareState } = useContext(CompareContext);
  const { t } = useTranslation('common');
  if (compareState?.length == 0) {
    return null;
  } else
    return (
      <div className="compare-fix">
        <Link href={`/compare`}>
          <h5>
            {t('Compare')} <span>{`(${compareState?.length})`}</span>
          </h5>
        </Link>
      </div>
    );
};

export default StickyCompare;
