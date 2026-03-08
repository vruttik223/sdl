'use client';
import React from 'react';
import SubLayout from './SubLayout';
import ThemeOptionProvider from '@/helper/themeOptionsContext/ThemeOptionProvider';
import SettingProvider from '@/helper/settingContext/SettingProvider';
import ProductProvider from '@/helper/productContext/ProductProvider';
import CategoryProvider from '@/helper/categoryContext/CategoryProvider';
import AccountProvider from '@/helper/accountContext/AccountProvider';
import UserProvider from '@/helper/userContext/UserProvider';
import CartProvider from '@/helper/cartContext/CartProvider';
import WishlistProvider from '@/helper/wishlistContext/WishlistProvider';
import { ToastContainer } from 'react-toastify';
import BlogProvider from '@/helper/blogContext/BlogProvider';
import CompareProvider from '@/helper/compareContext/CompareProvider';
import ProductIdsProvider from '@/helper/productIdsContext/ProductIdsProvider';
import CurrencyProvider from '@/helper/currencyContext/CurrencyProvider';
import { GoogleMapsProvider } from '@/helper/mapsContext/googleMapsProvider';
import ReactQueryProvider from '@/helper/reactQueryContext/ReactQueryProvider';
import ThemeProvider from '@/providers/ThemeProvider';

const MainLayout = ({ children, dehydratedState }) => {
  return (
    <>
      <ReactQueryProvider dehydratedState={dehydratedState}>
        <ThemeOptionProvider>
          <GoogleMapsProvider>
            <UserProvider>
              <ThemeProvider>
                <AccountProvider>
                  <BlogProvider>
                    <ProductIdsProvider>
                      <CompareProvider>
                        <CartProvider>
                          <WishlistProvider>
                          <CategoryProvider>
                            <ProductProvider>
                              <SettingProvider>
                                <CurrencyProvider>
                                  <SubLayout children={children} />
                                </CurrencyProvider>
                              </SettingProvider>
                            </ProductProvider>
                          </CategoryProvider>
                          </WishlistProvider>
                        </CartProvider>
                      </CompareProvider>
                    </ProductIdsProvider>
                  </BlogProvider>
                </AccountProvider>
              </ThemeProvider>
            </UserProvider>
          </GoogleMapsProvider>
        </ThemeOptionProvider>
      </ReactQueryProvider>
      <ToastContainer
        theme="light"
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        newestOnTop
        toastClassName="app-toast"
        bodyClassName="app-toast-body"
        progressClassName="app-toast-progress"
      />
    </>
  );
};

export default MainLayout;
