/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { RiSeedlingLine, RiSunLine, RiLeafLine, RiHeart2Line, RiAppleLine, RiFireLine } from 'react-icons/ri';
import WrapperComponent from '@/components/common/WrapperComponent';
import CustomHeading from '@/components/common/CustomHeading';
import { LeafSVG } from '@/components/common/CommonSVG';
import ProductBox1 from '@/components/common/productBox/productBox1/ProductBox1';
import styles from './ShopByIngredients.module.scss';

// Dummy ingredients and products for development / fallback
const DUMMY_INGREDIENTS = [
  {
    id: 'rice',
    name: 'Rice',
    icon: RiSeedlingLine,
    description: 'Gently exfoliate and brighten skin',
  },
  {
    id: 'ubtan',
    name: 'Ubtan',
    icon: RiSunLine,
    description: 'Revitalise and polish your glow',
  },
  {
    id: 'vitamin-c',
    name: 'Vitamin C',
    icon: RiFireLine,
    description: 'Boost radiance and target dullness',
  },
  {
    id: 'rosemary',
    name: 'Rosemary',
    icon: RiLeafLine,
    description: 'Refresh scalp and strengthen roots',
  },
  {
    id: 'beetroot',
    name: 'Beetroot',
    icon: RiHeart2Line,
    description: 'Nourish skin with antioxidants',
  },
  {
    id: 'onion',
    name: 'Onion',
    icon: RiAppleLine,
    description: 'Support hair growth and density',
  },
];

// Simple placeholder products for visual layout; replace with real data later.
const buildDummyProducts = (ingredientId) => {
  return Array.from({ length: 4 }).map((_, index) => {
    const baseName = DUMMY_INGREDIENTS.find((ing) => ing.id === ingredientId)?.name || 'Herbal';

    return {
      id: `${ingredientId}-${index + 1}`,
      slug: `dummy-${ingredientId}-${index + 1}`,
      name: `${baseName} Care Product`,
      short_description:
        '<span>Ayurvedic formulation enriched with key herbs to support daily skin and hair care.</span>',
      unit: 'ml',
      weight: 100 + index * 20,
      stock_status: 'in_stock',
      sale_price: 199 + index * 50,
      price: 299 + index * 50,
      discount: 20,
      rating: 4.5,
      rating_count: 120 + index * 30,
      product_thumbnail:
        'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=600&h=600&fit=crop',
    };
  });
};

const ShopByIngredients = () => {
  const [activeIngredientId, setActiveIngredientId] = useState(DUMMY_INGREDIENTS[0].id);

  const activeIngredient = useMemo(
    () => DUMMY_INGREDIENTS.find((ing) => ing.id === activeIngredientId) || DUMMY_INGREDIENTS[0],
    [activeIngredientId],
  );

  const products = useMemo(
    () => buildDummyProducts(activeIngredientId),
    [activeIngredientId],
  );

  return (
    <WrapperComponent
      classes={{ sectionClass: styles['ingredients-section'] }}
      noRowCol={true}
    >
      <div className={styles['heading-wrapper']}>
        <CustomHeading
          customClass="mb-0 text-center"
          title="Shop By Ingredients"
          subTitle=""
          svgUrl={<LeafSVG className="icon-width" />}
        />
        <p className={styles['subtitle']}>
          {activeIngredient?.description || 'Gently exfoliate and brighten skin'}
        </p>
      </div>

      <div className={styles['ingredients-scroll-wrapper']}>
        <div className={styles['ingredients-list']}>
          {DUMMY_INGREDIENTS.map((ingredient) => {
            const Icon = ingredient.icon;
            const isActive = ingredient.id === activeIngredientId;

            return (
              <button
                key={ingredient.id}
                type="button"
                className={`${styles['ingredient-item']} ${isActive ? styles['ingredient-item--active'] : ''}`}
                onClick={() => setActiveIngredientId(ingredient.id)}
              >
                <span className={styles['ingredient-icon']}>
                  <span className={styles['ingredient-icon-inner']}>
                    <Icon aria-hidden="true" className='icon'/>
                  </span>
                </span>
                <span className={styles['ingredient-label']}>{ingredient.name}</span>
                {isActive && <span className={styles['ingredient-underline']} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* <div className={styles['products-wrapper']}>
        <div className={styles['products-grid']}>
          {products.map((product) => (
            <ProductBox1
              key={product.id}
              imgUrl={product.product_thumbnail}
              productDetail={product}
              addAction={false}
              classObj={{ productBoxClass: 'h-100' }}
            />
          ))}
        </div>
      </div> */}
    </WrapperComponent>
  );
};

export default ShopByIngredients;

