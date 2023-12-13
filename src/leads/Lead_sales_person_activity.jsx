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

function Lead_sales_person_activity() {
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
      label: "Sales person",
      value: false,
      name: "sales_person",
    },
    {
      label: "user email",
      value: false,
      name: "user_email",
    },
    // {
    //   label: "follow up calls",
    //   value: false,
    //   name: "follow_up_calls",
    // },
    // {
    //   label: "email sent",
    //   value: false,
    //   name: "email_sent",
    // },
    // {
    //   label: "whatsapp sent",
    //   value: false,
    //   name: "whatsapp_sent",
    // },
    // {
    //   label: "new leads added",
    //   value: false,
    //   name: "new_leads_added",
    // },
    // {
    //   label: "demo open",
    //   value: false,
    //   name: "demo_open",
    // },
    // {
    //   label: "live open",
    //   value: false,
    //   name: "live_open",
    // },
    // {
    //   label: "deposited account",
    //   value: false,
    //   name: "deposited_account",
    // },
    // {
    //   label: "deposit account",
    //   value: false,
    //   name: "deposit_account",
    // },
    // {
    //   label: "new ib",
    //   value: false,
    //   name: "new_ib",
    // },
    // {
    //   label: "total ib",
    //   value: false,
    //   name: "total_ib",
    // },
    // {
    //   label: "new assigned leads",
    //   value: false,
    //   name: "new_assigned_leads",
    // },
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
      name: "Sales person",
      selector: (row) => {
        return <span title={row.sales_person}>{row.sales_person}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.7,
      // wrap: true,
    },
    {
      name: "user email",
      selector: (row) => {
        return <span title={row.user_email}>{row.user_email}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 1,
      // wrap: true,
    },
    {
      name: "fresh call",
      selector: (row) => {
        return <span title={row.fresh_calls}>{row.fresh_calls}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.5,
      // wrap: true,
    },
    {
      name: "follow up calls",
      selector: (row) => {
        return <span title={row.follow_ups}>{row.follow_ups}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.5,
      // wrap: true,
    },
    {
      name: "email sent",
      selector: (row) => {
        return <span title={row.email_send}>{row.email_send}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.5,
      // wrap: true,
    },
    {
      name: "whatsapp sent",
      selector: (row) => {
        return <span title={row.whatsup_send}>{row.whatsup_send}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.5,
      // wrap: true,
    },
    {
      name: "new leads added",
      selector: (row) => {
        return <span title={row.new_leads_added}>{row.new_leads_added}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.5,
      // wrap: true,
    },
    {
      name: "demo open",
      selector: (row) => {
        return <span title={row.demo_accounts}>{row.demo_accounts}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.5,
      // wrap: true,
    },
    {
      name: "live open",
      selector: (row) => {
        return <span title={row.live_accounts}>{row.live_accounts}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.5,
      // wrap: true,
    },
    {
      name: "deposited account",
      selector: (row) => {
        return (
          <span title={row.deposited_accounts}>{row.deposited_accounts}</span>
        );
      },
      sortable: true,
      reorder: true,
      grow: 0.5,
      // wrap: true,
    },
    {
      name: "deposited Amount",
      selector: (row) => {
        return (
          <span title={row.deposited_amounts}>{row.deposited_amounts}</span>
        );
      },
      sortable: true,
      reorder: true,
      grow: 0.5,
      // wrap: true,
    },
    {
      name: "new ib",
      selector: (row) => {
        return <span title={row.new_ib}>{row.new_ib}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.5,
      // wrap: true,
    },
    {
      name: "total ib",
      selector: (row) => {
        return <span title={row.total_ib}>{row.total_ib}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.5,
      // wrap: true,
    },
    {
      name: "new assigned leads",
      selector: (row) => {
        return <span title={row.new_leads_added}>{row.new_leads_added}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.5,
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
                <p className="main-heading">
                  Lead Sales Person Activity Report
                </p>
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
                          url={`${Url}/datatable/lead_reports/lead_sales_person_activity.php`}
                          column={columns}
                          sort="2"
                          refresh={refresh}
                          search={searchBy}
                          param={param}
                          searchWord={searchKeyword}
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

export default Lead_sales_person_activity;
