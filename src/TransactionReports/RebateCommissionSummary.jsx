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

const RebateCommissionSummary = () => {
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
      label: "email",
      value: false,
      name: "user_email",
    },
    {
      label: "group name",
      value: false,
      name: "ib_group_name",
    },
    {
      label: "Account number",
      value: false,
      name: "mt5_acc_no",
    },
    // {
    //   label: "Lot",
    //   value: false,
    //   name: "total_lot_size",
    // },
  ]);

  const column = [
    {
      name: "sr no",
      minWidth: "72px",
      selector: (row) => {
        return <span>{row.sr_no}</span>;
      },
      //   sortable: true,
      // wrap: true,
      reorder: true,
      grow: 0.1,
    },
    {
      name: "name",
      selector: (row) => {
        return <span title={row.name}>{row.name}</span>;
      },
      sortable: false,
      // wrap: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "email",
      selector: (row) => {
        return <span title={row.user_email}>{row.user_email}</span>;
      },
      sortable: false,
      // wrap: true,
      reorder: true,
      grow: 0.5,
    },
    {
      name: "group name",
      selector: (row) => {
        return <span title={row.ib_group_name}>{row.ib_group_name}</span>;
      },
      sortable: false,
      reorder: true,
      // wrap: true,
      grow: 0.5,
    },
    {
      name: "ACCOUNT NUMBER",
      selector: (row) => {
        return <span title={row.mt5_acc_no}>{row.mt5_acc_no}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "lot",
      selector: (row) => {
        return <span title={row.total_lot_size}>{row.total_lot_size}</span>;
      },
      sortable: false,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "rebate generated",
      selector: (row) => {
        return (
          <span title={row.total_rebate_generated}>
            {row.total_rebate_generated}
          </span>
        );
      },
      sortable: false,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "rebate withdraw",
      selector: (row) => {
        return (
          <span title={row.total_rebate_withdraw}>
            {row.total_rebate_withdraw}
          </span>
        );
      },
      sortable: false,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "commission",
      selector: (row) => {
        return <span title={row.trade_commission}>{row.trade_commission}</span>;
      },
      sortable: false,
      reorder: true,
      grow: 0.4,
    },
  ];

  return (
    <div>
      <div className="app-content--inner">
        <div className="app-content--inner__wrapper mh-100-vh">
          <div style={{ opacity: 1 }}>
            <Grid container>
              <Grid item md={12} lg={12} xl={12}>
                <p className="main-heading">Rebate Commission Summary</p>
                <CommonFilter
                  search={searchBy}
                  setParam={setParam}
                  searchWord={setSearchKeyword}
                  search_users_list={resData.search_users_list}
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
                          url={`${Url}/datatable/rebate_and_commission_summary.php`}
                          setResData={setResData}
                          column={column}
                          sort="0"
                          refresh={refresh}
                          search={searchBy}
                          param={param}
                          searchWord={searchKeyword}
                          csv="datatable/rebate_and_commission_summary_export.php"
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

export default RebateCommissionSummary;
