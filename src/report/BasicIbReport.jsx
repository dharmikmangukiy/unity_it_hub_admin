import React, { useState, useEffect } from "react";
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
import axios from "axios";

const BasicIbReport = () => {
  const [refresh, setRefresh] = useState(false);
  const [param, setParam] = useState({
    start_date: "",
    end_date: "",
  });
  const [searchBy, setSearchBy] = useState([
    {
      label: "IB Name",
      value: false,
      name: "ib_name",
    },
    {
      label: "Sub IB Total",
      value: false,
      name: "sub_ib_total",
    },
    {
      label: "Total Client",
      value: false,
      name: "total_client",
    },
    {
      label: "Deposit",
      value: false,
      name: "deposit",
    },
    {
      label: "Withdraw",
      value: false,
      name: "withdraw",
    },
    {
      label: "Total Lot Work",
      value: false,
      name: "total_lot_work",
    },
    {
      label: "Total Commission",
      value: false,
      name: "total_commission",
    },
    {
      label: "Personal Deposit",
      value: false,
      name: "personal_deposit",
    },
    {
      label: "Personal Withdraw",
      value: false,
      name: "personal_withdraw",
    },
    {
      label: "Lot Size",
      value: false,
      name: ".personal_lot_size",
    },
    {
      label: "Total Dead Account",
      value: false,
      name: "total_dead_account",
    },
    {
      label: "Total Group Wise List Count",
      value: false,
      name: "total_group_wise_list_count",
    },
  ]);
  const [searchKeyword, setSearchKeyword] = useState("");

  const [resData, setResData] = useState({});

  const column = [
    {
      name: "Sr No",
      minWidth: "72px",
      selector: (row) => {
        return <span>{row.sr_no}</span>;
      },
      // wrap: true,
      reorder: true,
      grow: 0.1,
    },
    {
      name: "IB Name",
      selector: (row) => {
        return <span title={row.ib_name}>{row.ib_name}</span>;
      },
      sortable: true,
      // wrap: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "Sub IB Total ",
      selector: (row) => {
        return <span title={row.sub_ib_total}>{row.sub_ib_total}</span>;
      },
      reorder: true,
      // wrap: true,
      grow: 0.2,
    },
    {
      name: "Total Client",
      selector: (row) => {
        return <span title={row.total_client}>{row.total_client}</span>;
      },
      reorder: true,
      grow: 0.2,
    },
    {
      name: "Deposit",
      selector: (row) => {
        return <span title={row.deposit}>${row.deposit}</span>;
      },
      reorder: true,
      grow: 0.3,
    },
    {
      name: "Withdraw",
      selector: (row) => {
        return <span title={row.withdraw}>${row.withdraw}</span>;
      },
      reorder: true,
      grow: 0.3,
    },
    {
      name: "Total Lot Work",
      selector: (row) => {
        return <span title={row.total_lot_work}>${row.total_lot_work}</span>;
      },
      reorder: true,
      grow: 0.3,
    },
    {
      name: "Total Commission",
      selector: (row) => {
        return (
          <span title={row.total_commission}>${row.total_commission}</span>
        );
      },
      reorder: true,
      grow: 0.3,
    },
    {
      name: "Personal Deposit",
      selector: (row) => {
        return <span title={row.personal_deposit}>{row.personal_deposit}</span>;
      },
      reorder: true,
      grow: 0.3,
    },
    {
      name: "Personal Withdraw",
      selector: (row) => {
        return (
          <span title={row.personal_withdraw}>${row.personal_withdraw}</span>
        );
      },
      reorder: true,
      grow: 0.3,
    },
    {
      name: "Lot Size",
      selector: (row) => {
        return (
          <span title={row.personal_lot_size}>{row.personal_lot_size}</span>
        );
      },
      reorder: true,
      grow: 0.3,
    },
    {
      name: "Total Dead Account",
      selector: (row) => {
        return (
          <span title={row.total_dead_account}>{row.total_dead_account}</span>
        );
      },
      reorder: true,
      grow: 0.3,
    },
    {
      name: "Total Group Wise List Count",
      selector: (row) => {
        return (
          <span title={row.total_group_wise_list_count}>
            {row.total_group_wise_list_count}
          </span>
        );
      },
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
                <p className="main-heading">All In One IB Report</p>

                <CommonFilter
                  search={searchBy}
                  setParam={setParam}
                  searchWord={setSearchKeyword}
                  date={true}
                  isShowFilterBy={true}
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
                          url={`${Url}/datatable/basic_ib_report.php`}
                          column={column}
                          sort="1"
                          refresh={refresh}
                          search={searchBy}
                          param={param}
                          searchWord={searchKeyword}
                          setResData={setResData}
                          csv="datatable/basic_ib_report_export.php"
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                  <Grid container>
                    <Grid item md={3}>
                      <div className="row1 boxSection">
                        <div className="card padding-9 animate fadeLeft boxsize">
                          <div className="row">
                            <div className="col s12 m12 text-align-center">
                              <h5 className="mb-0">
                                {resData.personal_deposit_sum}
                              </h5>
                              <p className="no-margin">
                                Total personal deposit
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Grid>
                    <Grid item md={3}>
                      <div className="row1 boxSection">
                        <div className="card padding-9 animate fadeLeft boxsize">
                          <div className="row">
                            <div className="col s12 m12 text-align-center">
                              <h5 className="mb-0">
                                {resData.personal_lot_size_sum}
                              </h5>
                              <p className="no-margin">
                                Total personal lot size{" "}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Grid>
                    <Grid item md={3}>
                      <div className="row1 boxSection">
                        <div className="card padding-9 animate fadeLeft boxsize">
                          <div className="row">
                            <div className="col s12 m12 text-align-center">
                              <h5 className="mb-0">
                                {resData.personal_withdraw_sum}
                              </h5>
                              <p className="no-margin">
                                Total personal withdraw
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Grid>
                    <Grid item md={3}>
                      <div className="row1 boxSection">
                        <div className="card padding-9 animate fadeLeft boxsize">
                          <div className="row">
                            <div className="col s12 m12 text-align-center">
                              <h5 className="mb-0">
                                {resData.total_commission_sum}
                              </h5>
                              <p className="no-margin">Total commission</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Grid>
                    <Grid item md={3}>
                      <div className="row1 boxSection">
                        <div className="card padding-9 animate fadeLeft boxsize">
                          <div className="row">
                            <div className="col s12 m12 text-align-center">
                              <h5 className="mb-0">
                                {resData.total_lot_work_sum}
                              </h5>
                              <p className="no-margin">Total lot work</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Grid>
                    <Grid item md={3}>
                      <div className="row1 boxSection">
                        <div className="card padding-9 animate fadeLeft boxsize">
                          <div className="row">
                            <div className="col s12 m12 text-align-center">
                              <h5 className="mb-0">{resData.withdraw_sum}</h5>
                              <p className="no-margin">Total Withdrawal</p>
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

export default BasicIbReport;
