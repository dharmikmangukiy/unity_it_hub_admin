import "./partnership_withdraw.css";
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

const PartnershipWithdraw = () => {
  const [refresh, setRefresh] = useState(false);
  const [searchBy, setSearchBy] = useState([
    {
      label: "DATE",
      value: false,
      name: "date",
    },
    {
      label: "NAME",
      value: false,
      name: "name",
    },
    {
      label: "MT5 A/C NO.",
      value: false,
      name: "mt5_acc_no",
    },
    {
      label: "AMOUNT",
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
      sortable: true,
      wrap: true,
      reorder: true,
      grow: 0.1,
    },
    {
      name: "DATE",
      selector: (row) => {
        return <span title={row.date}>{row.date}</span>;
      },
      sortable: true,
      wrap: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "NAME",
      selector: (row) => {
        return <span title={row.name}>{row.name}</span>;
      },
      sortable: true,
      reorder: true,
      wrap: true,
      grow: 0.5,
    },
    {
      name: "MT5 A/C NO.",
      selector: (row) => {
        return <span title={row.mt5_acc_no}>{row.mt5_acc_no}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "AMOUNT",
      selector: (row) => {
        return <span title={row.amount}>{row.amount}</span>;
      },
      sortable: true,
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
                <p className="main-heading">IB Withdraw</p>
                <CommonFilter search={searchBy} />
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
                          url={`${Url}/datatable/partnership_withdraw_list.php`}
                          column={column}
                          sort="1"
                          refresh={refresh}
                          search={searchBy}
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

export default PartnershipWithdraw;
