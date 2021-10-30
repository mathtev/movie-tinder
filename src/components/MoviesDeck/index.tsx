import React from 'react';
import SwipeableViews from 'react-swipeable-views';
import { Recommendation } from '../../service/types';
import MovieCard from '../MovieCard';
import TinderCard from 'react-tinder-card';
import './MovieDeck.css';
import { ImCancelCircle } from 'react-icons/im';
import { AiFillHeart } from 'react-icons/ai';

interface MoviesDeckProps {
  recommendations: Recommendation[];
}

declare type Direction = 'left' | 'right' | 'up' | 'down';

const MoviesDeck: React.FC<MoviesDeckProps> = ({ recommendations }) => {
  const [currentIndex, setCurrentIndex] = React.useState(
    recommendations.length - 1
  );
  const [data, setData] = React.useState([...recommendations.reverse()]);

  let canSlide = currentIndex >= 0;
  let canSwipe = true;
  const endIndex = currentIndex + 1;
  const startIndex = endIndex - 3 > 0 ? endIndex - 3 : 0;
  const dataRange = data.slice(startIndex, endIndex);

  const currentIndexRef = React.useRef(dataRange.length - 1);

  const childRefs = React.useMemo(
    () =>
      Array(dataRange.length)
        .fill(0)
        .map((i) => React.createRef()),
    []
  );

  const handleSlide = async (dir: Direction) => {
    console.log(currentIndexRef.current)
    const currentCard = childRefs[currentIndexRef.current].current as any;
    if(currentIndexRef.current <= 0 || !currentCard){
      canSlide = false;
    }
    if (canSlide && currentIndex < data.length) {
      canSwipe = false;
      currentIndexRef.current -= 1;
      await currentCard.swipe(dir);
      setCurrentIndex((prevState) => prevState - 1);
      currentIndexRef.current += 1;
    }
  };

  const handleSwipe = () => {
    if (canSwipe) {
      setCurrentIndex((prevState) => prevState - 1);
    }
  };

  const moveRight = () => {
    handleReject();
  };

  const moveLeft = () => {
    handleAccept();
    handleSlide('left');
  };

  const handleReject = () => {
    console.log('Reject');
  };

  const handleAccept = () => {
    console.log('Accept');
  };

  // 1 intial render
  // 1 render on every slide change
  return (
    <div className="container">
      <div className="movieDeck">
        {data.slice(startIndex, endIndex).map((recommendation, idx) => {
          return (
            <TinderCard
              ref={childRefs[idx] as React.Ref<any>}
              className="swipe"
              key={recommendation.id}
              preventSwipe={['up', 'down']}
              onSwipe={handleSwipe}
            >
              <MovieCard
                key={recommendation.id}
                recommendation={recommendation}
              />
            </TinderCard>
          );
        })}
      </div>
      <div className="buttons">
        <button onClick={() => handleSlide('left')}>
          <ImCancelCircle color="red" />
        </button>
        <button onClick={() => handleSlide('right')}>
          <AiFillHeart color="#4cf14d" />
        </button>
      </div>
    </div>
  );
};

export default MoviesDeck;
