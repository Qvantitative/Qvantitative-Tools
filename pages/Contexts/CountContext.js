import {useState, createContext} from "react";

export const CountContext = createContext(null);

 function ContextC({ children }) {
  const [apeCount, setApeCount] = useState();

  return (
    <CountContext.Provider value={{ apeCount, setApeCount }}>
      {children}
    </CountContext.Provider>
  );
}

export default ContextC;