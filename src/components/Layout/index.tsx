import React from 'react';
import Loader from 'react-loader-spinner';
import { useAppState } from '../../hooks/useAppState';
import { useAxios } from '../../hooks/useAxios';
import { getRecommendation } from '../../service/service';
import MoviesDeck from '../MoviesDeck';

import './Layout.css';

const Layout: React.FC = () => {
  const [appState, dispatchAppState] = useAppState();

  const { response, fetchData } = useAxios();

  React.useEffect(() => {
    fetchData(getRecommendation);
  }, [fetchData])

  // 2 renders for dispatching loader + 1 for changing loader state
  // 1 render for setting data
  // 1 initial render
  // 5 renders total
  return (
    <div className="root">
      {response.loading ? (
        <Loader type="ThreeDots" color="#00BFFF" height={70} width={70} />
      ) : (
        response.data && <MoviesDeck recommendations={response.data} />
      )}
    </div>
  );
};

export default Layout;
