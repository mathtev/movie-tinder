import React, { MutableRefObject } from 'react';
import { Recommendation } from '../../service/types';
import MovieCard from '../MovieCard';
import './MovieDeck.css';
import { ImCancelCircle } from 'react-icons/im';
import { AiFillHeart } from 'react-icons/ai';
import {
  acceptRecommendation,
  rejectRecommendation,
} from '../../service/service';
import { useAxios } from '../../hooks/useAxios';
import { useAppState } from '../../hooks/useAppState';

interface MoviesDeckProps {
  recommendations: Recommendation[];
}

export type Direction = 'left' | 'right' | 'up' | 'down';

const MoviesDeck: React.FC<MoviesDeckProps> = ({ recommendations }) => {
  const { fetchData } = useAxios();
  const [, dispatchAppState] = useAppState();
  // eslint-disable-next-line
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

  const currentIndexRef = React.useRef(cards.length - 1);

  const handleSlide = async (dir: Direction) => {
    const currentCard = childRefs.current[
      currentIndexRef.current
    ] as MutableRefObject<any>;
    if (
      currentIndexRef.current >= childRefs.current.length ||
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
    currentIndexRef.current -= 1;
    if (currentIndexRef.current < 0) {
      setCanSwipe(false);
      return;
    }
    canSwipe && handleChangeIndex();
  };

  const handleChangeIndex = () => {
    setStartIndex((prevState) => (prevState - 1 > 0 ? prevState - 1 : 0));
  };

  const handleReject = () => {
    const card = cards[currentIndexRef.current];
    const fetchParams = { ...rejectRecommendation, data: card, id: card.id };
    fetchData(fetchParams, {
      onCompleted: () => console.log('success'),
      onError: (error) =>
        dispatchAppState({
          payload: error,
          type: 'displayError',
        }),
    });
  };

  const handleAccept = () => {
    const card = cards[currentIndexRef.current];
    const fetchParams = { ...acceptRecommendation, data: card, id: card.id };
    fetchData(fetchParams, {
      onCompleted: () => console.log('success'),
      onError: (error) =>
        dispatchAppState({
          payload: error,
          type: 'displayError',
        }),
    });
  };

  console.log('rendr');

  // 1 intial render
  // 1 render on every swipe to add card at the bottom
  return (
    <div className="container">
      <div className="movieDeck">
        {cards
          .slice(startIndex, endIndex.current)
          .map((recommendation, idx) => {
            //prettier-ignore
            const childRefIndex = endIndex.current - cardsRange.length + idx;
            return (
              <MovieCard
                childRef={
                  childRefs.current[childRefIndex] as MutableRefObject<any>
                }
                key={recommendation.id}
                recommendation={recommendation}
                handleSwipe={handleSwipe}
              />
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
