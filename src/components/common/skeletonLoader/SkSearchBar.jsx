/**
 * Search bar skeleton - matches CommonSearchBar / events-search-container layout
 */
const SkSearchBar = () => {
  return (
    <div className="events-search-container sk-search-skeleton">
      <div className="events-searchbar-box">
        <div className="search-input-wrapper sk-search-input skeleton">
          <div className="skeleton__search-icon" />
          <div className="skeleton__search-bar" />
        </div>
      </div>
    </div>
  );
};

export default SkSearchBar;
