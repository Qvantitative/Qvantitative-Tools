import { useEffect } from 'react';
//import { readCSV } from "danfojs-nightly";

function App2() {

  useEffect(() => {
      const dfd = require("danfojs")

        const s = new dfd.Series([1, 3, 2, 6, 10, 34, 40, 51, 90, 75])
        s.plot("plot_div").bar()

  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <div id="plot_div"></div>
      </header>
    </div>
  );
}

export default App2;