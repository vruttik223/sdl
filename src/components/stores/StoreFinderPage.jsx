'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { RiStoreLine, RiSearchLine, RiTimeLine } from 'react-icons/ri';
import WrapperComponent from '../common/WrapperComponent';
import CommonSearchBar from '../common/CommonSearchBar';
import StoreList from './StoreList';
import StoreMap from './StoreMap';
import { useStores } from '@/utils/hooks/useStores';
import { fetchStoreSuggestions } from '@/api/stores.api';
import Loader from '@/layout/loader';

const StoreFinderPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const searchQuery = searchParams.get('search') || '';
  const storeIdParam = searchParams.get('storeId');
  const [selectedStoreId, setSelectedStoreId] = useState(storeIdParam || null);

  // Fetch stores based on search query
  const { data: response, isLoading } = useStores(searchQuery, 15);

  const stores = response?.data?.stores || [];
  const pagination = response?.data?.pagination || {};

  // Handle store selection from list
  const handleStoreClick = useCallback((store) => {
    setSelectedStoreId((prev) => (prev === store.uid ? null : store.uid));
  }, []);

  // Handle marker click from map
  const handleMarkerClick = useCallback((store) => {
    setSelectedStoreId(store.uid);
  }, []);

  // Update only storeId query param when store selection changes.
  // Search query is managed in handleSearch.
  useEffect(() => {
    const newParams = new URLSearchParams(searchParams.toString());

    if (selectedStoreId) {
      newParams.set('storeId', selectedStoreId);
    } else {
      newParams.delete('storeId');
    }

    const query = newParams.toString();
    const nextUrl = query ? `${pathname}?${query}` : pathname;
    const currentUrl = searchParams.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname;

    if (nextUrl !== currentUrl) {
      router.push(nextUrl, { scroll: false });
    }
  }, [selectedStoreId, router, pathname, searchParams]);

  // Keep selected state aligned with URL when browser navigation changes query param
  useEffect(() => {
    setSelectedStoreId(storeIdParam || null);
  }, [storeIdParam]);

  // Handle search from search bar
  const handleSearch = useCallback(
    (query) => {
      setSelectedStoreId(null);

      if (query.trim()) {
        router.push(`${pathname}?search=${encodeURIComponent(query.trim())}`, {
          scroll: false,
        });
      } else {
        router.push(pathname, { scroll: false });
      }
    },
    [router, pathname]
  );

  // Handle search results from CommonSearchBar
  const handleSearchResults = useCallback(
    (query) => {
      handleSearch(query);
    },
    [handleSearch]
  );

  // Transform store API results for CommonSearchBar
  const transformStore = useCallback((store) => {
    const locationParts = [store.city, store.state, store.pincode].filter(
      Boolean
    );

    return {
      id: store.uid,
      title: store.name,
      subtitle: store.googleAddress || locationParts.join(', '),
      slug: store.slug,
      searchableFields: ['title', 'subtitle'],
    };
  }, []);

  // Custom render for store search results
  const renderStoreResult = useCallback((item, index) => {
    if (item.isRecent) {
      return (
        <>
          <RiTimeLine className="recent-icon" aria-hidden="true" />
          <span className="suggestion-text">{item.title}</span>
        </>
      );
    }

    return (
      <>
        <div className="suggestion-icon">
          <RiStoreLine aria-hidden="true" />
        </div>
        <div className="suggestion-content">
          <span className="suggestion-text">
            {item.highlightMatches?.title ? (
              <span
                dangerouslySetInnerHTML={{
                  __html: highlightText(
                    item.title,
                    item.highlightMatches.title
                  ),
                }}
              />
            ) : (
              item.title
            )}
          </span>
          <span className="suggestion-meta">{item.subtitle}</span>
        </div>
      </>
    );
  }, []);

  // Helper function to highlight matched text
  const highlightText = (text, indices) => {
    if (!indices || !indices.length) return text;

    let result = '';
    let lastIndex = 0;

    indices.forEach(([start, end]) => {
      result += text.slice(lastIndex, start);
      result += `<span class="search-highlight">${text.slice(start, end + 1)}</span>`;
      lastIndex = end + 1;
    });

    result += text.slice(lastIndex);
    return result;
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <WrapperComponent
        classes={{ sectionClass: 'store-finder-section section-b-space' }}
      >
        <div className="store-finder-container">
          <div className="store-finder-header">
            <h1 className="store-finder-title">Find Stores Nearby</h1>
            <p className="store-finder-subtitle">
              Search and find our stores near you. Browse by Store Name, City,
              and Pincode. Get contact information and directions to our stores.
            </p>
          </div>
          
          <div className="store-finder-grid">
            {/* Left Panel - Map */}
            <div className="store-finder-map">
              <StoreMap
                stores={stores}
                selectedStoreId={selectedStoreId}
                onMarkerClick={handleMarkerClick}
              />
            </div>

            {/* Right Panel - Search & Results */}
            <div className="store-finder-sidebar">
              <CommonSearchBar
                storageKey="recent_store_searches"
                placeholderWords={['store name', 'city', 'pincode']}
                searchLabel="Search stores"
                enableFuzzyMatch={true}
                autoSearch={false}
                fetchResults={fetchStoreSuggestions}
                transformResults={transformStore}
                renderResultItem={renderStoreResult}
                onSearch={handleSearchResults}
                initialValue={searchQuery}
              />

              {/* Store Results List */}
              <StoreList
                stores={stores}
                selectedStoreId={selectedStoreId}
                onStoreClick={handleStoreClick}
                totalStores={pagination.total}
              />
            </div>
          </div>
        </div>
      </WrapperComponent>
    </>
  );
};

export default StoreFinderPage;
