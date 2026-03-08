'use client';

import { useSearchParams } from 'next/navigation';
import { useAnnualHerbRequirements } from '@/utils/hooks/useAnnualHerbRequirements';
import Pagination from '@/components/common/Pagination';
import { 
  RiErrorWarningLine,
  RiInboxLine 
} from 'react-icons/ri';
import styles from './page.module.scss';

const AnnualHerbRequirementsContent = () => {
  const searchParams = useSearchParams();
  const rawPage = Number(searchParams.get('page'));
  const currentPage =
    Number.isFinite(rawPage) && Number.isInteger(rawPage) && rawPage > 0
      ? rawPage
      : 1;
  const itemsPerPage = 9;

  const { data, isLoading, isError, error } = useAnnualHerbRequirements({
    page: currentPage,
    limit: itemsPerPage,
  });

  const requirements = data?.data?.requirements || [];
  const pagination = data?.data?.pagination || {};

  // Format quantity with commas
  const formatQuantity = (quantity) => {
    if (!quantity) return 'N/A';
    return parseFloat(quantity).toLocaleString('en-IN');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={styles['herbs-loading']}>
        <div className={styles['loading-spinner']}></div>
        <p>Loading annual herb requirements...</p>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className={styles['herbs-error']}>
        <RiErrorWarningLine />
        <h3>Error Loading Data</h3>
        <p>{error?.message || 'Failed to fetch annual herb requirements'}</p>
      </div>
    );
  }

  // Empty state
  if (!requirements || requirements.length === 0) {
    return (
      <div className={styles['herbs-empty']}>
        <RiInboxLine />
        <h3>No Data Available</h3>
        <p>There are no herb requirements to display at this time.</p>
      </div>
    );
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, pagination.totalItems || 0);

  return (
    <>
      <div className={styles['herbs-table-container']}>
        <div className={styles['herbs-table-wrapper']}>
          <table className={styles['herbs-table']}>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Herb Name</th>
                <th>Part Used</th>
                <th>Name in Devnagari</th>
                <th>Part used in Devnagari</th>
                <th>Quantity (Kg)</th>
              </tr>
            </thead>
            <tbody>
              {requirements.map((herb, index) => (
                <tr key={herb.id}>
                  <td>{startItem + index}</td>
                  <td>
                    <div className={styles['herb-name-cell']}>
                      <div className={styles['herb-common-name']}>
                        {herb.herbName}
                      </div>
                      {herb.EnglishName && (
                        <div className={styles['herb-scientific-name']}>
                          {herb.EnglishName}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={styles['part-used-text']}>
                      {herb.partUsed || 'N/A'}
                    </span>
                  </td>
                  <td>
                    <span className={styles['devnagari-text']}>
                      {herb.nameInDevnagari || '-'}
                    </span>
                  </td>
                  <td>
                    <span className={styles['devnagari-text']}>
                      {herb.partUsedinDevnagari || '-'}
                    </span>
                  </td>
                  <td>
                    <span className={styles['quantity-text']}>
                      {formatQuantity(herb.quanity)} Kg
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Info */}
      {pagination.totalPages > 1 && (
        <div className={styles['pagination-info']}>
          Showing <span className={styles['current-range']}>{startItem}-{endItem}</span> of{' '}
          <span className={styles['current-range']}>{pagination.totalItems}</span> entries
        </div>
      )}

      {/* Pagination */}
      <nav className="custome-pagination">
        <Pagination
          total={pagination.totalItems || 0}
          perPage={itemsPerPage}
        />
      </nav>
    </>
  );
};

export default AnnualHerbRequirementsContent;
