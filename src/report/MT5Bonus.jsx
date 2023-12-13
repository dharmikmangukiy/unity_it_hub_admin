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

const PartnershipWithdraw = () => {
  const [param, setParam] = useState({
    start_date: "",
    end_date: "",
  });
  const [resData, setResData] = useState({});

  const [searchKeyword, setSearchKeyword] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [searchBy, setSearchBy] = useState([
    {
      label: "REFERENCE NO",
      value: false,
      name: "refrence_no",
    },
    {
      label: "NAME",
      value: false,
      name: "name",
    },
    {
      label: "WALLET CODE",
      value: false,
      name: "wallet_code",
    },
    {
      label: "PAYMENT METHOD",
      value: false,
      name: "method",
    },
    {
      label: "BONUS AMOUNT",
      value: false,
      name: "amount",
    },
  ]);

  const column = [
    {
      name: "SR.NO",
      minWidth: "72px",

      selector: (row) => {
        return <span>{row.sr_no}</span>;
      },
      // wrap: true,
      reorder: true,
      grow: 0.1,
    },
    {
      name: "REFERENCE NO.",
      selector: (row) => {
        return <span title={row.refrence_no}>{row.refrence_no}</span>;
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
          <span title={row.date}>
            <NewDate newDate={row.date} />
          </span>
        );
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.4,
    },
    {
      name: "NAME",
      selector: (row) => {
        return <span title={row.name}>{row.name}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "WALLET CODE",
      selector: (row) => {
        return <span title={row.wallet_code}>{row.wallet_code}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "MT5 Account",
      selector: (row) => {
        return <span title={row.mt5_acc_no}>{row.mt5_acc_no}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "PAYMENT METHOD",
      selector: (row) => {
        return <span title={row.method}>{row.method}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "BONUS AMOUNT",
      selector: (row) => {
        return <span title={row.amount}>{row.amount}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "TYPE",
      selector: (row) => {
        return <span title={row.bonus_type}>{row.bonus_type}</span>;
      },
      reorder: true,
      grow: 0.3,
    },
    {
      name: "remark",
      selector: (row) => {
        return <span title={row.bonus_remarks}>{row.bonus_remarks}</span>;
      },
      reorder: true,
      grow: 0.3,
    },
    {
      name: "STATUS",
      selector: (row) => {
        return (
          <span
            className={`status-${row.status == "1" ? "active" : "in-active"}`}
          >
            {row.status == "1" ? "Active" : "In-Active"}
          </span>
        );
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
                <p className="main-heading">MT5 Bonus Report</p>
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
                          url={`${Url}/datatable/mt5_bonus_list.php`}
                          column={column}
                          sort="1"
                          refresh={refresh}
                          search={searchBy}
                          param={param}
                          setResData={setResData}
                          searchWord={searchKeyword}
                          csv="datatable/mt5_bonus_list_export.php"
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                  <Grid container>
                    <Grid item md={12}>
                      <div className="row1 boxSection">
                        <div className="card padding-9 animate fadeLeft boxsize">
                          <div className="row">
                            <div className="col s12 m12 text-align-center">
                              <h5 className="mb-0">
                                {resData.total_bonus_footer}
                              </h5>
                              <p className="no-margin">Total bonus</p>
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

export default PartnershipWithdraw;
