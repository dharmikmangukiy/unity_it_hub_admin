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

const SalesIncentive = () => {
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
      label: "Amount",
      value: false,
      name: "amount",
    },
    {
      label: "Description",
      value: false,
      name: "description",
    },
    {
      label: "Remarks",
      value: false,
      name: "remarks",
    },
  ]);

  const column = [
    {
      name: "Sr No",
      minWidth: "72px",
      selector: (row) => {
        return <span>{row.sr_no}</span>;
      },
      wrap: true,
      reorder: true,
      grow: 0.1,
    },
    {
      name: "Date",
      selector: (row) => {
        return (
          <span title={row.date}>
            <NewDate newDate={row.date} />
          </span>
        );
      },
      sortable: true,
      // wrap: true,
      reorder: true,
      grow: 0.2,
    },
    {
      name: "Name",
      selector: (row) => {
        return <span title={row.name}>{row.name}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.2,
    },
    {
      name: "Email",
      selector: (row) => {
        return <span title={row.email}>{row.email}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.2,
    },

    {
      name: "Amount",
      selector: (row) => {
        return <span title={row.amount}>{row.amount}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.1,
    },

    {
      name: "Description",
      selector: (row) => {
        return <span title={row.description}>{row.description}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "remarks",
      selector: (row) => {
        return <span title={row.remarks}>{row.remarks}</span>;
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
                <p className="main-heading">Sales Incentive Report</p>
                <CommonFilter
                  search={searchBy}
                  setParam={setParam}
                  searchWord={setSearchKeyword}
                  setResData={setResData}
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
                          url={`${Url}/datatable/salesman_incentive_list.php`}
                          column={column}
                          sort="1"
                          refresh={refresh}
                          search={searchBy}
                          param={param}
                          searchWord={searchKeyword}
                          salesReport={true}
                          setResData={setResData}
                          csv="datatable/salesman_incentive_list_export.php"
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
                                {resData.total_incentive_footer}
                              </h5>
                              <p className="no-margin">Total Incentive</p>
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
                              <p className="no-margin">Incentive</p>
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

export default SalesIncentive;
