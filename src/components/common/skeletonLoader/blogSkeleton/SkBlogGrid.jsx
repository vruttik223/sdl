/**
 * Blog card skeleton - supports list_view (horizontal) and grid_view (vertical)
 */
const SkBlogGrid = ({ variant = 'grid_view' }) => {
  const isList = variant === 'list_view';

  if (isList) {
    return (
      <div className="blog-skeleton">
        <div className="skeleton-div">
          <div className="product-box skeleton-box">
            <div className="skeleton">
              <div className="skeleton__section skeleton__section--card">
                <div className="skeleton__img"></div>
                <div>
                  <div className="skeleton__header skeleton__header--long"></div>
                  <div className="skeleton__p"></div>
                </div>
              </div>
              <div className="content-div">
                <div className="skeleton__p"></div>
                <div className="skeleton__p"></div>
                <div className="skeleton__p"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // grid_view: image on top, content below (matches BlogCardContain)
  return (
    <div className="blog-skeleton blog-skeleton--grid">
      <div className="skeleton-div">
        <div className="product-box skeleton-box">
          <div className="skeleton">
            <div className="skeleton__section skeleton__section--grid">
              <div className="skeleton__img skeleton__img--grid"></div>
              <div className="skeleton__content">
                <div className="skeleton__p skeleton__p--short"></div>
                <div className="skeleton__header skeleton__header--long"></div>
                <div className="skeleton__p"></div>
                <div className="skeleton__p"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkBlogGrid;
