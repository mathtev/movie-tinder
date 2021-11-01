import { useWindowSize } from '@react-hook/window-size';
import React, { MutableRefObject } from 'react';
import TinderCard from 'react-tinder-card';
import { Recommendation } from '../../service/types';
import { Direction } from '../MoviesDeck';

import './MovieCard.css';

interface MoviesCardProps {
  recommendation: Recommendation;
  childRef: MutableRefObject<any>;
  handleSwipe: (dir: Direction) => void;
}

const MovieCard: React.FC<MoviesCardProps> = ({
  recommendation,
  childRef,
  handleSwipe,
}) => {
  const [width, height] = useWindowSize();
  const requirementFulfilled = React.useRef(true);
  const swipeThreshold = (width * height) / 3000;
  const rating = Math.floor(recommendation.rating);

  const handleFulfilled = (dir: Direction) => {
    if (dir === 'left' || dir === 'right') {
      requirementFulfilled.current = true;
    } else {
      requirementFulfilled.current = false;
    }
  };

  const prepareSwipe = (dir: Direction) => {
    if (requirementFulfilled.current) {
      handleSwipe(dir);
    }
  };

  return (
    <TinderCard
      ref={childRef}
      className="swipe"
      key={recommendation.id}
      onSwipe={prepareSwipe}
      preventSwipe={['up', 'down']}
      swipeRequirementType="position"
      onSwipeRequirementFulfilled={(dir) => handleFulfilled(dir)}
      swipeThreshold={swipeThreshold}
    >
      <div className="movieCard">
        <img src={recommendation.imageURL} alt={recommendation.title} />
        <div className="details">
          <h2>
            {recommendation.title} ({rating}/10)
          </h2>
          <p>{recommendation.summary}</p>
        </div>
      </div>
    </TinderCard>
  );
};

export default MovieCard;
