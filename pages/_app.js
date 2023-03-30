import '../styles/App.css';
import '../styles/globals.css';
import React from 'react';
import { ThemeProvider } from 'next-themes';
import { MoralisProvider } from "react-moralis";
import { ClientProvider } from '@micro-stacks/react';
import Context from "./Contexts/MultipleContext";
import Sidebar from "./components/sidebar";

function MyApp({ Component, pageProps }) {

  return (
      <ClientProvider
          appName="Nextjs + Microstacks"
          appIconUrl="/vercel.png"
      >
          <MoralisProvider
              serverUrl="https://qprwtbpvop62.grandmoralis.com:2053/server"
              appId="Avbz29guzhOUWzHlFz5wtGp49VzDEWbHkoCCHMBT">
              <ThemeProvider attribute="class">
                  <Context>
                      <Sidebar>
                          <Component>
                            {pageProps}
                          </Component>
                      </Sidebar>
                  </Context>
              </ThemeProvider>
          </MoralisProvider>
      </ClientProvider>

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