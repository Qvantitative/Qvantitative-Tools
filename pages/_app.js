import '../styles/App.css';
import React from 'react';
//import Navbar from '../components/Navbar';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
//import Router from './Router';

const theme = extendTheme({
  config: {
    initialColorMode: 'dark'
  }
});

function MyApp({ Component, pageProps }) {
  return (
  <ChakraProvider theme={theme}>
    <div>
      <Component {...pageProps} />
    </div>
  </ChakraProvider>
  )
};

export default MyApp;
