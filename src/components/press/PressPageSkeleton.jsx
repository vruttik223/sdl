import WrapperComponent from '../common/WrapperComponent';

const CARD_COUNT = 12;

export default function PressPageSkeleton() {
  return (
    <WrapperComponent
      classes={{
        sectionClass: 'section-b-space press-main-section',
      }}
    >
      <div className="press-page">
        <div className="press-content-section">
          <div className="press-page">
            <section className="press-page__content">
              <div className="press-grid press-page-skeleton__grid">
                {Array.from({ length: CARD_COUNT }).map((_, index) => (
                  <div key={index} className="press-card-skeleton">
                    <div className="press-card-skeleton__image skeleton" />
                    <div className="press-card-skeleton__overlay">
                      <div className="skeleton skeleton--text-lg" />
                      <div className="skeleton skeleton--text-sm" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </WrapperComponent>
  );
}
