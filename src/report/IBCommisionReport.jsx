import React, { useEffect, useState } from "react";
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

const IBCommisionReport = () => {
  const [refresh, setRefresh] = useState(false);
  const [resData, setResData] = useState({});
  const [searchKeyword, setSearchKeyword] = useState("");
  const [param, setParam] = useState({
    start_date: "",
    end_date: "",
  });
  const [userList, setUserList] = useState([]);
  const [searchBy, setSearchBy] = useState([
    {
      label: "LOGIN",
      value: false,
      name: "name",
    },
    {
      label: "IB GROUP ID",
      value: false,
      name: "ib_group_id",
    },
    {
      label: "TRADE NO",
      value: false,
      name: "trade_no",
    },
    {
      label: "SYMBOL",
      value: false,
      name: "trade_symbol",
    },
    {
      label: "TYPE",
      value: false,
      name: "trade_type",
    },
    {
      label: "PRICE",
      value: false,
      name: "ib_comission_amount",
    },
    {
      label: "LOT",
      value: false,
      name: "trade_volume",
    },
    {
      label: "CLOSE PRICE",
      value: false,
      name: "trade_close_price",
    },
  ]);

  const column = [
    {
      name: "LOGIN",
      selector: (row) => {
        return <span>{row.name}</span>;
      },
      sortable: true,
      // wrap: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "IB GROUP ID",
      selector: (row) => {
        return <span title={row.ib_group_id}>{row.ib_group_id}</span>;
      },
      sortable: true,
      // wrap: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "MT5 account",
      selector: (row) => {
        return <span title={row.mt5_account_id}>{row.mt5_account_id}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.4,
      // wrap: true,
    },
    {
      name: "DATE",
      selector: (row) => {
        return (
          <span title={row.added_datetime}>
            <NewDate newDate={row.added_datetime} />
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
        return <span title={row.trade_no}>{row.trade_no}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "SYMBOL",
      selector: (row) => {
        return <span title={row.trade_symbol}>{row.trade_symbol}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "TYPE",
      selector: (row) => {
        return <span title={row.trade_type}>{row.trade_type}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.1,
    },
    {
      name: "PRICE",
      selector: (row) => {
        return (
          <span title={row.ib_comission_amount}>{row.ib_comission_amount}</span>
        );
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "LOT",
      selector: (row) => {
        return <span title={row.trade_volume}>{row.trade_volume}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "CLOSE PRICE",
      selector: (row) => {
        return (
          <span title={row.trade_close_price}>{row.trade_close_price}</span>
        );
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
  ];

  useEffect(() => {
    if (resData.all_commission_users) {
      setUserList([...resData.all_commission_users]);
    }
  }, [resData]);

  return (
    <div>
      <div className="app-content--inner">
        <div className="app-content--inner__wrapper mh-100-vh">
          <div style={{ opacity: 1 }}>
            <Grid container>
              <Grid item md={12} lg={12} xl={12}>
                <p className="main-heading">User IB Commissions</p>
                <div className="setBoxs">
                  {" "}
                  <div className="row1 boxSection">
                    <div className="card padding-9 animate fadeLeft boxsize">
                      <div className="row">
                        <div className="col s12 m12 text-align-center">
                          <h5 className="mb-0">{resData.total_lot}</h5>
                          <p className="no-margin">Total Lot</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row1 boxSection">
                    <div className="card padding-9 animate fadeLeft boxsize">
                      <div className="row">
                        <div className="col s12 m12 text-align-center">
                          <h5 className="mb-0">{resData.total_amount} </h5>
                          <p className="no-margin">Total Amount</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <CommonFilter
                  search={searchBy}
                  setParam={setParam}
                  searchWord={setSearchKeyword}
                  userlist={userList}
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
                          url={`${Url}/datatable/user_ib_commission_list.php`}
                          column={column}
                          sort="1"
                          refresh={refresh}
                          search={searchBy}
                          setResData={setResData}
                          param={param}
                          searchWord={searchKeyword}
                          csv="datatable/user_ib_commission_list_export.php"
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

export default IBCommisionReport;
