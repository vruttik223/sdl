import { useState, useMemo, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Col, Row } from 'reactstrap';
import NoDataFound from '@/components/common/NoDataFound';
import Pagination from '@/components/common/Pagination';
import ProductBox1 from '@/components/common/productBox/productBox1/ProductBox1';
import noProduct from '../../../../public/assets/svg/no-product.svg';
import ProductSkeletonComponent from '@/components/common/skeletonLoader/productSkeleton/ProductSkeletonComponent';
import fallbackProductsData from '@/app/api/product/product.json';

const CollectionProducts = ({ filter, grid }) => {
  const { slug } = useParams();
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const perPage = 40;

  // Get products from local JSON file
  const allProducts = useMemo(() => {
    return Array.isArray(fallbackProductsData?.data) ? fallbackProductsData.data : [];
  }, []);

  // Apply filters and sorting to products
  const filteredAndSortedProducts = useMemo(() => {
    let products = [...allProducts];

    // Apply category filter
    if (filter?.category?.length > 0) {
      products = products.filter((product) =>
        product.categories?.some((cat) =>
          filter.category.includes(cat.slug) || filter.category.includes(cat.name)
        )
      );
    }

    // Apply price filter
    if (filter?.price?.length > 0) {
      products = products.filter((product) => {
        const productPrice = product.sale_price || product.price;
        return filter.price.some((priceRange) => {
          const [min, max] = priceRange.split('-').map(Number);
          return productPrice >= min && productPrice <= max;
        });
      });
    }

    // Apply rating filter
    if (filter?.rating?.length > 0) {
      products = products.filter((product) =>
        filter.rating.some((rating) => product.rating_count >= Number(rating))
      );
    }

    // Apply sorting
    if (filter?.sortBy) {
      switch (filter.sortBy) {
        case 'asc':
          products.sort((a, b) => (a.sale_price || a.price) - (b.sale_price || b.price));
          break;
        case 'desc':
          products.sort((a, b) => (b.sale_price || b.price) - (a.sale_price || a.price));
          break;
        case 'a-z':
          products.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'z-a':
          products.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case 'high-rated':
          products.sort((a, b) => (b.rating_count || 0) - (a.rating_count || 0));
          break;
        case 'low-rated':
          products.sort((a, b) => (a.rating_count || 0) - (b.rating_count || 0));
          break;
        default:
          break;
      }
    }

    return products;
  }, [allProducts, filter]);

  // Calculate pagination
  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    
    return {
      products: filteredAndSortedProducts.slice(startIndex, endIndex),
      total: filteredAndSortedProducts.length,
      current_page: page,
      per_page: perPage,
    };
  }, [filteredAndSortedProducts, page, perPage]);

  // Simulate loading state
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [filter, page]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [filter]);

  return (
    <>
      {isLoading ? (
        <Row
          // xxl={grid !== 3 && grid !== 5 ? 4 : ''}
          // xl={grid == 5 ? 5 : 3}
          // lg={grid == 5 ? 4 : 2}
          // md={3}
          // xs={2}
          className={`g-sm-4 g-3 product-list-section ${grid == 'list' ? 'list-style' : ''}`}
        >
          <ProductSkeletonComponent item={20} />
        </Row>
      ) : paginatedData?.products?.length > 0 ? (
        <Row
          // xxl={grid !== 3 && grid !== 5 ? 4 : ''}
          // xl={grid == 5 ? 5 : 3}
          // lg={grid == 5 ? 4 : 2}
          // md={3}
          // xs={2}
          className={`g-sm-4 g-3 product-list-section ${grid == 'list' ? 'list-style' : ''}`}
        >
          {paginatedData.products.map((product, i) => (
            <Col xl={3} lg={4} md={6} xs={6} key={product.id || i}>
              <ProductBox1
                imgUrl={product?.product_thumbnail}
                productDetail={{ ...product }}
                classObj={{ productBoxClass: 'product-box-3' }}
              />
            </Col>
          ))}
        </Row>
      ) : (
        <NoDataFound
          data={{
            imageUrl: noProduct,
            customClass: 'no-data-added collection-no-data',
            title: "Sorry! Couldn't find the products you were looking For!",
            description:
              'Please check if you have misspelt something or try searching with other way.',
            height: 345,
            width: 345,
          }}
        />
      )}

      {paginatedData?.products?.length > 0 && (
        <nav className="custome-pagination">
          <Pagination
            current_page={paginatedData.current_page}
            total={paginatedData.total}
            perPage={paginatedData.per_page}
            setPage={setPage}
          />
        </nav>
      )}
    </>
  );
};

export default CollectionProducts;
