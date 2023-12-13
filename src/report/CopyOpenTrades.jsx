// import './partnership_withdraw.css';
import React, { useState } from "react";
import {
  CardContent,
  FormControl,
  Grid,
  MenuItem,
  Paper,
  Select,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import CommonFilter from "../common/CommonFilter";
import CommonTable from "../common/CommonTable";
import { Url } from "../global";

const CopyOpenTrades = () => {
  const [refresh, setRefresh] = useState(false);
  const [resData, setResData] = useState({});
  const [searchKeyword, setSearchKeyword] = useState("");
  const [param, setParam] = useState({
    start_date: "",
    end_date: "",
  });
  const [searchBy, setSearchBy] = useState([
    {
      label: "NAME",
      value: false,
      name: "name",
    },
    {
      label: "LOGIN",
      value: false,
      name: "mt5",
    },
    {
      label: "EQUITY",
      value: false,
      name: "equity",
    },
    {
      label: "MT5 BALANCE",
      value: false,
      name: "mt_balance",
    },
    {
      label: "TRADE PROFIT",
      value: false,
      name: "profit",
    },
    {
      label: "TOTAL LOT",
      value: false,
      name: "trade_volume",
    },
    {
      label: "PROFIT",
      value: false,
      name: "profit",
    },
    {
      label: "LOT",
      value: false,
      name: "volume",
    },
    {
      label: "EXPERT POSITION ID",
      value: false,
      name: "expert_position_id",
    },
    {
      label: "COMMENT",
      value: false,
      name: "comment",
    },
  ]);

  const column = [
    {
      name: "NAME",
      selector: (row) => {
        return <span>{row.name}</span>;
      },
      sortable: true,
      wrap: true,
      reorder: true,
      grow: 0.1,
    },
    {
      name: "LOGIN",
      selector: (row) => {
        return <span title={row.mt5}>{row.mt5}</span>;
      },
      sortable: true,
      wrap: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "EQUITY",
      selector: (row) => {
        return <span title={row.equity}>{row.equity}</span>;
      },
      sortable: true,
      reorder: true,
      wrap: true,
      grow: 0.5,
    },
    {
      name: "MT5 BALANCE",
      selector: (row) => {
        return <span title={row.mt_balance}>{row.mt_balance}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "TRADE PROFIT",
      selector: (row) => {
        return <span title={row.profit}>{row.profit}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "TOTAL LOT",
      selector: (row) => {
        return <span title={row.trade_volume}>{row.trade_volume}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "PROFIT",
      selector: (row) => {
        return <span title={row.profit}>{row.profit}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "LOT",
      selector: (row) => {
        return <span title={row.volume}>{row.volume}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "EXPERT POSITION ID",
      selector: (row) => {
        return (
          <span title={row.expert_position_id}>{row.expert_position_id}</span>
        );
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "COMMENT",
      selector: (row) => {
        return <span title={row.comment}>{row.comment}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
  ];

  return (
    <div>
      <div className="app-content--inner">
        <div className="app-content--inner__wrapper mh-100-vh">
          <div style={{ opacity: 1 }}>
            <Grid container>
              <Grid item md={12} lg={12} xl={12}>
                <p className="main-heading">
                  Copy Trading Open Position Report
                </p>

                <div className="setBoxs">
                  {" "}
                  <div className="row1 boxSection">
                    <div className="card padding-9 animate fadeLeft boxsize">
                      <div className="row">
                        <div className="col s12 m12 text-align-center">
                          <h5 className="mb-0">{resData.total_mt_balance}</h5>
                          <p className="no-margin">MT Balance</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row1 boxSection">
                    <div className="card padding-9 animate fadeLeft boxsize">
                      <div className="row">
                        <div className="col s12 m12 text-align-center">
                          <h5 className="mb-0">{resData.total_profit} </h5>
                          <p className="no-margin">MT Profit</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row1 boxSection">
                    <div className="card padding-9 animate fadeLeft boxsize">
                      <div className="row">
                        <div className="col s12 m12 text-align-center">
                          <h5 className="mb-0">{resData.total_equity}</h5>
                          <p className="no-margin">MT Equity</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row1 boxSection">
                    <div className="card padding-9 animate fadeLeft boxsize">
                      <div className="row">
                        <div className="col s12 m12 text-align-center">
                          <h5 className="mb-0">
                            {resData.total_volume_value}{" "}
                          </h5>
                          <p className="no-margin">MT Volume</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <CommonFilter
                  search={searchBy}
                  setParam={setParam}
                  searchWord={setSearchKeyword}
                />
                <br />
                <Paper
                  elevation={2}
                  style={{ borderRadius: "10px" }}
                  className="pending-all-15px"
                >
                  <CardContent className="py-3">
                    <Grid container spacing={2}>
                      <Grid item sm={12} md={12} lg={12}>
                        <CommonTable
                          url={`${Url}/datatable/copy_open_trading_list.php`}
                          column={column}
                          sort="1"
                          refresh={refresh}
                          param={param}
                          search={searchBy}
                          setResData={setResData}
                          searchWord={searchKeyword}
                          csv="datatable/copy_open_trading_list_export.php"
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Paper>
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CopyOpenTrades;
