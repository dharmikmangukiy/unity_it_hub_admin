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
import NewDate from "../common/NewDate";

const TradeHistory = () => {
  const [param, setParam] = useState({
    start_date: "",
    end_date: "",
  });
  const [searchKeyword, setSearchKeyword] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [resData, setResData] = useState({});

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
      label: "TRADE NO",
      value: false,
      name: "order",
    },
    {
      label: "SYMBOL",
      value: false,
      name: "symbol",
    },
    {
      label: "PRICE",
      value: false,
      name: "price",
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
      //  wrap: true,
      reorder: true,
      grow: 0.4,
    },
    {
      name: "LOGIN",
      selector: (row) => {
        return <span title={row.mt5}>{row.mt5}</span>;
      },
      sortable: true,
      // wrap: true,
      reorder: true,
      grow: 0.4,
    },
    {
      name: "DATE",
      selector: (row) => {
        return (
          <span title={row.trade_datetime}>
            <NewDate newDate={row.trade_datetime} />
          </span>
        );
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.4,
    },
    {
      name: "TRADE NO.",
      selector: (row) => {
        return <span title={row.order}>{row.order}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "SYMBOL",
      selector: (row) => {
        return <span title={row.symbol}>{row.symbol}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "PRICE",
      selector: (row) => {
        return <span title={row.price}>{row.price}</span>;
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
                <p className="main-heading">Trade History</p>
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
                          url={`${Url}/datatable/mt5_trade_history_list.php`}
                          setResData={setResData}
                          column={column}
                          sort="1"
                          refresh={refresh}
                          search={searchBy}
                          param={param}
                          searchWord={searchKeyword}
                          csv="datatable/mt5_trade_history_list_export.php"
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                  <Grid container>
                    <Grid item md={6}>
                      <div className="row1 boxSection">
                        <div className="card padding-9 animate fadeLeft boxsize">
                          <div className="row">
                            <div className="col s12 m12 text-align-center">
                              <h5 className="mb-0">
                                {resData.total_total_trade_profit_footer}
                              </h5>
                              <p className="no-margin">Profit</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Grid>
                    <Grid item md={6}>
                      <div className="row1 boxSection">
                        <div className="card padding-9 animate fadeLeft boxsize">
                          <div className="row">
                            <div className="col s12 m12 text-align-center">
                              <h5 className="mb-0">
                                {resData.total_trade_trade_volume_footer}
                              </h5>
                              <p className="no-margin">Lot</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeHistory;
