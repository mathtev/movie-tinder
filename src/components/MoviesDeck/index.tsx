import React from 'react';
import SwipeableViews from 'react-swipeable-views';
import { useAcceptRecommendation } from '../../service/service';
import { Recommendation } from '../../service/types';
import MovieCard from '../MovieCard';
import './MovieDeck.css';

interface MoviesDeckProps {
  recommendations: Recommendation[];
}

const MoviesDeck: React.FC<MoviesDeckProps> = ({ recommendations }) => {
  const [index, setIndex] = React.useState(0);

  const moveRight = () => {
    const newIndex = index + 1;
    if (newIndex <= recommendations.length) {
      setIndex(newIndex);
    }
    handleReject();
  };

  const moveLeft = () => {
    const newIndex = index - 1;
    if (newIndex >= 0) {
      setIndex(newIndex);
    }
    handleAccept();
  };

  const handleReject = () => {
    console.log('Reject');
    recommendations.shift()
  };

  const handleAccept = () => {
    console.log('Accept');
    recommendations.shift()
  };

  const handleChange = (index: number, latestIndex: number) => {
    setIndex(index);
    index > latestIndex ? handleReject() : handleAccept();
  };

  // 1 intial render
  // 1 render on every slide change

  return (
    <div className="movieDeck">
      {console.log('object')}{' '}
      <SwipeableViews
        enableMouseEvents
        resistance
        index={index}
        onChangeIndex={handleChange}
      >
        {recommendations.map((recommendation) => (
          <MovieCard key={recommendation.id} recommendation={recommendation} />
        ))}
      </SwipeableViews>
      <div className="buttons">
        <button onClick={moveLeft}>Reject</button>
        <button onClick={moveRight}>Accept</button>
      </div>
    </div>
  );
};

export default MoviesDeck;
