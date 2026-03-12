'use client';
import { useContext, useEffect, useState } from 'react';
import Breadcrumb from '../common/Breadcrumb';
import { useCustomSearchParams } from '@/utils/hooks/useCustomSearchParams';
import LayoutSidebar from './layoutSidebar';
import MainCollectionSlider from './collectionSlider';
import CollectionBanner from './collectionBanner';
import CollectionLeftSidebar from './collectionLeftSidebar';
import CollectionOffCanvas from './collectionOffcanvas';
import ThemeOptionContext from '@/helper/themeOptionsContext';
import CollectionRightSidebar from './collectionRightSidebar';
import CollectionNoSidebar from './collectionNoSidebar';
import Loader from '@/layout/loader';

const CollectionContain = () => {
  const [filter, setFilter] = useState({
    category: [],
    price: [],
    attribute: [],
    rating: [],
    sortBy: '',
    field: '',
  });
  const { themeOption, isLoading } = useContext(ThemeOptionContext);
  const [category, attribute, price, rating, sortBy, field, layout] =
    useCustomSearchParams([
      'category',
      'attribute',
      'price',
      'rating',
      'sortBy',
      'field',
      'layout',
    ]);
  // Determine the desired collection layout:
  // 1. Use explicit ?layout= query param if provided
  // 2. Otherwise fall back to themeOption.collection.collection_layout
  // 3. If that is missing/invalid, use a safe default so the page always renders
  const collectionLayout = layout?.layout
    ? layout?.layout
    : themeOption?.collection?.collection_layout;
  useEffect(() => {
    setFilter((prev) => {
      return {
        ...prev,
        category: category ? category?.category?.split(',') : [],
        attribute: attribute ? attribute?.attribute?.split(',') : [],
        price: price ? price?.price?.split(',') : [],
        rating: rating ? rating?.rating?.split(',') : [],
        sortBy: sortBy ? sortBy?.sortBy : '',
        field: field ? field?.field : '',
      };
    });
  }, [category, attribute, price, rating, sortBy, field]);

  const isCollectionMatch = {
    collection_category_slider: (
      <MainCollectionSlider filter={filter} setFilter={setFilter} />
    ),
    collection_category_sidebar: (
      <LayoutSidebar filter={filter} setFilter={setFilter} />
    ),
    collection_banner: (
      <CollectionBanner filter={filter} setFilter={setFilter} />
    ),
    collection_offcanvas_filter: (
      <CollectionOffCanvas filter={filter} setFilter={setFilter} />
    ),
    collection_no_sidebar: (
      <CollectionNoSidebar filter={filter} setFilter={setFilter} />
    ),
    collection_left_sidebar: (
      <CollectionLeftSidebar filter={filter} setFilter={setFilter} />
    ),
    collection_right_sidebar: (
      <CollectionRightSidebar filter={filter} setFilter={setFilter} />
    ),
    collection_3_grid: (
      <CollectionLeftSidebar filter={filter} setFilter={setFilter} />
    ),
    collection_4_grid: (
      <CollectionLeftSidebar filter={filter} setFilter={setFilter} />
    ),
    collection_5_grid: (
      <CollectionLeftSidebar filter={filter} setFilter={setFilter} />
    ),
    collection_list_view: (
      <CollectionLeftSidebar filter={filter} setFilter={setFilter} />
    ),
  };

  // Ensure we always have a valid key so something renders
  const validLayouts = Object.keys(isCollectionMatch);
  const defaultLayout = 'collection_left_sidebar';
  const safeLayout = validLayouts.includes(collectionLayout)
    ? collectionLayout
    : defaultLayout;

  if (isLoading) return <Loader />;
  return (
    <>
      {/* <Breadcrumb
        title={'Products'}
        subNavigation={[{ name: 'products' }]}
      /> */}
      {isCollectionMatch[safeLayout]}
      
    </>
  );
};

export default CollectionContain;
