import React, { useContext } from 'react';
import ThemeOptionContext from '@/helper/themeOptionsContext';
import { Col } from 'reactstrap';
import Slider from 'react-slick';
import { topBarContentSlider } from '../../../../data/SliderSettings';

const TopbarSlider = ({ customClass }) => {
  const { themeOption } = useContext(ThemeOptionContext);
  return (
    <>
      {customClass ? (
        <div className="notification-slider">
          <Slider {...topBarContentSlider}>
            {themeOption?.header?.top_bar_content.length > 0 &&
              themeOption?.header?.top_bar_content?.map((elem, i) => (
                <div key={i}>
                  <div className={`timer-notification ${customClass}`}>
                    <div className='mb-0'> 
                      <strong className="me-1">{elem?.content}</strong>
                    </div>
                  </div>
                </div>
              ))}
          </Slider>
        </div>
      ) : (
        <Col xs={7} sm={9} xxl={9} className="">
          <div className="header-offer">
            <div className="notification-slider no-arrow">
              <Slider {...topBarContentSlider}>
                {themeOption?.header?.top_bar_content.length > 0 &&
                  themeOption?.header?.top_bar_content?.map((elem, i) => (
                    <div key={i}>
                      <div className={`timer-notification`}>
                        <div className='mb-0'> 
                          <div
                            dangerouslySetInnerHTML={{ __html: elem?.content }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </Slider>
            </div>
          </div>
        </Col>
      )}
    </>
  );
};

export default TopbarSlider;
