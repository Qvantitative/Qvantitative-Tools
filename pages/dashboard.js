import {useContext, useEffect} from "react";
import {MultipleContext} from "./Contexts/MultipleContext";
import {useRouter} from "next/router";
import {getAuth} from "firebase/auth";
import {app} from "../services/server";
import {getFirestore} from "firebase/firestore";
import {getMoralisAuth} from "@moralisweb3/client-firebase-auth-utils";
import {signInWithMoralis} from "@moralisweb3/client-firebase-evm-auth";
import React from "react";
import Wallet from "./wallet";

export default function Dashboard() {
    const { user }  = useContext(MultipleContext)
    const { userA, setUserA } = useContext(MultipleContext)
    const router = useRouter()
    const auth = getAuth(app);
    const db = getFirestore(app)

    async function getApes(){
        try {

            const moralisAuth = getMoralisAuth(app, {
                auth,
                db
            });

            const res = await signInWithMoralis(moralisAuth);
            setUserA(res.credentials.user.uid)
            console.log(res.credentials.user.displayName)

        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        if (!user) router.push("/home");
    }, [!user]);

    useEffect(() => {
      if (userA) router.push("/wallet");
    }, [userA]);

    return (
      <div className="relative isolate overflow-hidden bg-gray-900">
          <div>
              <div className="relative isolate overflow-hidden bg-gray-900">
                  {
                    (user && !userA)
                        ?
                          <div className="py-24 px-6 sm:px-6 sm:py-32 lg:px-8">
                              <div className="mx-auto min-h-screen max-w-2xl text-center">
                                  <button
                                      className="px-7 py-4 text-xl rounded-xl bg-purple-300 animate-pulse"
                                      onClick={getApes}
                                  >
                                      View My ETH NFTs
                                  </button>
                              </div>
                          </div>
                        :
                        <Wallet/>
                  }
              </div>
              {/*
              <div className="relative isolate overflow-hidden bg-gray-900">
                  {
                    (user && !userB)
                        ?
                          <div className="py-24 px-6 sm:px-6 sm:py-32 lg:px-8">
                              <div className="mx-auto min-h-screen max-w-2xl text-center">
                                  <button
                                      className="px-7 py-4 text-xl rounded-xl bg-purple-300 animate-pulse"
                                      onClick={getPepes}
                                  >
                                      View My BTC NFTs
                                  </button>
                              </div>
                          </div>
                        :
                        <Wallet/>
                  }
              </div>
              */}
          </div>
        <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1024 1024"
              className="absolute top-1/2 left-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2"
              aria-hidden="true"
          >
              <circle cx={512} cy={512} r={512} fill="url(#8d958450-c69f-4251-94bc-4e091a323369)" fillOpacity="0.7" />
              <defs>
                  <radialGradient
                      id="8d958450-c69f-4251-94bc-4e091a323369"
                      cx={0}
                      cy={0}
                      r={1}
                      gradientUnits="userSpaceOnUse"
                      gradientTransform="translate(512 512) rotate(90) scale(512)"
                  >
                      <stop stopColor="#7775D6" />
                      <stop offset={1} stopColor="#E935C1" stopOpacity={0} />
                  </radialGradient>
              </defs>
          </svg>
      </div>
    )
}