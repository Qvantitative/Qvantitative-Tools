import {useEffect, useState} from "react";
import {useMoralis} from "react-moralis";
import {useRouter} from "next/router";

export default function Example() {

    const { isAuthenticated, authenticate } = useMoralis();
    const router = useRouter();

    useEffect(() => {
      if (isAuthenticated) router.replace("/wallet");
    }, [isAuthenticated]);

    return (
      <div className="relative isolate overflow-hidden bg-gray-900">
          <div className="py-24 px-6 sm:px-6 sm:py-32 lg:px-8">
              <div className="mx-auto min-h-screen max-w-2xl text-center">
                  <h2 className="text-4xl font-bold tracking-tight text-white">
                      Q-Tools
                  </h2>
                  <br/>
                  <br/>
                  <button
                      className="px-7 py-4 text-xl rounded-xl bg-purple-300 animate-pulse"
                      onClick={() =>
                          authenticate({ signingMessage: "Authorize linking of your wallet" })
                  }
                  >
                      Login using Metamask
                  </button>
              </div>
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