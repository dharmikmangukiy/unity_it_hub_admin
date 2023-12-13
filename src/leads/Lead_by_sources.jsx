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

function Lead_by_sources() {
  const [param, setParam] = useState({
    start_date: "",
    end_date: "",
  });
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [resData, setResData] = useState({});
  const [searchBy, setSearchBy] = useState([
    // {
    //   label: "LEAD BY SOURCE",
    //   value: false,
    //   name: "lead_by_source",
    // },
    {
      label: "SOURCE NAME",
      value: false,
      name: "name",
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
      name: "SOURCE NAME",
      selector: (row) => {
        return <span title={row.name}>{row.name}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.7,
      // wrap: true,
    },
    {
      name: "LEAD BY SOURCE",
      selector: (row) => {
        return (
          <span
            title={row.lead_by_source}
            onClick={() => {
              navigate(`/leads_list/source_id/${row.name}`);
            }}
          >
            {row.lead_by_source}
          </span>
        );
      },
      sortable: true,
      reorder: true,
      grow: 1,
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
                <p className="main-heading">Lead by Source Report</p>
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
                          url={`${Url}/datatable/lead_reports/lead_by_sources.php`}
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

export default Lead_by_sources;
