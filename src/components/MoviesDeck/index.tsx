import React, { MutableRefObject } from 'react';
import { Recommendation } from '../../service/types';
import MovieCard from '../MovieCard';
import TinderCard from 'react-tinder-card';
import './MovieDeck.css';
import { ImCancelCircle } from 'react-icons/im';
import { AiFillHeart } from 'react-icons/ai';
import { rejectRecommendation } from '../../service/service';
import { useAxios } from '../../hooks/useAxios';

interface MoviesDeckProps {
  recommendations: Recommendation[];
}

type Direction = 'left' | 'right' | 'up' | 'down';

const MoviesDeck: React.FC<MoviesDeckProps> = ({ recommendations }) => {
  const { response, fetchData } = useAxios();
  const [cards, setCards] = React.useState([...recommendations.reverse()]);

  // how many cards will be stacked at each other when component is rendered
  const offset = 3;
  const endIndexInit = recommendations.length;
  const startIndexInit = endIndexInit - offset > 0 ? endIndexInit - offset : 0;

  const [canSwipe, setCanSwipe] = React.useState(true);
  const [startIndex, setStartIndex] = React.useState(startIndexInit);
  const endIndex = React.useRef(endIndexInit);

  // these cards will be rendered
  const cardsRange = cards.slice(startIndex, endIndex.current);

  // array of refs to each card
  const childRefs = React.useRef([]);

  if (childRefs.current.length !== cards.length) {
    // add or remove refs
    childRefs.current = Array(cards.length)
      .fill(0)
      .map((_, i) => childRefs.current[i] || React.createRef());
  }

  const currentChildRef = React.useRef(cards.length - 1);

  const handleSlide = async (dir: Direction) => {
    const currentCard = childRefs.current[
      currentChildRef.current
    ] as MutableRefObject<any>;
    if (
      currentChildRef.current >= childRefs.current.length ||
      !currentCard.current?.swipe
    ) {
      return;
    }
    // add card to the bottom
    handleChangeIndex();
    // multiple cards can be swiped at once
    // promise waits for swipe to finish but doesn't block because
    // cards are added to the bottom on every click
    await currentCard.current.swipe(dir);
    // remove card from top
    endIndex.current -= 1;
  };

  const handleSwipe = (dir: Direction) => {
    dir === 'left' ? handleReject() : handleAccept();
    currentChildRef.current -= 1;
    if (currentChildRef.current < 0) {
      setCanSwipe(false);
      return;
    }
    canSwipe && handleChangeIndex();
  };

  const handleChangeIndex = () => {
    setStartIndex((prevState) => (prevState - 1 > 0 ? prevState - 1 : 0));
  };

  const handleReject = () => {
    console.log('reject')
    const card = cards[currentChildRef.current];
    const fetchParams = {...rejectRecommendation, data: card, id: card.id}
    fetchData(fetchParams, {
      onCompleted: () => console.log('success'),
      onError: () => console.error('failed')
    });
  };

  const handleAccept = () => {
    console.log('Accept');
  };

  // 1 intial render
  // 1 render on every slide change to add card at the bottom
  return (
    <div className="container">
      <div className="movieDeck">
        {cards
          .slice(startIndex, endIndex.current)
          .map((recommendation, idx) => {
            //prettier-ignore
            const childRefIndex = endIndex.current - cardsRange.length + idx;
            return (
              <TinderCard
                ref={childRefs.current[childRefIndex] as MutableRefObject<any>}
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
      {canSwipe && (
        <div className="buttons">
          <button onClick={() => handleSlide('left')}>
            <ImCancelCircle color="red" />
          </button>
          <button onClick={() => handleSlide('right')}>
            <AiFillHeart color="#4cf14d" />
          </button>
        </div>
      )}
      {!canSwipe && <h2 className="cannotSwipe">No more recommendations</h2>}
    </div>
  );
};

export default MoviesDeck;
