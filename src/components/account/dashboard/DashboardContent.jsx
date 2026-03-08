import AccountHeading from '@/components/common/AccountHeading';
import AccountContext from '@/helper/accountContext';
import Image from 'next/image';
import { useContext } from 'react';
import { Col, Row } from 'reactstrap';
import coinSvg from '../../../../public/assets/images/svg/coin.svg';
import orderSvg from '../../../../public/assets/images/svg/order.svg';
import wallerSvg from '../../../../public/assets/images/svg/wallet.svg';
import ProfileInformation from './ProfileInformation';

const DashboardContent = () => {
  const { accountData } = useContext(AccountContext);

  const formatAmount = (value) => Number(value ?? 0).toFixed(2);

  const rewardSummary = [
    {
      title: 'Balance',
      value: formatAmount(accountData?.wallet?.balance),
      icon: wallerSvg,
    },
    {
      title: 'Total Coins',
      value: formatAmount(accountData?.point?.balance),
      icon: coinSvg,
    },
    {
      title: 'Orders',
      value: 0,
      icon: orderSvg,
    },
  ];

  return (
    <div className="dashboard-home">
      <AccountHeading title="My Profile" />
      <Row className="g-4 dashboard-wireframe-layout">
        <Col xl={8} lg={12}>
          <ProfileInformation />
        </Col>

        <Col xl={4} lg={12}>
          <div className="reward-stack">
            {rewardSummary.map((item) => (
              <div className="reward-card" key={item.title}>
                <div className="reward-icon">
                  <Image src={item.icon} alt={item.title} height={48} width={48} />
                </div>
                <div className="reward-content">
                  <p className="text-content mb-1">{item.title}</p>
                  <h4 className="mb-0">{item.value}</h4>
                </div>
              </div>
            ))}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardContent;
