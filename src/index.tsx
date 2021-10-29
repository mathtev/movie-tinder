import React from 'react';
import ReactDOM from 'react-dom';
import { AppStateProvider } from './appState/AppStateProvider';
import Layout from './components/Layout';

ReactDOM.render(
  <AppStateProvider>
    <Layout />
  </AppStateProvider>,
  document.getElementById('root')
);
