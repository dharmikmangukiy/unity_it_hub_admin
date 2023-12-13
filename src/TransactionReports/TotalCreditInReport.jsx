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

const TotalCreditInReport = () => {
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
      name: "email",
    },
    {
      label: "amount",
      value: false,
      name: "amount",
    },
    {
      label: "wallet code",
      value: false,
      name: "wallet_code",
    },
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
      sortable: true,
      // wrap: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "email",
      selector: (row) => {
        return <span title={row.email}>{row.email}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.5,
    },
    {
      name: "amount",
      selector: (row) => {
        return <span title={row.amount}>{row.amount}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "wallet code",
      selector: (row) => {
        return <span title={row.wallet_code}>{row.wallet_code}</span>;
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
                <p className="main-heading">Total Credit In Report</p>
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
                          url={`${Url}/datatable/total_credit_in_list.php`}
                          setResData={setResData}
                          column={column}
                          sort="0"
                          refresh={refresh}
                          search={searchBy}
                          param={param}
                          searchWord={searchKeyword}
                          csv="datatable/total_credit_in_list_export.php"
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
                              <p className="no-margin">Total Bonus</p>
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

export default TotalCreditInReport;
