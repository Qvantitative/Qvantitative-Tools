import '../styles/App.css';
import '../components/style.css'
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
    <div>
    <header className='bg-blue'>
    </header>
      <Image
          src='https://ipfs.io/ipfs/QmfZsKy3u1yDAUAgaXqCcrkkP3up2iZorap7PUkZdGF2hu?filename=grillz-banner-yellow.jpg'
        />
      <Component {...pageProps} />
      <Image
          src="https://ipfs.io/ipfs/QmYpvX7zfbyqZokKZekGsDsekK1rYVFjMcXfBUtea8h85o?filename=grillz-grid-right.jpg"
        />
      <Image 
          src="https://ipfs.io/ipfs/QmP9K81VsuGvfjYsTRxW9FGZGnd6PuGdNh3VKC9TnzHJYt?filename=grillz-grid-left.jpg"
        />
    </div>
  </ChakraProvider>
  )
};

export default MyApp;
