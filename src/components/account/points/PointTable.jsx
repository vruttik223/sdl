import { useContext, useState } from 'react';
import Image from 'next/image';
import { Col, Row, Table } from 'reactstrap';
import { RiInformation2Line } from 'react-icons/ri';
import { Tooltip } from 'reactstrap';
import Pagination from '@/components/common/Pagination';
import { dateFormat } from '@/utils/customFunctions/DateFormat';
import CoinSVG from '../../../../public/assets/images/svg/coin.svg';
import wallerSvg from '../../../../public/assets/images/svg/wallet.svg';
import SettingContext from '@/helper/settingContext';

const PointTable = ({ data }) => {
  const { settingData } = useContext(SettingContext);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [tooltipOpen2, setTooltipOpen2] = useState(false);
  const [tooltipOpen3, setTooltipOpen3] = useState(false);

  const toggle = () => setTooltipOpen(!tooltipOpen);
  const toggle2 = () => setTooltipOpen2(!tooltipOpen2);
  const toggle3 = () => setTooltipOpen3(!tooltipOpen3);

  return (
    <>
      <div className="total-box mt-0">
        <Row>
          {/* <Col xxl={4} lg={6} md={4} sm={6}>
            <div className="total-contain wallet-bg">
              <Image src={CoinSVG} alt="CoinSVG" height={60} width={60} />
              <div className="total-detail">
                <h5>Redeemable Coins <RiInformation2Line /></h5>
                <h3>{data?.balance ? data?.balance : 0}</h3>
              </div>
            </div>
          </Col>
          <Col xxl={4} lg={6} md={4} sm={6}>
            <div className="total-contain wallet-bg">
              <Image src={CoinSVG} alt="CoinSVG" height={60} width={60} />
              <div className="total-detail">
                <h5>Pending Coins</h5>
                <h3>{data?.balance ? data?.balance : 0}</h3>
              </div>
            </div>
          </Col>
          <Col xxl={4} lg={6} md={4} sm={6}>
            <div className="total-contain wallet-bg">
              <Image src={CoinSVG} alt="CoinSVG" height={60} width={60} />
              <div className="total-detail">
                <h5>Pending Coins</h5>
                <h3>{data?.balance ? data?.balance : 0}</h3>
              </div>
            </div>
          </Col> */}
          <Col xxl={4} lg={6} md={4} sm={6}>
            <div className="total-contain">
              <Image
                src={CoinSVG}
                className="img-1"
                alt="CoinSVG"
                height={90}
                width={90}
              />
              <Image src={CoinSVG} alt="CoinSVG" height={60} width={60} />
              <div className="total-detail">
                <h5>
                  Total Earned Coins <RiInformation2Line id="totalEarnedCoins" />
                  <Tooltip
                    isOpen={tooltipOpen}
                    target="totalEarnedCoins"
                    toggle={toggle}
                  >
                    Total Earned Coins
                  </Tooltip>
                </h5>
                <h3>{data?.balance ? data?.balance : 0}</h3>
              </div>
            </div>
          </Col>
          <Col xxl={4} lg={6} md={4} sm={6}>
            <div className="total-contain">
              <Image
                src={CoinSVG}
                className="img-1"
                alt="CoinSVG"
                height={90}
                width={90}
              />
              <Image src={CoinSVG} alt="CoinSVG" height={60} width={60} />
              <div className="total-detail">
                <h5>
                  Redeemable Coins <RiInformation2Line id="redeemableCoins" />
                  <Tooltip
                    isOpen={tooltipOpen2}
                    target="redeemableCoins"
                    toggle={toggle2}
                  >
                    Redeemable Coins
                  </Tooltip>
                </h5>
                <h3>{data?.balance ? data?.balance : 0}</h3>
              </div>
            </div>
          </Col>
          <Col xxl={4} lg={6} md={4} sm={6}>
            <div className="total-contain">
              <Image
                src={CoinSVG}
                className="img-1"
                alt="CoinSVG"
                height={90}
                width={90}
              />
              <Image src={CoinSVG} alt="CoinSVG" height={60} width={60} />
              <div className="total-detail">
               <h5>
                  Pending Coins <RiInformation2Line id="pendingCoins" />
                  <Tooltip
                    isOpen={tooltipOpen3}
                    target="pendingCoins"
                    toggle={toggle3}
                  >
                    These coins are pending and will be added to your redeemable balance once they are confirmed. 
                  </Tooltip>
                </h5>
                <h3>{data?.balance ? data?.balance : 0}</h3>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="data-table-container">
              {/* <div className="data-table-header">
                <h4 className="table-title">Transactions</h4>
              </div> */}
              <div className="table-responsive" data-lenis-prevent>
                <Table className="data-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.transactions?.data && data.transactions.data.length > 0 ? (
                      data.transactions.data.map((transaction, i) => (
                        <tr key={i}>
                          <td className="date-cell">{dateFormat(transaction?.created_at)}</td>
                          {/* <td className="date-cell">{formatDate(transaction?.created_at)}</td> */}
                          <td className="amount-cell">{transaction?.amount}</td>
                          <td>
                            <span className={`status-badge status-${transaction?.type}`}>
                              {transaction?.type}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="empty-state">
                        <td colSpan="3">No transactions found</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <nav className="custome-pagination">
        <Pagination
          total={data?.transactions?.total}
          perPage={data?.transactions?.per_page}
        />
      </nav>
    </>
  );
};

export default PointTable;
