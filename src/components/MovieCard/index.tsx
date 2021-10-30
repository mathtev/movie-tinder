import React from 'react';
import { Recommendation } from '../../service/types';

import './MovieCard.css';

interface MoviesCardProps {
  recommendation: Recommendation;
}

const MovieCard: React.FC<MoviesCardProps> = ({ recommendation }) => {
  return (
    <div className="movieCard">
      <img src={recommendation.imageURL} alt={recommendation.title} />
      <div className="details">
        <h2>{recommendation.title}</h2>
        <p>{recommendation.summary}</p>
      </div>
    </div>
  );
};

export default MovieCard;
