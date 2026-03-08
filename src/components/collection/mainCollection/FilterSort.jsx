import React, { useState, forwardRef, useImperativeHandle } from 'react';
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from 'reactstrap';
import { filterSort } from '../../../data/Custom';
import { useCustomSearchParams } from '@/utils/hooks/useCustomSearchParams';
import { useTranslation } from '@/utils/translations';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const FilterSort = forwardRef(({ filter, setFilter }, ref) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const dropdownToggleRef = React.useRef(null);
  const [attribute, price, category, layout] = useCustomSearchParams([
    'attribute',
    'price',
    'category',
    'layout',
  ]);
  const searchParams = useSearchParams();
  const { t } = useTranslation('common');
  const router = useRouter();
  const pathname = usePathname();

  // Expose click method to parent via ref
  useImperativeHandle(ref, () => ({
    click: () => {
      if (dropdownToggleRef.current) {
        dropdownToggleRef.current.click();
      }
    },
  }));
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

    // Preserve all existing query parameters
    const params = new URLSearchParams(searchParams.toString());
    
    // Update or set sort parameters
    params.set('sortBy', data.value);
    if (data && (data.value == 'asc' || data.value == 'desc')) {
      params.set('field', 'created_at');
    } else {
      params.delete('field');
    }
    
    router.push(`${pathname}?${params.toString()}`);
  };
  return (
    <div className="category-dropdown">
      <h5 className="text-content mb-0">{t('SortBy')}</h5>
      <Dropdown isOpen={dropdownOpen} toggle={toggle}>
        <DropdownToggle ref={dropdownToggleRef} caret>
          <span>
            {filterSort.find((elem) => elem.value == filter.sortBy)?.label ||
              t('Recommended')}
          </span>
        </DropdownToggle>
        <DropdownMenu>
          <div className="dropdown-box">
            {filterSort.map((elem, i) => (
              <DropdownItem key={i} onClick={() => handleSort(elem)}>
                {elem.label}
              </DropdownItem>
            ))}
          </div>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
});

FilterSort.displayName = 'FilterSort';

export default FilterSort;
