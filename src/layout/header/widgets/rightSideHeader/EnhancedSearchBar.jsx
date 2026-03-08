'use client';

import { Fragment, useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { RiSearchLine, RiCloseLine, RiTimeLine, RiFireLine } from 'react-icons/ri';
import { Input } from 'reactstrap';
import useDebounce from '@/utils/hooks/useDebounce';
import searchData from '@/app/api/search/search.json';

const STORAGE_KEY = 'recent_searches';
const MAX_RECENT_SEARCHES = 5;
const DEBOUNCE_DELAY = 500;
const POPULAR_SUGGESTION_LIMIT = 3;
const PLACEHOLDER_ROTATE_DELAY = 2400;
const PLACEHOLDER_WORDS = [
  'Products',
  'Categories',
  'Blogs',
  'Herbs',
];

/**
 * Fuzzy matching function - case insensitive
 * Returns match info for highlighting
 */
const fuzzyMatch = (text, query) => {
  if (!query) return { matches: false, indices: [] };

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();

  // Check for substring match
  const index = lowerText.indexOf(lowerQuery);
  if (index !== -1) {
    return {
      matches: true,
      indices: [[index, index + query.length - 1]],
    };
  }

  // Fuzzy match - characters appear in order
  let queryIndex = 0;
  const indices = [];

  for (let i = 0; i < text.length && queryIndex < lowerQuery.length; i++) {
    if (lowerText[i] === lowerQuery[queryIndex]) {
      indices.push([i, i]);
      queryIndex++;
    }
  }

  if (queryIndex === lowerQuery.length) {
    // Merge consecutive indices
    const mergedIndices = [];
    for (const [start, end] of indices) {
      const last = mergedIndices[mergedIndices.length - 1];
      if (last && last[1] === start - 1) {
        last[1] = end;
      } else {
        mergedIndices.push([start, end]);
      }
    }
    return { matches: true, indices: mergedIndices };
  }

  return { matches: false, indices: [] };
};

/**
 * Highlights matched text in a string
 */
const HighlightedText = ({ text, indices }) => {
  if (!indices.length) return <>{text}</>;

  const parts = [];
  let lastIndex = 0;

  indices.forEach(([start, end], i) => {
    if (start > lastIndex) {
      parts.push(<span key={`text-${i}`}>{text.slice(lastIndex, start)}</span>);
    }
    parts.push(
      <span key={`match-${i}`} className="search-highlight">
        {text.slice(start, end + 1)}
      </span>
    );
    lastIndex = end + 1;
  });

  if (lastIndex < text.length) {
    parts.push(<span key="text-end">{text.slice(lastIndex)}</span>);
  }

  return <>{parts}</>;
};

const EnhancedSearchBar = () => {
  const [searchValue, setSearchValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState([]);
  const [items] = useState(searchData.items || []);
  const [isMobile, setIsMobile] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [placeholderTick, setPlaceholderTick] = useState(0);

  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const listRef = useRef(null);
  const clearTriggeredByKeyboard = useRef(false);

  const debouncedSearchValue = useDebounce(searchValue, DEBOUNCE_DELAY);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error loading recent searches:', e);
    }
  }, []);

  // Track viewport for mobile/desktop behaviors
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1200px)');
    const handleChange = () => setIsMobile(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Rotate placeholder words
  useEffect(() => {
    const intervalId = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDER_WORDS.length);
      setPlaceholderTick((prev) => prev + 1);
    }, PLACEHOLDER_ROTATE_DELAY);

    return () => clearInterval(intervalId);
  }, []);

  // Filter items based on debounced search value
  const filteredItems = useMemo(() => {
    if (!debouncedSearchValue.trim()) return [];

    return items
      .map((item) => {
        const matchResult = fuzzyMatch(item.name, debouncedSearchValue);
        return { ...item, ...matchResult };
      })
      .filter((item) => item.matches)
      .slice(0, 15);
  }, [debouncedSearchValue, items]);

  const popularSuggestions = useMemo(
    () =>
      items.slice(0, POPULAR_SUGGESTION_LIMIT).map((item) => ({
        ...item,
        isPopular: true,
        indices: [],
      })),
    [items]
  );

  const recentSuggestions = useMemo(
    () =>
      recentSearches.map((term, index) => ({
        id: `recent-${index}`,
        name: term,
        isRecent: true,
        indices: [],
      })),
    [recentSearches]
  );

  // Determine what to show in dropdown
  const suggestions = useMemo(() => {
    if (!searchValue.trim()) {
      return [...popularSuggestions, ...recentSuggestions];
    }
    return filteredItems;
  }, [searchValue, popularSuggestions, recentSuggestions, filteredItems]);

  // Save to recent searches
  const saveToRecentSearches = useCallback((term) => {
    if (!term.trim()) return;

    setRecentSearches((prev) => {
      const filtered = prev.filter(
        (item) => item.toLowerCase() !== term.toLowerCase()
      );
      const updated = [term, ...filtered].slice(0, MAX_RECENT_SEARCHES);

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Error saving recent searches:', e);
      }

      return updated;
    });
  }, []);

  // Handle selection
  const handleSelect = useCallback(
    (item) => {
      const value = item.name;
      setSearchValue(value);
      saveToRecentSearches(value);
      setIsOpen(false);
      setFocusedIndex(-1);
      if (isMobile) {
        setIsModalOpen(false);
      }
      if (inputRef.current && typeof inputRef.current.blur === 'function') {
        inputRef.current.blur();
      }
    },
    [isMobile, saveToRecentSearches]
  );

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll focused item into view
  useEffect(() => {
    if (focusedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('[role="option"]');
      items[focusedIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [focusedIndex]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen && e.key !== 'Escape') {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;

      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;

      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && suggestions[focusedIndex]) {
          handleSelect(suggestions[focusedIndex]);
        } else if (searchValue.trim()) {
          saveToRecentSearches(searchValue);
          setIsOpen(false);
        }
        break;

      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setFocusedIndex(-1);
        inputRef.current?.blur();
        if (isMobile) setIsModalOpen(false);
        break;

      case 'Tab':
        setIsOpen(false);
        setFocusedIndex(-1);
        break;

      default:
        break;
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
    setFocusedIndex(-1);
    if (!isOpen) setIsOpen(true);
  };

  // Handle focus
  const handleFocus = () => {
    setIsOpen(true);
  };

  // Clear search
  const handleClear = () => {
    setSearchValue('');
    setFocusedIndex(-1);
    setIsOpen(true);

    requestAnimationFrame(() => {
      inputRef.current?.focus();
      clearTriggeredByKeyboard.current = false;
    });
  };

  const openMobileSearch = () => {
    setIsModalOpen(true);
    setIsOpen(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const closeMobileSearch = () => {
    setIsModalOpen(false);
    setIsOpen(false);
    setFocusedIndex(-1);
    inputRef.current?.blur();
  };

  // Check if we should show dropdown
  const showDropdown =
    isOpen &&
    (suggestions.length > 0 ||
      (searchValue.trim() && filteredItems.length === 0));
  const showNoResults =
    searchValue.trim() &&
    debouncedSearchValue.trim() &&
    filteredItems.length === 0;

  // On mobile we want the list visible inside the modal without requiring focus-open toggles
  const shouldShowDropdown = isMobile
    ? suggestions.length > 0 ||
      (searchValue.trim() && filteredItems.length === 0)
    : showDropdown;

  const dynamicPlaceholder = `Search for ${PLACEHOLDER_WORDS[placeholderIndex]}`;
  const inputPlaceholder = searchValue ? dynamicPlaceholder : '';

  const searchBody = (
    <div
      className={`enhanced-searchbar-box ${isOpen ? 'is-open' : ''}`}
      role="combobox"
      aria-expanded={shouldShowDropdown}
      aria-haspopup="listbox"
      aria-owns="search-suggestions"
    >
      <div className="search-input-wrapper">
        <RiSearchLine className="search-icon" aria-hidden="true" />

        <Input
          innerRef={inputRef}
          id="enhanced-search"
          type="text"
          className="search-input input-common"
          value={searchValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder={inputPlaceholder}
          autoComplete="off"
          aria-label="Search"
          aria-autocomplete="list"
          aria-controls="search-suggestions"
          aria-activedescendant={
            focusedIndex >= 0 ? `suggestion-${focusedIndex}` : undefined
          }
        />

        {!searchValue && (
          <div className="animated-placeholder" aria-hidden="true">
            <span className="placeholder-static">Search for</span>
            <span key={placeholderTick} className="placeholder-dynamic">
              "{PLACEHOLDER_WORDS[placeholderIndex]}"
            </span>
            {/* <span className="placeholder-suffix">...</span> */}
          </div>
        )}

        {searchValue && (
          <button
            type="button"
            className="clear-button"
            aria-label="Clear search"
            onMouseDown={(e) => e.preventDefault()} // mouse fix (keep input focused)
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault(); // 🔑 stop button retaining focus
                handleClear();
                inputRef.current?.focus(); // 🔑 explicitly move focus
              }
              if (e.key === 'Escape' && searchValue) {
                handleClear();
              }
            }}
            onClick={handleClear}
          >
            <RiCloseLine />
          </button>
        )}
      </div>

      {shouldShowDropdown && (
        <ul
          id="search-suggestions"
          ref={listRef}
          className="suggestions-dropdown"
          role="listbox"
          aria-label={
            searchValue.trim() ? 'Search suggestions' : 'Popular and recent suggestions'
          }
        >
          {showNoResults ? (
            <li className="no-results" role="presentation">
              No results found for "{debouncedSearchValue}"
            </li>
          ) : (
            suggestions.map((item, index) => {
              const showPopularHeader =
                !searchValue.trim() && item.isPopular && !suggestions[index - 1]?.isPopular;
              const showRecentHeader =
                !searchValue.trim() && item.isRecent && !suggestions[index - 1]?.isRecent;

              return (
                <Fragment key={item.id}>
                  {showPopularHeader && (
                    <li className="suggestions-header" role="presentation">
                      <RiFireLine aria-hidden="true" />
                      <span>Popular Products</span>
                    </li>
                  )}

                  {showRecentHeader && (
                    <li className="suggestions-header" role="presentation">
                      <RiTimeLine aria-hidden="true" />
                      <span>Recent Searches</span>
                    </li>
                  )}

                  <li
                    id={`suggestion-${index}`}
                    role="option"
                    aria-selected={focusedIndex === index}
                    className={`suggestion-item ${
                      focusedIndex === index ? 'is-focused' : ''
                    } ${item.isRecent ? 'is-recent' : ''} ${
                      item.isPopular ? 'is-popular' : ''
                    }`}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setFocusedIndex(index)}
                  >
                    {item.isRecent ? (
                      <>
                        <RiTimeLine className="recent-icon" aria-hidden="true" />
                        <span className="suggestion-text">{item.name}</span>
                      </>
                    ) : item.isPopular ? (
                      <>
                        <RiFireLine className="popular-icon" aria-hidden="true" />
                        <span className="suggestion-text">{item.name}</span>
                        {item.category && (
                          <span className="suggestion-category">{item.category}</span>
                        )}
                      </>
                    ) : (
                      <>
                        <RiSearchLine
                          className="search-icon-small"
                          aria-hidden="true"
                        />
                        <span className="suggestion-text">
                          <HighlightedText
                            text={item.name}
                            indices={item.indices}
                          />
                        </span>
                        {item.category && (
                          <span className="suggestion-category">
                            {item.category}
                          </span>
                        )}
                      </>
                    )}
                  </li>
                </Fragment>
              );
            })
          )}
        </ul>
      )}
    </div>
  );

  return (
    <>
      {isMobile && (
        <button
          type="button"
          className="search-trigger-mobile"
          aria-label="Open search"
          onClick={openMobileSearch}
        >
          <RiSearchLine />
        </button>
      )}

      {!isMobile && (
        <div className="enhanced-search-container" ref={containerRef}>
          {searchBody}
        </div>
      )}

      {isMobile && (
        <div
          className={`search-modal ${isModalOpen ? 'open' : ''}`}
          role="dialog"
          aria-modal="true"
          aria-label="Search"
          onClick={closeMobileSearch}
        >
          <div
            className="search-modal__content"
            role="document"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="search-modal__header">
              <h3 className="fw-bold">Search</h3>
              <button
                type="button"
                className="search-modal__close"
                aria-label="Close search"
                onClick={closeMobileSearch}
              >
                <RiCloseLine />
              </button>
            </div>
            <div className="search-modal__body">
              <div className="enhanced-search-container" ref={containerRef}>
                {searchBody}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EnhancedSearchBar;
