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

const SalesReport = () => {
  const [param, setParam] = useState({
    start_date: "",
    end_date: "",
  });
  const [resData, setResData] = useState({});
  const [searchKeyword, setSearchKeyword] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [searchBy, setSearchBy] = useState([
    {
      label: "NAME",
      value: false,
      name: "name",
    },
    {
      label: "Email",
      value: false,
      name: "user_email",
    },
    {
      label: "Phone",
      value: false,
      name: "user_phone",
    },
    {
      label: "Account target",
      value: false,
      name: "ac_target",
    },
  ]);

  const column = [
    {
      name: "Sr No",
      minWidth: "72px",
      selector: (row) => {
        return <span>{row.sr_no}</span>;
      },
      sortable: true,
      // wrap: true,
      reorder: true,
      grow: 0.1,
    },
    {
      name: "Salesman Name",
      selector: (row) => {
        return <span title={row.salesman_name}>{row.salesman_name}</span>;
      },
      sortable: true,
      // wrap: true,
      reorder: true,
      grow: 0.4,
    },
    {
      name: "Salesman Email",
      selector: (row) => {
        return <span title={row.salesman_email}>{row.salesman_email}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.4,
    },
    {
      name: "Salesman Mobile",
      selector: (row) => {
        return <span title={row.salesman_mobile}>{row.salesman_mobile}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.4,
    },

    {
      name: "Manager Name",
      selector: (row) => {
        return <span title={row.manager_name}>{row.manager_name}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.1,
    },

    {
      name: "Lot Size",
      selector: (row) => {
        return <span title={row.lot_size}>{row.lot_size}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "No. of Leads Given ",
      selector: (row) => {
        return <span title={row.lot_size}>{row.lot_size}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "Target",
      selector: (row) => {
        return <span title={row.target_given}>{row.target_given}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "Leads added by Self ",
      selector: (row) => {
        return (
          <span title={row.self_lead_added_count}>
            {row.self_lead_added_count}
          </span>
        );
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "Leads Converted",
      selector: (row) => {
        return <span title={row.lead_completed}>{row.lead_completed}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "Converted lead Ratio -",
      selector: (row) => {
        return (
          <span title={row.convert_lead_ratio}>{row.convert_lead_ratio}</span>
        );
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "Total Dialed calls",
      selector: (row) => {
        return (
          <span title={row.total_dialled_calls}>{row.total_dialled_calls}</span>
        );
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "Fresh call for today",
      selector: (row) => {
        return (
          <span title={row.fresh_call_for_today}>
            {row.fresh_call_for_today}
          </span>
        );
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "Followup call",
      selector: (row) => {
        return <span title={row.follow_up_call}>{row.follow_up_call}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "Account open demo",
      selector: (row) => {
        return <span title={row.no_demo_acc_open}>{row.no_demo_acc_open}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "Account open real",
      selector: (row) => {
        return <span title={row.no_live_acc_open}>{row.no_live_acc_open}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "New Account Deposit",
      selector: (row) => {
        return (
          <span title={row.new_account_deposit}>{row.new_account_deposit}</span>
        );
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "Top-up Deposit",
      selector: (row) => {
        return <span title={row.top_up_deposit}>{row.top_up_deposit}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "Total Follow Ups",
      selector: (row) => {
        return <span title={row.total_follow_up}>{row.total_follow_up}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "Active Clients",
      selector: (row) => {
        return <span title={row.active_client}>{row.active_client}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "Dead Clients",
      selector: (row) => {
        return <span title={row.dead_client}>{row.dead_client}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "Numbers of accounts in Group",
      selector: (row) => {
        return (
          <span title={row.group_wise_account}>{row.group_wise_account}</span>
        );
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "Close positive",
      selector: (row) => {
        return (
          <span title={row.no_of_lead_reject}>{row.no_of_lead_reject}</span>
        );
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "Close negative ",
      selector: (row) => {
        return (
          <span title={row.no_of_lead_complete}>{row.no_of_lead_complete}</span>
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
                <p className="main-heading">Sales Report</p>
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
                          url={`${Url}/datatable/sales_report.php`}
                          column={column}
                          sort="1"
                          refresh={refresh}
                          search={searchBy}
                          param={param}
                          setResData={setResData}
                          searchWord={searchKeyword}
                          csv="datatable/sales_report_export.php"
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
                                {resData.total_ac_target_footer}
                              </h5>
                              <p className="no-margin">Total Target</p>
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
                                {resData.total_incentive}
                              </h5>
                              <p className="no-margin">Total Incentive</p>
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

export default SalesReport;
