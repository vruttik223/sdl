'use client';

import { useState } from 'react';
import MenuList from './MenuList';
import { headerMenu } from '@/data/HeadersMenu';

// Filter to show only Home, About Us, Shop, Blogs
const primaryNavItems = headerMenu.filter(
  (item) => ['Home', 'About Us', 'Shop', 'Blogs'].includes(item.title)
);

const PrimaryNavBar = () => {
  const [isOpen, setIsOpen] = useState([]);

  return (
    <div className="primary-nav-bar">
      <div className="container-fluid-lg">
        <nav className="primary-nav main-nav navbar navbar-expand-xl navbar-light">
          <ul className="navbar-nav">
            {primaryNavItems.map((menu, i) => (
              <MenuList
                menu={menu}
                key={menu.id || i}
                customClass={menu.customClass}
                anchorClass={menu.children ? 'nav-link dropdown-toggle' : 'nav-link'}
                level={0}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
              />
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default PrimaryNavBar;
