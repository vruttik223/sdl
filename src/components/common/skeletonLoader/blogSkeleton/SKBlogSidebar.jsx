import {
  UncontrolledAccordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
} from 'reactstrap';

/**
 * Sidebar skeleton - matches RecentPost, Category, Tags structure
 */
const SKBlogSidebar = () => {
  return (
    <UncontrolledAccordion
      className="left-accordion-box"
      defaultOpen={['1', '2', '3']}
    >
      {/* Recent Post skeleton */}
      <AccordionItem className="skeleton-accordion">
        <AccordionHeader targetId="1">
          <span className="sk-sidebar-header skeleton skeleton__header" />
        </AccordionHeader>
        <AccordionBody accordionId="1" className="pt-0">
          <div className="recent-post-box skeleton sk-sidebar-recent">
            {[1, 2, 3].map((i) => (
              <div className="recent-box sk-recent-box" key={i}>
                <div className="sk-recent-image skeleton" />
                <div className="sk-recent-detail">
                  <div className="skeleton skeleton__header skeleton__header--long" />
                  <div className="skeleton skeleton__p skeleton__p--short" />
                </div>
              </div>
            ))}
          </div>
        </AccordionBody>
      </AccordionItem>

      {/* Category skeleton */}
      <AccordionItem className="skeleton-accordion">
        <AccordionHeader targetId="2">
          <span className="sk-sidebar-header skeleton skeleton__header" />
        </AccordionHeader>
        <AccordionBody accordionId="2" className="p-0">
          <div className="category-list-box sk-sidebar-category">
            <ul>
              {[1, 2, 3, 4, 5].map((i) => (
                <li key={i} className="sk-category-item">
                  <div className="category-name skeleton">
                    <span className="skeleton__header" />
                    <span className="skeleton__p--short" />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </AccordionBody>
      </AccordionItem>

      {/* Tags skeleton */}
      <AccordionItem className="skeleton-accordion">
        <AccordionHeader targetId="3">
          <span className="sk-sidebar-header skeleton skeleton__header" />
        </AccordionHeader>
        <AccordionBody accordionId="3" className="pt-0">
          <div className="product-tags-box sk-sidebar-tags">
            <ul>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <li key={i} className="sk-tag-pill">
                  <span className="skeleton skeleton__tag" />
                </li>
              ))}
            </ul>
          </div>
        </AccordionBody>
      </AccordionItem>
    </UncontrolledAccordion>
  );
};

export default SKBlogSidebar;
