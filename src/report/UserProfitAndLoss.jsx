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

const UserProfitAndLoss = () => {
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
      label: "MT5 ACCOUNT ID",
      value: false,
      name: "mt5",
    },
    {
      label: "PROFIT & LOSS",
      value: false,
      name: "profit_loss",
    },
  ]);

  const column = [
    {
      name: "NAME",
      selector: (row) => {
        return <span>{row.name}</span>;
      },
      sortable: true,
      // wrap: true,
      reorder: true,
      grow: 1,
    },
    {
      name: "MT5 ACCOUNT ID",
      selector: (row) => {
        return <span title={row.mt5}>{row.mt5}</span>;
      },
      sortable: true,
      // wrap: true,
      reorder: true,
      grow: 1,
    },
    {
      name: "PROFIT & LOSS",
      selector: (row) => {
        return <span title={row.profit_loss}>{row.profit_loss}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 1,
    },
  ];
  return (
    <div>
      <div className="app-content--inner">
        <div className="app-content--inner__wrapper mh-100-vh">
          <div style={{ opacity: 1 }}>
            <Grid container>
              <Grid item md={12} lg={12} xl={12}>
                <p className="main-heading">Users Profit and Loss Report</p>
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
                          url={`${Url}/datatable/user_wise_filter_report.php`}
                          column={column}
                          sort="1"
                          refresh={refresh}
                          setResData={setResData}
                          search={searchBy}
                          param={param}
                          searchWord={searchKeyword}
                          csv="datatable/basic_ib_report_export.php"
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
                                {resData.total_profit_loss_footer}
                              </h5>
                              <p className="no-margin">Total P&L</p>
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

export default UserProfitAndLoss;
