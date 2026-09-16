
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
}

const sizes = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' };

export default function StarRating({ rating, maxStars = 5, size = 'md', showValue = false }: StarRatingProps) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxStars }, (_, i) => {
        const filled = i + 1 <= rating;
        const half = !filled && i + 0.5 <= rating;
        return (
          <span key={i} className={`${sizes[size]} text-amber-400`}>
            {filled ? <FaStar /> : half ? <FaStarHalfAlt /> : <FaRegStar />}
          </span>
        );
      })}
      {showValue && <span className="text-xs font-semibold text-slate-300 ml-1">{rating.toFixed(1)}</span>}
    </div>
  );
}
