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

  let canSwipe = true;
  // how many cards will be stacked at each other when component is rendered
  const offset = 6;
  const endIndex = currentIndex + 1;
  const startIndex = endIndex - offset > 0 ? endIndex - offset : 0;
  // these cards will be rendered
  const dataRange = data.slice(startIndex, endIndex);

  // array of refs to each card
  const childRefs = React.useMemo(
    () =>
      Array(data.length)
        .fill(0)
        .map((i) => React.createRef()),
    [data.length]
  );
  const currentChildRef = React.useRef<number>(0);

  const handleSlide = async (dir: Direction) => {
    const currentCard = childRefs[currentChildRef.current]?.current as any;
    if (currentChildRef.current >= childRefs.length || !currentCard?.swipe) {
      return;
    }
    canSwipe = false;
    currentChildRef.current += 1;
    // multiple cards can be swiped at once
    // promise waits for swipe to finish 
    await currentCard.swipe(dir);
    setCurrentIndex((prevState) => prevState - 1);
  };

  const handleSwipe = () => {
    if (canSwipe) {
      setCurrentIndex((prevState) => prevState - 1);
    }
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
      {dataRange.length ? (
        <>
          <div className="movieDeck">
            {data.slice(startIndex, endIndex).map((recommendation, idx) => {
              //prettier-ignore
              const childRefIndex = data.length - endIndex - idx + dataRange.length - 1;
              return (
                <TinderCard
                  ref={childRefs[childRefIndex] as React.Ref<any>}
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
        </>
      ) : (
        <h2>No more recommendations</h2>
      )}
    </div>
  );
};

export default MoviesDeck;
