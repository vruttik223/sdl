import { formatDate } from '@/utils/helpers';

export default function PressCard({ item, index, onClick }) {
  return (
    <button
      className="press-card"
      onClick={() => onClick(index)}
      aria-label={`Open press image ${item.name}`}
    >
      <img src={item.image} alt={item.imageAlt} loading="lazy" />

      <div className="press-card__overlay">
        <h3 className="press-card__title" title={item.name}>
          {item.name}
        </h3>
        <time className="press-card__date">
          <i className="ri-calendar-line theme-color me-2"></i> {formatDate(item.date)}
        </time>
      </div>
    </button>
  );
}
