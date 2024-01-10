import { useState, useEffect } from 'react'

import { findAll } from "../../services/pastry";
import ApeListItem from "./apeListItem";

function ApeList() {
    const [loading, setLoading] = useState(false)
    const [apeWallet, setApeWallet] = useState([])
    const [apes, setApes] = useState([])
    const [apeCount, setApeCount] = useState([])


    const fetchData = async () => {
        setLoading(true)

        const res = await findAll()
        const res1 = [res[0]]

        setApeWallet(res1[0])

        //let res1 = apeWallet.owner.map((o, i) => ({ownerAddress: o, tokenCount: '' + res.apeCount[i]}))

        //console.log(apeWallet)
        setApes([...res[0].owner])
        setApeCount([...res[0].apeCount])
        setLoading(false)

    }

    function obj_to_arr(obj_of_arr) {
        const objects = [];

        for (const prop in obj_of_arr) {
            for (let i = 0; i < obj_of_arr[prop].length; i++) {
                if (typeof(objects[i]) != "object") {
                    objects[i] = {};
                }
                objects[i][prop] = obj_of_arr[prop][i];
            }
        }

        return objects;
    }

    const obj_of_arr = apeWallet;
    const merged = obj_to_arr(obj_of_arr)

    let mergedOwner = merged.map(({owner})=>[owner]).flat(1);
    let mergedToken = merged.map(({apeCount})=>[apeCount]).flat(1);
    console.log(mergedToken);

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <section>
            <header>
                <h2>Apes</h2>
            </header>

            { loading &&
                <p>loading...</p>
            }

            <ul>
                {apes.length > 0 && apes.map((ape) => (
                    // eslint-disable-next-line react/jsx-key
                    <ApeListItem key={ape.toString()} ape={ape}/>
                ))}
            </ul>
        </section>
    )
}

export default ApeList