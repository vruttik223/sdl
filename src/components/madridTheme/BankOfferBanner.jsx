import { useContext } from 'react';
import Image from 'next/image';
import Slider from 'react-slick';
import { Input } from 'reactstrap';
import WrapperComponent from '../common/WrapperComponent';
import CustomHeading from '../common/CustomHeading';
import { bankOfferSliderOption } from '../../data/SliderSettings';
import Btn from '@/elements/buttons/Btn';
import { useTranslation } from '@/utils/translations';

const BankOfferBanner = ({ dataAPI }) => {
  const { t } = useTranslation('common');
  const CopyCode = (value) => {
    navigator.clipboard.writeText(value);
  };
  return (
    <WrapperComponent
      classes={{ sectionClass: 'bank-section overflow-hidden' }}
      noRowCol={true}
    >
      <CustomHeading
        title={dataAPI?.title}
        customClass={'section-t-space'}
        customTitleClass={'title'}
      />
      <div className="slider-bank-3 arrow-slider slick-height bank-box">
        <Slider {...bankOfferSliderOption}>
          {dataAPI?.offers?.map((offer, i) => (
            <div key={i}>
              <div className="bank-offer">
                <div className="bank-left">
                  <Image
                    src={offer?.image_url}
                    className="img-fluid w-100"
                    alt="bank-image"
                    height={225}
                    width={515}
                    unoptimized
                  />
                </div>

                <div className="bank-footer bank-footer-1">
                  <h4>
                    {t('Code')} :
                    <Input defaultValue={offer?.coupon_code} />
                  </h4>
                  <Btn
                    type="button"
                    className="bank-coupon"
                    onClick={() => CopyCode(offer.coupon_code)}
                  >
                    {t('CopyCode')}
                  </Btn>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </WrapperComponent>
  );
};

export default BankOfferBanner;
