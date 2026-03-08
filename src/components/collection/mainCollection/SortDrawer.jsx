import React, { useState } from 'react';
import { Offcanvas, OffcanvasBody, OffcanvasHeader } from 'reactstrap';
import { filterSort } from '../../../data/Custom';
import { useCustomSearchParams } from '@/utils/hooks/useCustomSearchParams';
import { useTranslation } from '@/utils/translations';
import { usePathname, useRouter } from 'next/navigation';
import { RiCloseLine } from 'react-icons/ri';

const SortDrawer = ({ isOpen, toggle, filter, setFilter }) => {
  const [attribute, price, category, layout] = useCustomSearchParams([
    'attribute',
    'price',
    'category',
    'layout',
  ]);
  const { t } = useTranslation('common');
  const router = useRouter();
  const pathname = usePathname();

  const handleSort = (data) => {
    setFilter((prev) => {
      return {
        ...prev,
        sortBy: data.value,
        field:
          data && (data.value == 'asc' || data.value == 'desc')
            ? 'created_at'
            : null,
      };
    });

    let queryParams = new URLSearchParams({
      ...attribute,
      ...price,
      ...category,
      ...layout,
      sortBy: data.value,
    }).toString();
    if (data && (data.value == 'asc' || data.value == 'desc')) {
      const fieldQuery = new URLSearchParams();
      fieldQuery.append('field', 'created_at');
      queryParams += '&' + fieldQuery.toString();
    }
    router.push(`${pathname}?${queryParams}`);
    toggle(); // Close drawer after selection
  };

  return (
    <Offcanvas
      isOpen={isOpen}
      toggle={toggle}
      direction="bottom"
      className="sort-drawer bottom-offcanvas"
      style={{ height: 'auto', maxHeight: '70vh' }}
    >
      <OffcanvasHeader toggle={toggle} className="sort-drawer-header">
        <h5>{t('Sort')}</h5>
      </OffcanvasHeader>
      <OffcanvasBody className="sort-drawer-body">
        <div className="sort-options">
          {filterSort.map((elem, i) => {
            const IconComponent = elem.icon;
            return (
              <button
                key={i}
                className={`sort-option-item ${
                  filter.sortBy === elem.value ? 'active' : ''
                }`}
                onClick={() => handleSort(elem)}
              >
                <div className="sort-option-left">
                  {IconComponent && (
                    <span className="sort-option-icon">
                      <IconComponent />
                    </span>
                  )}
                  <span className="sort-option-label">{elem.label}</span>
                </div>

                {filter.sortBy === elem.value && (
                  <span className="sort-option-check">✓</span>
                )}
              </button>
            );
          })}
        </div>
      </OffcanvasBody>
    </Offcanvas>
  );
};

export default SortDrawer;

