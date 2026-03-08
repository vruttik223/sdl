'use client';

import { useEffect, useRef } from 'react';
import { RiMapPinLine, RiPhoneLine, RiMailLine } from 'react-icons/ri';

const StoreListItem = ({ store, isSelected, onClick }) => {
  const itemRef = useRef(null);

  useEffect(() => {
    if (isSelected && itemRef.current) {
      itemRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isSelected]);

  const formatAddress = () => {
    const parts = [
      store.addressLine1,
      store.addressLine2,
      store.city,
      store.state,
      store.pincode,
    ].filter(Boolean);

    return parts.join(', ');
  };

  return (
    <div
      ref={itemRef}
      className={`store-list-item ${isSelected ? 'is-selected' : ''}`}
      onClick={() => onClick(store)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(store);
        }
      }}
    >
      <div className="store-item-icon">
        <RiMapPinLine />
      </div>
      <div className="store-item-content">
        <h4 className="store-name" title={store.name}>{store.name}</h4>
        {store.phone && (
          <p className="store-phone">
            <RiPhoneLine className="info-icon" />
            {store.phone}
          </p>
        )}
        {store.email && (
          <p className="store-email">
            <RiMailLine className="info-icon" />
            {store.email}
          </p>
        )}
        <p className="store-address">
          <RiMapPinLine className="info-icon" />
          {formatAddress()}
        </p>
      </div>
    </div>
  );
};

const StoreList = ({ stores = [], selectedStoreId, onStoreClick, totalStores }) => {
  if (stores.length === 0) {
    return (
      <div className="store-list-empty">
        <p>No stores found. Try a different search.</p>
      </div>
    );
  }

  return (
    <div className="store-list" data-lenis-prevent>
      {totalStores !== undefined && totalStores > 0 && (
        <div className="store-list-header">
          <p className="store-count my-2 text-secondary">
            {totalStores} {totalStores === 1 ? 'store' : 'stores'} found
          </p>
        </div>
      )}
      {stores.map((store) => (
        <StoreListItem
          key={store.uid}
          store={store}
          isSelected={selectedStoreId === store.uid}
          onClick={onStoreClick}
        />
      ))}
    </div>
  );
};

export default StoreList;
