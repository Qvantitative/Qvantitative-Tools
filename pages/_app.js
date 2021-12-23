import '../styles/App.css';
import React from 'react';
//import Navbar from '../components/Navbar';
import { ChakraProvider, Image, extendTheme } from '@chakra-ui/react';
//import Router from './Router';

const theme = extendTheme({
  config: {
    initialColorMode: 'dark'
  }
});

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <Image
            src='https://ipfs.io/ipfs/QmfZsKy3u1yDAUAgaXqCcrkkP3up2iZorap7PUkZdGF2hu?filename=grillz-banner-yellow.jpg'
          />
      <Component {...pageProps} />
      <Image
            src="https://ipfs.io/ipfs/QmYpvX7zfbyqZokKZekGsDsekK1rYVFjMcXfBUtea8h85o?filename=grillz-grid-right.jpg"
          />
    </ChakraProvider>
  )
};

export default MyApp;
