import Home from "./home";
import Dashboard from "./dashboard";
import React, {useContext} from "react";
import {MultipleContext} from "./Contexts/MultipleContext";

export default function AppContainer() {
    const { user }  = useContext(MultipleContext)
    const { userA }  = useContext(MultipleContext)

  return (
    <div>
        {
            (!user && !userA)
                ? <Home/>
                : <Dashboard/>
        }
    </div>
  );
};
