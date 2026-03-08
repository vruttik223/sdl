import Image from 'next/image';
import { Input, InputGroup } from 'reactstrap';
import { RiAddLine, RiSubtractLine } from 'react-icons/ri';
import Btn from '@/elements/buttons/Btn';
import { placeHolderImage } from '@/data/CommonPath';

const fallbackProducts = [
  {
    name: 'Swamala Classic',
    weight: '200 gm',
    price: 240,
    compareAt: 280,
    image: placeHolderImage,
  },
  {
    name: 'Hingwashtak Choorna',
    weight: '500 gm',
    price: 320,
    compareAt: 360,
    image: placeHolderImage,
  },
];

const AlternativeProductList = ({ products = fallbackProducts }) => {
  return (
    <div className="cart-products-list alternative-products">
      <div className="alternative-products__header">
        <h6 className="alternative-products__title">You are not eligible to buy this products</h6>
        <h6 className="alternative-products__reason">(Reason will be come here)</h6>
      </div>
      <ul className="order-items">
        {products.map((item, index) => {
          const quantity = item?.quantity || 1;
          const price = item?.price || 0;
          const compareAt = item?.compareAt || 0;
          const name = item?.name || 'Sample product';
          const weight = item?.weight || '500 gm';
          const image = item?.image || placeHolderImage;

          return (
            <li className="order-item alternative-products__item" key={index}>
              <div className="thumb alternative-products__thumb">
                <Image
                  src={image}
                  alt={name}
                  width={48}
                  height={48}
                  draggable={false}
                  unoptimized
                />
              </div>

              <div className="info">
                <span className="name">{name}</span>
                <span className="meta">{weight}</span>
              </div>

              <div className="cart_qty alternative-products__qty">
                <InputGroup>
                  <Btn type="button" className="btn qty-left-minus" disabled>
                    <RiSubtractLine />
                  </Btn>
                  <Input
                    className="input-number qty-input"
                    type="text"
                    name="quantity"
                    value={quantity}
                    readOnly
                  />
                  <Btn type="button" className="btn qty-right-plus" disabled>
                    <RiAddLine />
                  </Btn>
                </InputGroup>
              </div>

              <div className="price alternative-products__price">
                <span className="current">₹ {price.toFixed(2)}</span>
                {compareAt > price && <del>₹ {compareAt.toFixed(2)}</del>}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default AlternativeProductList;

