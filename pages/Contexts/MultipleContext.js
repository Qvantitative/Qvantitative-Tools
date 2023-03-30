import {useState, createContext} from "react";

export const MultipleContext = createContext(null);

  export default function Context({ children }) {
      const [user, setUser] = useState();
      const [userA, setUserA] = useState();
      const [userB, setUserB] = useState();

      return (
        <MultipleContext.Provider
            value={{
              user, setUser,
              userA, setUserA,
              userB, setUserB
            }}
        >
          {children}
        </MultipleContext.Provider>
  );
}