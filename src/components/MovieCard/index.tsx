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
  const swipeThreshold = width * height / 1000;
  const rating = Math.floor(recommendation.rating);
  return (
    <TinderCard
      ref={childRef}
      className="swipe"
      key={recommendation.id}
      onSwipe={handleSwipe}
      preventSwipe={['up', 'down']}
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
