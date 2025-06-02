import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '../types';
import MainLayout from '../components/MainLayout';
import '../styles/globals.css';

const store = configureStore({
  reducer: rootReducer,
});

function MyApp({ Component, pageProps }: { Component: any; pageProps: any }) {
  return (
    <Provider store={store}>
      <MainLayout>
        <Component {...pageProps} />
      </MainLayout>
    </Provider>
  );
}

export default MyApp;