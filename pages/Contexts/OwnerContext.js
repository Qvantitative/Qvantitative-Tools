import {useState, createContext} from "react";

export const ApesContext = createContext(null);

 function ContextA({ children }) {
  const [apes, setApes] = useState();

  return (
    <ApesContext.Provider value={{ apes, setApes }}>
      {children}
    </ApesContext.Provider>
  );
}

export default ContextA;