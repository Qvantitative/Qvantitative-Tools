import {useRouter} from "next/router";
import Sidebar from "./components/sidebar";
import Home from "./home";
import Wallet from "./wallet";
import {Flex, useBreakpointValue} from "@chakra-ui/react";
import {Navbar} from "react-bootstrap";
import Dashboard from "./dashboard";
import React, {useContext} from "react";
import {MultipleContext} from "./Contexts/MultipleContext";

export default function AppContainer() {
    const router = useRouter()
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