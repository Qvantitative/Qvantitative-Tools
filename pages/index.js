import React from 'react';
import Wallet from './wallet';
import {useTheme} from 'next-themes'

function Index() {
  const {theme, setTheme} = useTheme()

  return (
      <button
        aria-label="Toggle Dark Mode"
        type="button"
        className="p-3 h-12 w-12 order-2 md:order-3"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      />,
    <Wallet />
  );
};

export default Index;