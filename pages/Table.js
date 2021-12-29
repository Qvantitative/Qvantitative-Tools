import React, {useState} from 'react';
import Papa from 'papaparse';
import { useEffect } from 'react';
import { readCSV } from "danfojs-nightly";
import DataTables from "../components/DataTables";

const dfd = require("danfojs")

function App() {
  const [wallets, setWallets] = useState([])
  const [rows, setRows] = useState(null);
  const [compIndex, setCompIndex] = useState()

  useEffect(() => {
    readCSV("./csv/testOut.csv")
      .then(df => {
          const columns = df.columns
          const values = df.values
          setWallets(prev => {
            let new_data = prev.slice()
            let key = new_data.length + 1
            let dict = {
                columns: columns,
                values: values,
                df: df,
                keys: "df" + key
            }

            new_data.push(dict)
            //console.log(new_data)
            return new_data
          })

          const jsonObj = dfd.toJSON(df); //column format
          console.log(jsonObj)
          //const result = Object.keys(jsonObj).map(key => ({[key]: jsonObj[key]}));
          //console.log(result);

          const csv = Papa.unparse(jsonObj)
          console.log(csv)

          Papa.parse("./csv/boredAzuki.csv", {
              download: true,
              header: true,
              complete: data => {
                console.log(data.data);
                setRows(data);
              }
          });

          if (setWallets.length) {
            //console.log("dataComp column", setWallets[0].columns)
            //console.log("dataComp values", setWallets[0].values)
            //console.log("dataComp dataFame", setWallets[0].df)
         }

      }).catch(err => {
        console.log(err);
      })
  }, [])

  return (
    <div className="max-w-full mx-auto border-2 mt-10">
      <div className="flex flex-col">
        <div className="border-2 mb-10 flex flex-row">
          Nav
        </div>
        <div className="flex flex-row justify-between border-2">
          <div className="border-2 w-full">
            <div>
              {(wallets.length > 0) &&
                <DataTables
                    datacomp={wallets}
                    setCompIndex={setCompIndex}
                />
             }
            </div>

          </div>
          <div className="border-2 w-1/3">
            Side Plane
          </div>
        </div>
      </div>

    </div>
  );
}

export default App;