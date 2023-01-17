import '../styles/App.css';
import '../styles/globals.css';
import React from 'react';
import { ThemeProvider } from 'next-themes';
import { MoralisProvider } from "react-moralis";

function MyApp({ Component, pageProps }) {
  return (
      <MoralisProvider
          serverUrl="https://qprwtbpvop62.grandmoralis.com:2053/server"
          appId="Avbz29guzhOUWzHlFz5wtGp49VzDEWbHkoCCHMBT">
          <ThemeProvider attribute="class">
              <Component
                {...pageProps}
              />
          </ThemeProvider>
       </MoralisProvider>
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