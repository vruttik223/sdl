import Btn from '@/elements/buttons/Btn';
import CartContext from '@/helper/cartContext';
import { useTranslation } from '@/utils/translations';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';

const VariationBuyNow = ({ cloneVariation, setVariationModal }) => {
  const { t } = useTranslation('common');
  const { handleIncDec } = useContext(CartContext);
  const router = useRouter();
  
  const productInStock = cloneVariation?.selectedVariation
    ? cloneVariation?.selectedVariation?.stock_status == 'in_stock'
    : cloneVariation?.product?.stock_status == 'in_stock';

  const handleBuyNow = (allProduct) => {
    if (productInStock) {
      // Store product for instant checkout (Buy Now)
      const buyNowProduct = {
        product_id: allProduct.id,
        product: allProduct,
        quantity: cloneVariation.productQty || 1,
        variation: cloneVariation?.selectedVariation || null,
        sub_total: (cloneVariation?.selectedVariation?.sale_price || allProduct?.sale_price || allProduct?.price || 0) * (cloneVariation.productQty || 1),
        price: cloneVariation?.selectedVariation?.sale_price || allProduct?.sale_price || allProduct?.price || 0,
      };
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('instantBuyProduct', JSON.stringify(buyNowProduct));
      }
      setVariationModal(false);
      router.push('/checkout');
    }
  };

  return (
    <button
      className="btn-buy-now"
      disabled={!productInStock}
      onClick={() => handleBuyNow(cloneVariation.product)}
    >
      <span className="label-full">Buy Now</span>
      <span className="label-short">Buy</span>
    </button>
  );
};

export default VariationBuyNow;
