import React from 'react';
import Loader from 'react-loader-spinner';
import { useAxios } from '../../hooks/useAxios';
import { getRecommendation } from '../../service/service';
import MoviesDeck from '../MoviesDeck';

import './Layout.css';

const Layout: React.FC = () => {
  const { response, fetchData } = useAxios();

  React.useEffect(() => {
    fetchData(getRecommendation, {requestResponse: true});
  }, [fetchData])

  // 1 render for changing loader state
  // 1 render for setting data
  // 1 initial render
  // 3 renders total
  return (
    <div className="root">
      {response.loading ? (
        <Loader type="ThreeDots" color="#00BFFF" height={50} width={50} />
      ) : (
        response.data && <MoviesDeck recommendations={response.data} />
      )}
    </div>
  );
};

export default Layout;
