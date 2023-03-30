import { useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMoralisAuth } from "@moralisweb3/client-firebase-auth-utils";
import { app } from "../services/server";
import { signInWithMoralis } from "@moralisweb3/client-firebase-evm-auth";
import { MultipleContext } from "./Contexts/MultipleContext";

export default function Home() {
    const router = useRouter();
    const { user, setUser }  = useContext(MultipleContext)
    const auth = getAuth(app);
    const db = getFirestore(app)

    async function getApes(){
        try {

            const moralisAuth = getMoralisAuth(app, {
                auth,
                db
            });

            const res = await signInWithMoralis(moralisAuth);
            setUser(res.credentials.user.uid)
            console.log(res.credentials.user.displayName)

        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
      if (user) router.push("/dashboard");
    }, [user]);

    return (
      <div className="relative isolate overflow-hidden bg-gray-900">
          <div className="py-24 px-6 sm:px-6 sm:py-32 lg:px-8">
              <div className="mx-auto min-h-screen max-w-2xl text-center">
                  <h2 className="text-4xl font-bold tracking-tight text-white">
                      Home
                  </h2>
                  <br/>
                  <br/>
                  <button
                      className="px-7 py-4 text-xl rounded-xl bg-purple-300 animate-pulse"
                      onClick={getApes}
                  >
                      Enter
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