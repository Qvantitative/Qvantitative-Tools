import '../styles/App.css';
import React from 'react';
import { 
  ChakraProvider, 
  Image, 
  Stack, 
  AspectRatio,
  extendTheme } from '@chakra-ui/react';
//import Navbar from '../components/Navbar';
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
      <Component 
        {...pageProps} 
      />
      <Stack direction='row'>
        <Image
          boxSize='lg'
          src="https://ipfs.io/ipfs/QmYpvX7zfbyqZokKZekGsDsekK1rYVFjMcXfBUtea8h85o?filename=grillz-grid-right.jpg"
        />
        <Image 
          boxSize='lg'
          src="https://ipfs.io/ipfs/QmP9K81VsuGvfjYsTRxW9FGZGnd6PuGdNh3VKC9TnzHJYt?filename=grillz-grid-left.jpg"
        />
      </Stack>
    </ChakraProvider>
  )
};

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//
//   return { ...appProps }
// }

export default MyApp;
