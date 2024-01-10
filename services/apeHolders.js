import React, {useEffect, useState} from 'react'
import {addDoc, collection, getFirestore} from "firebase/firestore";
import {app} from "./server";
import { getDoc } from "firebase/firestore";

let i=0

const Web3 = require("web3")
const web3 = new Web3("https://mainnet.infura.io/v3/830febf016234fa7b49566eaf9a0e5d0")

const baseURL = "https://eth-mainnet.alchemyapi.io/nft/v2/rpgRyd5BBElsZ8OaDerQFRH3ZfXIb_nw/getOwnersForCollection/";
const baseURL1 = "https://api.reservoir.tools/users/"
const fetchURL1 = `${baseURL}?contractAddress=0x740c178e10662bbb050bde257bfa318defe3cabc`;
const fetchURL2 = `${baseURL}?contractAddress=0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D`;
const req = new Request(fetchURL1)

export const typeDefs = `type Channel {
   id: ID!                # "!" denotes a required field
   name: String
}# This type specifies the entry points into our API. In this case
# there is only one - "channels" - which returns a list of channels.
type Query {
   channels: [Channel]    # "[]" means this is a list of channels
}
`;

export default function App() {

  const urls = [
    fetchURL1,
    fetchURL2,
  ];

  const db = getFirestore(app)

  const dbRef = collection(db, "apeHolders");

    async function fetchOwners() {
          Promise.all(
            urls.map(url =>
              fetch(url)
                .then(res => res.json())
                .then(res => res.ownerAddresses)
            ))
              .then(data => {
                let arrIntersection = data[0].filter((a) => {
                return data[1].includes(a)
                }).map(item => ({ ownerAddress: item }))

                //console.log(arrIntersection)

                //for (i=i; i < arrIntersection.length; i++) {
                //}

                const responses = arrIntersection.map((data) =>
                    fetch(`${baseURL1}${data.ownerAddress}/collections/v2?collection=0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D&includeTopBid=false&offset=0`)
                        .then((res) => res.json()),
                    );
                    Promise.all(responses)
                        .then(fetchedOrders => {
                          //setContracts(fetchedOrders.map(fetchedOrders => fetchedOrders.address))
                          let merged = arrIntersection.map((item, i) => Object.assign({}, item, fetchedOrders[i].collections[0].ownership));
                            merged.sort(function (x, y) {
                              return y.tokenCount - x.tokenCount;
                            })

                          //console.log(merged)

                          let sum = merged.reduce(function(prev, current) {
                            return prev + +current.tokenCount
                          }, 0);
                          //console.log(sum)

                          let mergedOwner = merged.map(({ownerAddress})=>[ownerAddress]).flat(1);
                          let mergedToken = merged.map(({tokenCount})=>[tokenCount]).flat(1);
                          let mergedCount = mergedToken.map(Number)
                          //mergedCount.unshift(sum)

                          let merged1 = arrIntersection.map((item, i) => Object.assign({}, item, fetchedOrders[i].collections[0].collection));
                          let distribution = [].concat([merged1[0].tokenCount - sum], sum).map(Number);
                          //console.log(mergedOwner);

                          const data = {
                             owner: mergedOwner,
                             apeCount: mergedCount
                          };

                          addDoc(dbRef, data)
                            .then(async docRef => {
                                console.log(docRef)
                                const docSnap = await getDoc(docRef)
                                //console.log(docSnap.data().owner)
                                const apeO = docSnap.data().owner
                                //const apeC = docSnap.data().apeCount

                                console.log(apeO)
                                console.log("Document has been added successfully");
                            })
                            .catch(error => {
                                console.log(error);
                            })

                        });
              });

    }

    useEffect(() => {
        fetchOwners()
    }, [])

    return (
        <div>

        </div>
    )
}