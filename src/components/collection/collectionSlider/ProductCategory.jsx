'use client';

import { useState } from 'react';
import { 
  FaShoppingCart, 
  FaUserMd, 
  FaStore, 
  FaThLarge
} from 'react-icons/fa';
import styles from './ProductCategory.module.scss';
import WrapperComponent from '@/components/common/WrapperComponent';

const ProductCategory = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = [
    { id: 0, name: 'All', icon: <FaThLarge /> },
    { id: 1, name: 'Online Products', icon: <FaShoppingCart /> },
    { id: 2, name: 'Exclusive for Physicians', icon: <FaUserMd /> },
    { id: 3, name: 'Retail Store Products', icon: <FaStore /> },
  ];

  return (
    // <WrapperComponent colProps={{ xs: 12 }}>
    <div className="container-fluid-lg category-slider">
    <nav className={styles.categoryNav}>
      <ul className={styles.categoryList}>
        {categories.map((category) => (
          <li key={category.id}>
            <button
              className={`${styles.categoryItem} ${activeCategory === category.name ? styles.active : ''}`}
              onClick={() => setActiveCategory(category.name)}
            >
              <span className={styles.categoryIcon}>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
    </div>
    // </WrapperComponent>
  );
};

export default ProductCategory;