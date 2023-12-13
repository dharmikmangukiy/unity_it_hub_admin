import React, { useEffect, useState } from "react";
import { FormControl, Grid, MenuItem, Select } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import { Paper } from "@mui/material";
import CommonTable from "../common/CommonTable";
import "react-toastify/dist/ReactToastify.css";
import { Url } from "../global";
import CommonFilter from "../common/CommonFilter";
import NewDate from "../common/NewDate";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IsApprove } from "../global";
import axios from "axios";

function Mt5_wise_user_rebate_report() {
  const [param, setParam] = useState({
    start_date: "",
    end_date: "",
  });
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [resData, setResData] = useState({});
  const [searchBy, setSearchBy] = useState([
    {
      label: "name",
      value: false,
      name: "name",
    },
    {
      label: "email",
      value: false,
      name: "email",
    },
    {
      label: "mt5 acc no",
      value: false,
      name: "mt5_acc_no",
    },
  ]);
  toast.configure();
  const columns = [
    {
      name: "SR.NO",
      minWidth: "72px",

      selector: (row) => {
        return <span>{row.sr_no}</span>;
      },
      reorder: true,
      // wrap: true,
      grow: 0.1,
    },
    {
      name: "NAME",
      selector: (row) => {
        return <span title={row.name}>{row.name}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.7,
      // wrap: true,
    },
    {
      name: "Email",
      selector: (row) => {
        return <span title={row.email}>{row.email}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.7,
      // wrap: true,
    },

    {
      name: "mt5 ac no",
      selector: (row) => {
        return <span title={row.mt5_acc_no}>{row.mt5_acc_no}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.4,
      // wrap: true,
    },
    {
        name: "ib name",
        selector: (row) => {
          return <span title={row.ib_name}>{row.ib_name}</span>;
        },
        reorder: true,
        grow: 0.7,
        // wrap: true,
      },

    {
        name: "ib email",
        selector: (row) => {
          return <span title={row.ib_email}>{row.ib_email}</span>;
        },
        reorder: true,
        grow: 0.7,
        // wrap: true,
      },
      {
        name: "IB Assign Rebate",
        selector: (row) => {
          return <span title={row.ib_assign_rebate}>{row.ib_assign_rebate}</span>;
        },
        reorder: true,
        grow: 0.7,
        // wrap: true,
      },
      {
        name: "sales pesron",
        selector: (row) => {
          return <span title={row.sales_pesron}>{row.sales_pesron}</span>;
        },
        reorder: true,
        grow: 0.7,
        // wrap: true,
      },
      {
        name: "total rebate",
        selector: (row) => {
          return <span title={row.total_rebate}>{row.total_rebate}</span>;
        },
        reorder: true,
        grow: 0.4,
        // wrap: true,
      },
      {
        name: "total lot",
        selector: (row) => {
          return <span title={row.total_lot}>{row.total_lot}</span>;
        },
        reorder: true,
        grow: 0.4,
        // wrap: true,
      },
  ];

  return (
    <div>
      <div className="app-content--inner">
        <div className="app-content--inner__wrapper mh-100-vh">
          <div style={{ opacity: 1 }}>
            <Grid container>
              <Grid item md={12} lg={12} xl={12}>
                <p className="main-heading">MT5 Wise User Rebate Report</p>
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
                          url={`${Url}//datatable/mt5_wise_user_rebate_report.php`}
                          column={columns}
                          sort="2"
                          refresh={refresh}
                          search={searchBy}
                          param={param}
                          searchWord={searchKeyword}
                          csv="datatable/mt5_wise_user_rebate_report_export.php"
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                  {/* <Grid container>
                  <Grid item md={6}>
                    <div className="row1 boxSection">
                      <div className="card padding-9 animate fadeLeft boxsize">
                        <div className="row">
                          <div className="col s12 m12 text-align-center">
                            <h5 className="mb-0">
                              {resData.total_deposits_footer}
                            </h5>
                            <p className="no-margin">Total Deposit</p>
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
                            <h5 className="mb-0">{resData.total_deposit}</h5>
                            <p className="no-margin">Deposit</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Grid>
                </Grid> */}
                </Paper>
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Mt5_wise_user_rebate_report;
