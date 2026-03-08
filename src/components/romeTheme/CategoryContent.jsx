import Image from 'next/image';
import React, { useContext } from 'react';
import { placeHolderImage } from '../../data/CommonPath';
import Link from 'next/link';
import { useTranslation } from '@/utils/translations';

const CategoryContent = ({ elem }) => {
  const { t } = useTranslation('common');
  return (
    <div>
      <div className="shop-category-box border-0">
        <Link href={`/collections?category=${elem?.slug}`} className="circle-1">
          <Image
            src={elem?.category_image?.original_url || placeHolderImage}
            className="img-fluid"
            alt={elem?.name}
            width={106}
            height={90}
            unoptimized
          />
        </Link>
        <div className="category-name">
          <h6>{elem?.name}</h6>
        </div>
      </div>
    </div>
  );
};

export default CategoryContent;
