export default function Loading() {
  return (
    <div className="press-loading">
      {/* Page heading skeleton */}
      <div className="press-loading__header">
        <div className="skeleton skeleton--title" />
      </div>

      {/* Masonry skeleton grid */}
      <div className="press-loading__grid">
        {Array.from({ length: 9 }).map((_, index) => (
          <div
            key={index}
            className="press-loading__card skeleton"
            style={{
              height: `${220 + (index % 3) * 90}px`, // variable height
            }}
          >
            {/* Overlay skeleton */}
            <div className="press-loading__overlay">
              <div className="skeleton skeleton--text-lg" />
              <div className="skeleton skeleton--text-sm" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
