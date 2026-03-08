import React, { Fragment, useContext } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Col, Row } from 'reactstrap';
import MenuSlider from './MenuSlider';
import ThemeOptionContext from '@/helper/themeOptionsContext';

const MenuList = ({
  menu,
  customClass,
  anchorClass,
  isOpen,
  setIsOpen,
  level,
}) => {
  const { setMobileSideBar } = useContext(ThemeOptionContext);

  const handleCloseSidebar = () => {
    if (setMobileSideBar) {
      setMobileSideBar(false);
    }
  };

  return (
    <>
      <li
        className={`${customClass ? customClass : ''} ${menu?.badge ? 'new-nav-item' : ''} ${menu.children ? 'dropdown-mega' : ''}`}
      >
        {menu?.path ? (
          <a
            className={`${anchorClass ? anchorClass : 'nav-link dropdown-toggle'}`}
            // href={{ pathname: `${menu?.path}`, query: menu?.params }}
            href={menu?.path}
            onClick={handleCloseSidebar}
          >
            {menu?.title}
          </a>
        ) : (
          <>
            <a
              className={`${anchorClass ? anchorClass : 'nav-link dropdown-toggle'}`}
              onClick={() => {
                const temp = isOpen.slice();
                temp[level] = menu.title !== temp[level] && menu.title;
                setIsOpen(temp);
              }}
            >
              {menu?.title}
              {menu?.badge && (
                <label className="new-dropdown">{menu?.badge}</label>
              )}
            </a>
          </>
        )}

        {menu?.styleType == 'image' && (
          <div
            className={`dropdown-menu dropdown-menu-2 dropdown-image ${!isOpen.length ? 'show' : isOpen[level] === menu.title ? 'show' : ''}`}
          >
            <div className="dropdown-column">
              {menu?.children?.map((data, i) => (
                <Link
                  className={'dropdown-item'}
                  href={{
                    pathname: `${data?.path}`,
                    query: data?.params,
                  }}
                  key={i}
                  onClick={handleCloseSidebar}
                >
                  <Image
                    src={data.image}
                    className="img-fluid"
                    alt={data.image}
                    height={500}
                    width={500}
                    unoptimized
                  />
                  <span>{data?.title}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {menu?.styleType == 'link' && (
          <div
            className={`dropdown-menu dropdown-menu-2 ${isOpen[level] === menu.title ? 'show' : ''}`}
          >
            <Row>
              <>
                {menu?.children?.map((elem, i) => (
                  <Col
                    xl={menu?.title === 'Shop' ? 4 : 6}
                    className="dropdown-column"
                    key={i}
                  >
                    {elem?.column?.map((head, i) => (
                      <Fragment key={i}>
                        {head?.type == 'sub' ? (
                          <h5
                            className={`dropdown-header ${head?.colHeadClass ?? ''}`}
                          >
                            {head?.title}
                          </h5>
                        ) : head?.type == 'external_link' ? (
                          <Link
                            className={'dropdown-item text-wrap'}
                            href={head?.path}
                            target="_blank"
                            onClick={handleCloseSidebar}
                          >
                            {head?.title}
                            {head?.label && (
                              <label
                                className={`menu-label ${head?.labelClass ?? ''}`}
                              >
                                {head?.label}
                              </label>
                            )}
                          </Link>
                        ) : (
                          <Link
                            className={'dropdown-item text-wrap'}
                            href={{
                              pathname: `/${head?.path}`,
                              query: head?.params,
                            }}
                            onClick={handleCloseSidebar}
                          >
                            {head?.title}
                            {head?.label && (
                              <label
                                className={`menu-label ${head?.labelClass ?? ''}`}
                              >
                                {head?.label}
                              </label>
                            )}
                          </Link>
                        )}
                      </Fragment>
                    ))}
                  </Col>
                ))}
              </>
              <MenuSlider menu={menu} />
            </Row>
          </div>
        )}
        {menu?.children && !menu?.customChildren && (
          <ul
            className={`dropdown-menu ${isOpen[level] === menu.title ? 'show' : ''}`}
          >
            {menu.children && (
              <>
                {menu.children.map((childMenu, i) => (
                  <MenuList
                    menu={childMenu}
                    key={i}
                    anchorClass={'dropdown-item'}
                    level={level + 1}
                    setIsOpen={setIsOpen}
                    isOpen={isOpen}
                  />
                ))}
              </>
            )}
          </ul>
        )}
      </li>
    </>
  );
};

export default MenuList;
