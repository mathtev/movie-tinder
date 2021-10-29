import React from 'react';
import { Recommendation } from '../../service/types';

import './MovieCard.css';

interface MoviesCardProps {
  recommendation: Recommendation;
}

const MovieCard: React.FC<MoviesCardProps> = ({ recommendation }) => {
  return (
    <div className="movieCard">
      <h2>{recommendation.title}</h2>
      <img src={recommendation.imageURL} alt={recommendation.title} />
    </div>
  );
};

export default MovieCard;
