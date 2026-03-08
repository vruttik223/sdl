import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useCustomSearchParams } from '@/utils/hooks/useCustomSearchParams';
import { useTranslation } from '@/utils/translations';
import { RiCloseLine } from 'react-icons/ri';
import { ModifyString } from '@/utils/customFunctions/ModifyString';

const SelectedFilters = ({ filter, setFilter }) => {
  const router = useRouter();
  const [layout] = useCustomSearchParams(['layout']);
  const { t } = useTranslation('common');
  const [selectedFilters, setSelectedFilters] = useState([]);
  const pathname = usePathname();
  
  const splitFilter = (filterKey) => {
    return filter && filter[filterKey] ? filter[filterKey] : [];
  };
  
  const filterObj = {
    category: splitFilter('category'),
    attribute: splitFilter('attribute'),
    price: splitFilter('price'),
    rating: splitFilter('rating'),
  };
  
  const mergeFilter = () => {
    setSelectedFilters([
      ...filterObj['category'],
      ...filterObj['attribute'],
      ...filterObj['price'],
      ...filterObj['rating'].map((val) =>
        val.startsWith('rating ') ? val : `rating ${val}`
      ),
    ]);
  };
  
  useEffect(() => {
    mergeFilter();
  }, [filter]);

  const removeParams = (slugValue) => {
    Object.keys(filterObj).forEach((key) => {
      filterObj[key] = filterObj[key].filter((val) => {
        if (key === 'rating') {
          return val !== slugValue.replace(/^rating /, '');
        }
        return val !== slugValue;
      });
    });
    mergeFilter();
    setFilter(filterObj);
    const params = {};
    Object.keys(filterObj).forEach((key) => {
      if (filterObj[key].length > 0) {
        params[key] = filterObj[key].join(',');
      }
    });
    const queryParams = new URLSearchParams({
      ...params,
      ...layout,
    }).toString();
    router.push(`${pathname}?${queryParams}`);
  };

  const clearFilters = () => {
    const clearedFilters = { category: [], attribute: [], price: [], rating: [] };
    setSelectedFilters([]);
    setFilter((prev) => ({ ...prev, ...clearedFilters }));
    const queryParams = new URLSearchParams({
      ...layout,
    }).toString();
    router.push(queryParams ? `${pathname}?${queryParams}` : pathname);
  };
  
  if (selectedFilters.length <= 0) return null;
  
  return (
    <div className="selected-filters-inline">
      <div className="selected-filters-header d-none d-lg-flex">
        <h5 className="text-content mb-0">{t('Filters')}</h5>
        <button className="clear-btn" onClick={clearFilters}>
          {t('ClearAll')}
        </button>
      </div>
      <div className="selected-filters-content">
        <ul>
          {selectedFilters?.map((elem, i) => (
            <li key={i}>
              <a>{ModifyString(elem, false, '-')}</a>
              <span onClick={() => removeParams(elem)}>
                <RiCloseLine />
              </span>
            </li>
          ))}
        </ul>
        <button className="clear-btn d-lg-none" onClick={clearFilters}>
          {t('ClearAll')}
        </button>
      </div>
    </div>
  );
};

export default SelectedFilters;

