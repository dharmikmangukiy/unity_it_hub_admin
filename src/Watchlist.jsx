import {
  Autocomplete,
  Button,
  FormControl,
  Input,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import SearchIcon from "@mui/icons-material/Search";
import io from "socket.io-client";

const topSCRIPT = [
  {
    script_name: "COPPER",
    script_id: "146",
    market_type_id: "1",
    selected: false,
  },
  {
    script_name: "SILVER",
    script_id: "2",
    market_type_id: "1",
    selected: false,
  },
  {
    script_name: "CRUDEOIL",
    script_id: "149",
    market_type_id: "1",
    selected: false,
  },
  {
    script_name: "GOLDM",
    script_id: "151",
    market_type_id: "1",
    selected: false,
  },
  {
    script_name: "LEAD",
    script_id: "154",
    market_type_id: "1",
    selected: false,
  },

  {
    script_name: "NATURALGAS",
    script_id: "157",
    market_type_id: "1",
    selected: false,
  },
  {
    script_name: "NICKEL",
    script_id: "158",
    market_type_id: "1",
    selected: false,
  },
  {
    script_name: "ZINC",
    script_id: "161",
    market_type_id: "1",
    selected: false,
  },
];
// var websocketurl1 = "https://bananafeeds.com:2053";

// const client = io(websocketurl1);

const Watchlist = () => {
  const [lastPong, setLastPong] = useState(null);
  // var soketData = {};
  const [tableData, setTableData] = useState(["SILVER-USD-I", "EURUSD"]);
  const [soketData, setsoketData] = useState([]);
  useEffect(() => {
    var websocketurl1 = "wss://liveapiprovider.com:3003";

    var client = io(websocketurl1);
    client.emit("joinUserId", { userId: "7718", userType: "3" });

    client.emit("addMarketWatch", { product: "SILVER-USD-I" });

    client.emit("addMarketWatch", { product: "EURUSD" });

    client.on("marketWatch", (soket123) => {
      setsoketData(soket123);
      tableData.map((item, index) => {
        if (item == soket123.data.InstrumentIdentifier) {
          soketData[index] = soket123.data;
          setsoketData([...soketData]);
          // setsoketData((preValue) => {
          //   return [...preValue, soket123];
          // });
        }
      });
    });
  }, []);
  return (
    <div>
      <div className="app-content--inner">
        <div className="app-content--inner__wrapper mh-100-vh">
          {/* <Paper elevation={2} style={{ borderRadius: "10px", height: "100%" }}> */}

          <div>
            <table className="watchListTable">
              <tr>
                <th>forex</th>
                <th>BID RATE</th>
                <th>ASK RATE</th>
                <th>LTP</th>
                <th>CHANGE %</th>
                <th>NET CHANGE</th>
                <th>HIGH</th>
                <th>LOW</th>
                {/* <th>OPEN</th>
                <th>CLOSE</th> */}
                <th>REMOVE</th>
              </tr>
              {/* <tr>
                <td>Alfreds Futterkiste</td>
                <td>Maria Anders</td>
                <td>Germany</td>
                <td>Germany</td>
                <td>Germany</td>
                <td>Germany</td>
                <td>Germany</td>
                <td>Germany</td>
                <td>Germany</td>

              </tr> */}
              <tbody>
                {soketData.length !== 0 &&
                soketData.length !== undefined &&
                soketData.length == tableData.length
                  ? tableData.map((item, index) => {
                      return (
                        <tr>
                          <td>{soketData[index].InstrumentIdentifier}</td>
                          <td>{soketData[index].SellPrice}</td>
                          <td>{soketData[index].BuyPrice}</td>
                          <td>{soketData[index].LastTradePrice}</td>
                          <td>
                            {soketData[index].PriceChangePercentage.toFixed(2)}
                          </td>
                          <td>{soketData[index].PriceChange.toFixed(4)}</td>
                          <td>{soketData[index].High}</td>
                          <td>{soketData[index].Low}</td>
                        </tr>
                      );
                    })
                  : ""}

                {/* <td>40,642.00</td>
                  <td>40,504.50</td> */}
                {/* <td>Germany</td> */}
              </tbody>
            </table>
          </div>
          {/* </Paper> */}
          {/* <div
            className="buysellfix br-10"
            style={{ backgroundColor: "rgb(161, 51, 41)" }}
          ></div> */}
        </div>
      </div>
    </div>
  );
};

export default Watchlist;
