import SettingContext from '@/helper/settingContext';
import { useTranslation } from '@/utils/translations';
import Link from 'next/link';
import React, { useContext } from 'react';
import { RiEyeLine } from 'react-icons/ri';
import { Card, CardBody, Table } from 'reactstrap';

const SubOrders = ({ data }) => {
  const { t } = useTranslation('common');
  const { convertCurrency } = useContext(SettingContext);
  return (
    <>
      <Card>
        <CardBody>
          <div className="tracking-wrapper table-responsive">
            <Table className="product-table">
              <thead>
                <tr>
                  <th scope="col">{t('OrderNumber')}</th>
                  <th scope="col">{t('OrderDate')}</th>
                  <th scope="col">{t('TotalAmount')}</th>
                  <th scope="col">{t('Status')}</th>
                  {/* <th scope="col">{t('Action')}</th> */}
                </tr>
              </thead>
              <tbody>
                {data?.sub_orders?.map((subOrder, i) => (
                  <tr key={i}>
                    <td>
                      <h6 className="fw-bolder">
                        {'#' + subOrder?.order_number}
                      </h6>
                    </td>
                    <td>
                      <h6>{subOrder?.created_at}</h6>
                    </td>
                    <td>
                      <h6>{convertCurrency(subOrder?.amount)}</h6>
                    </td>
                    <td>
                      <h6>
                        <div className={`status-${subOrder.order_status.slug}`}>
                          <span>{subOrder?.order_status.name}</span>
                        </div>
                      </h6>
                    </td>
                    {/* <td>
                      <Link
                        href={`/account/order/details/${subOrder.order_number}`}
                      >
                        <RiEyeLine />
                      </Link>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </CardBody>
      </Card>
    </>
  );
};

export default SubOrders;
