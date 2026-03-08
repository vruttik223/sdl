import { useContext } from 'react';

const ProductBagde = ({ productDetail }) => {
  return (
    <>
      {productDetail?.is_sale_enable ? (
        <div className="label-tag sale-tag">
          <span>Sale</span>
        </div>
      ) : productDetail?.is_featured ? (
        <div className="label-tag featured-tag">
          <span>Featured</span>
        </div>
      ) : null}
    </>
  );
};

export default ProductBagde;
