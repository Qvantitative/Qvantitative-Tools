import React from "react";
import Papa from "papaparse";

export default function App() {
  const [rows, setRows] = React.useState(null);
  React.useEffect(() => {
    Papa.parse("./csv/doodlesAzuki.csv", {
      download: true,
      header: true,
      complete: data => {
        console.log(data.data);
        setRows(data);
      }
    });
  }, []);

  return (
    <div className="border-1 mt-10">
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle min-w-full inline-block sm:px-6 lg:px-8 flex-row justify-between">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg border-2">
              <table className="overscroll-contain min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>{rows?.meta.fields.map((column, myKey) => <th key={myKey}>{column}</th>)}</tr>
                  </thead>
                  {rows?.data.map((row, myKey) => {
                    return (
                      <tbody key={myKey}>
                        <tr className={row % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="whitespace-nowrap text-sm font-medium text-gray-900">{row.Addresses}</td>
                          <td className="whitespace-nowrap text-sm text-gray-500">{row.Doodles}</td>
                          <td className="whitespace-nowrap text-sm text-gray-500">{row.Azuki}</td>
                        </tr>
                      </tbody>
                    );
                  })}
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}