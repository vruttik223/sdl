import { useContext } from 'react';
import ProductBox1Rating from '@/components/common/productBox/productBox1/ProductBox1Rating';
import StoreImage from '../StoreImage';
import SellerSocialCard from './SellerSocialCard';
import { useTranslation } from '@/utils/translations';

const SellerBasicCard = ({ StoreData }) => {
  const { t } = useTranslation('common');
  return (
    <div className="vendor-detail-box">
      <div className="vendor-name vendor-bottom">
        <div className="vendor-logo">
          <StoreImage customClass={'img-fluid'} elem={StoreData} />
          <div>
            <h3>{StoreData?.store_name}</h3>
            <div className="product-rating vendor-rating">
              <div className="product-rating">
                <ProductBox1Rating totalRating={StoreData?.rating_count} />
                <h6 className="ms-2">
                  ({StoreData?.reviews_count} {t('Reviews')})
                </h6>
              </div>
            </div>
          </div>
        </div>
        <p>{StoreData?.description}</p>
      </div>
      <SellerSocialCard StoreData={StoreData} />
    </div>
  );
};
export default SellerBasicCard;
