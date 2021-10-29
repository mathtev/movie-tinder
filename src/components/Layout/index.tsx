import React from 'react';
import Loader from 'react-loader-spinner';
import { useAppState } from '../../hooks/useAppState';
import { useGetRecommendations } from '../../service/service';
import { Recommendation } from '../../service/types';
import MoviesDeck from '../MoviesDeck';

import './Layout.css';

const Layout: React.FC = () => {
  const [appState, dispatchAppState] = useAppState();

  const { data } = useGetRecommendations({
    displayLoader: true,
  });

  // 2 renders for dispatching loader + 1 for changing loader state
  // 1 render for setting data
  // 1 initial render
  // 5 renders total

  return (
    <div className="root">
      {appState.loading ? (
        <Loader type="ThreeDots" color="#00BFFF" height={70} width={70} />
      ) : (
        data && <MoviesDeck recommendations={data} />
      )}
    </div>
  );
};

export default Layout;
