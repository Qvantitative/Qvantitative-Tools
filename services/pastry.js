import React from "react";
import {getDocs, collection, getFirestore} from "firebase/firestore";
import { app } from "./server"

const collection_name = "apeHolders"

export const findAll = async () => {
    const db = getFirestore(app)
    const doc_refs = await getDocs(collection(db, collection_name))

    const res = []

    doc_refs.forEach(apes => {
        res.push({
            ...apes.data(),
        })
        //console.log(...res)
    })

    return res
}
