import NoDataFound from '@/components/common/NoDataFound';
import Pagination from '@/components/common/Pagination';
import Loader from '@/layout/loader';
import request from '@/utils/axiosUtils';
import { RefundAPI } from '@/utils/axiosUtils/API';
import { useQuery } from '@tanstack/react-query';
import { useContext, useEffect, useState } from 'react';
import emptyImage from '../../../../public/assets/svg/empty-items.svg';
import { Table } from 'reactstrap';
import { dateFormat } from '@/utils/customFunctions/DateFormat';
import { useTranslation } from '@/utils/translations';
import AccountHeading from '@/components/common/AccountHeading';

const RefundTable = () => {
  const { t } = useTranslation('common');
  const [page, setPage] = useState(1);
  const { data, isLoading, refetch } = useQuery({
    queryKey: [RefundAPI],
    queryFn: () => request({ url: RefundAPI, params: { page, paginate: 10 } }),
    enabled: false,
    refetchOnWindowFocus: false,
    select: (res) => res?.data,
  });
  useEffect(() => {
    refetch();
  }, [page]);
  if (isLoading) return <Loader />;
  return (
    <>
      <AccountHeading title="Refund" />
      {data?.data?.length > 0 ? (
        <>
          <div className="total-box mt-0">
            <div className="data-table-container">
              {/* <div className="data-table-header">
                <h4 className="table-title">{t('Refunds')}</h4>
              </div> */}
              <div className="table-responsive">
                <Table className="data-table">
                  <thead>
                    <tr>
                      <th>{t('No')}</th>
                      <th>{t('Order')}</th>
                      <th>{t('Status')}</th>
                      <th>{t('Reason')}</th>
                      <th>{t('CreatedAt')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.data?.map((refund, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>
                          <span className="fw-bolder">
                            #{refund?.order?.order_number}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge status-${refund.status}`}>
                            {refund.status}
                          </span>
                        </td>
                        <td>{refund?.reason}</td>
                        <td className="date-cell">{dateFormat(refund?.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
          <nav className="custome-pagination">
            <Pagination
              current_page={data?.transactions?.current_page}
              total={data?.transactions?.total}
              per_page={data?.transactions?.per_page}
              setPage={setPage}
            />
          </nav>
        </>
      ) : (
        <NoDataFound
          data={{
            customClass: 'no-data-added',
            imageUrl: emptyImage,
            title: 'NoRefundsFound',
            description: 'YouHaveNoRefundsProcessedYet',
            height: 300,
            width: 300,
          }}
        />
      )}
    </>
  );
};

export default RefundTable;
