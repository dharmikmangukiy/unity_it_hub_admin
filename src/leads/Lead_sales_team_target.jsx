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

function Lead_sales_team_target() {
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
    //   label: "manager master id",
    //   value: false,
    //   name: "manager_master_id",
    // },
    // {
    //   label: "ac target",
    //   value: false,
    //   name: "ac_target",
    // },
    // {
    //   label: "achived target",
    //   value: false,
    //   name: "achived_target",
    // },
    // {
    //   label: "total percentage",
    //   value: false,
    //   name: "total_percentage",
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
      name: "ac target",
      selector: (row) => {
        return <span title={row.ac_target}>{row.ac_target}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.5,
      // wrap: true,
    },
    {
      name: "manager master id",
      selector: (row) => {
        return (
          <span title={row.manager_master_id}>{row.manager_master_id}</span>
        );
      },
      sortable: true,
      reorder: true,
      grow: 0.5,
      // wrap: true,
    },
    {
      name: "achived target",
      selector: (row) => {
        return <span title={row.achived_target}>{row.achived_target}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.5,
      // wrap: true,
    },
    {
      name: "total percentage",
      selector: (row) => {
        return <span title={row.total_percentage}>{row.total_percentage}</span>;
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
                <p className="main-heading">Lead Sales Team Target Report</p>
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
                          url={`${Url}/datatable/lead_reports/lead_sales_team_target.php`}
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

export default Lead_sales_team_target;
