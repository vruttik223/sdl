import { useContext } from 'react';
import { useTranslation } from '@/utils/translations';

const CustomHeading = (props) => {
  const { t } = useTranslation('common');
  const {
    title,
    subTitle,
    svgUrl,
    customClass,
    customTitleClass,
    svgClass = '',
  } = props;

  const rootClass =
    customTitleClass || (customClass ? `${customClass} ` : 'title');

  return (
    <div className={rootClass}>
      <div>
        <h2>{t(title)}</h2>
        {svgUrl && <span className="title-leaf">{svgUrl}</span>}
        {subTitle && <p>{t(subTitle)}</p>}
      </div>
      {props.children && props.children}
    </div>
  );
};

export default CustomHeading;
