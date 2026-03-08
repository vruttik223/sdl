import { useContext } from 'react';
import { Col } from 'reactstrap';
import CartContext from '@/helper/cartContext';
import { useTranslation } from '@/utils/translations';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { RiArrowLeftLine } from 'react-icons/ri';
import SettingContext from '@/helper/settingContext';

const CartSidebar = () => {
  const { cartProducts, getTotal } = useContext(CartContext);
  const { t } = useTranslation('common');
  const { convertCurrency } = useContext(SettingContext);
  const isAuth = Cookies.get('uat');

  return (
    <Col xxl={3} xl={4}>
      <div className="summery-box p-sticky">
        <div className="summery-header">
          <h3>{t('CartTotal')}</h3>
        </div>
        <div className="summery-contain">
          <ul>
            <li>
              <h4>{t('Subtotal')}</h4>
              <h4 className="price">
                {convertCurrency(getTotal(cartProducts)?.toFixed(2))}
              </h4>
            </li>
            <li className="align-items-start">
              <h4>{t('Shipping')}</h4>
              <h4 className="price text-end">{t('CostAtCheckout')}</h4>
            </li>
            <li className="align-items-start">
              <h4>{t('Tax')}</h4>
              <h4 className="price text-end">{t('CostAtCheckout')}</h4>
            </li>
          </ul>
        </div>
        <ul className="summery-total">
          <li className="list-total border-top-0">
            <h4>{t('Total')}</h4>
            <h4 className="price theme-color">
              {convertCurrency(getTotal(cartProducts)?.toFixed(2))}
            </h4>
          </li>
        </ul>
        <div className="button-group cart-button">
          <ul>
            <li>
              <Link
                href={
                  isAuth ? `/checkout` : `/`
                }
                className="btn btn-animation proceed-btn fw-bold"
              >
                {t('ProcessToCheckout')}
              </Link>
            </li>
            <li>
              <Link
                href={`/collections`}
                className="btn btn-light shopping-button text-dark"
              >
                <RiArrowLeftLine /> {t('ReturnToShopping')}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </Col>
  );
};

export default CartSidebar;
