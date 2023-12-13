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

const LeadCallStatus = () => {
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
      name: "customer_name",
    },

    {
      label: "mobile",
      value: false,
      name: "customer_mobile",
    },
    {
      label: "email",
      value: false,
      name: "customer_email",
    },
    {
      label: "interest",
      value: false,
      name: "interest",
    },
    {
      label: "source name",
      value: false,
      name: "source_name",
    },
    {
      label: "salesman",
      value: false,
      name: "salesman",
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
      //  wrap: true,
      reorder: true,
      grow: 0.1,
    },
    {
      name: "name",
      selector: (row) => {
        return <span title={row.customer_name}>{row.customer_name}</span>;
      },
      sortable: true,
      reorder: true,
      //  wrap: true,
      grow: 0.5,
    },
    {
      name: "date",
      selector: (row) => {
        return (
          <span title={row.added_datetime}>
            <NewDate newDate={row.added_datetime} />
          </span>
        );
      },
      // wrap: true,
      sortable: true,
      reorder: true,
      grow: 0.7,
    },
    {
      name: "completed date",
      selector: (row) => {
        return (
          <span title={row.completed_datetime}>
            <NewDate newDate={row.completed_datetime} />
          </span>
        );
      },
      sortable: true,
      // wrap: true,
      reorder: true,
      grow: 0.7,
    },
    {
      name: "followup date",
      selector: (row) => {
        return (
          <span title={row.followup_datetime}>
            <NewDate newDate={row.followup_datetime} />
          </span>
        );
      },
      sortable: true,
      //  wrap: true,
      reorder: true,
      grow: 0.7,
    },

    {
      name: "mobile",
      selector: (row) => {
        return <span title={row.customer_mobile}>{row.customer_mobile}</span>;
      },
      sortable: true,
      reorder: true,
      //  wrap: true,
      grow: 0.5,
    },
    {
      name: "email",
      selector: (row) => {
        return <span title={row.customer_email}>{row.customer_email}</span>;
      },
      sortable: true,
      reorder: true,
      //   wrap: true,

      grow: 0.7,
    },
    {
      name: "country",
      selector: (row) => {
        return <span title={row.customer_country}>{row.customer_country}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "interest",
      selector: (row) => {
        return <span title={row.interest}>{row.interest}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "salesman",
      selector: (row) => {
        return <span title={row.salesman}>{row.salesman}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "source name",
      selector: (row) => {
        return <span title={row.source_name}>{row.source_name}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "status",
      selector: (row) => {
        return <span title={row.leads_status}>{row.leads_status}</span>;
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
      // wrap: true,

      grow: 0.7,
    },
  ];

  return (
    <div>
      <div className="app-content--inner">
        <div className="app-content--inner__wrapper mh-100-vh">
          <div style={{ opacity: 1 }}>
            <Grid container>
              <Grid item md={12} lg={12} xl={12}>
                <p className="main-heading">Lead Call Status</p>
                <CommonFilter
                  search={searchBy}
                  setParam={setParam}
                  searchWord={setSearchKeyword}
                  lastUpdatedBy={resData.modified_by_users}
                  sales_manager_list={resData.sales_manager_list}
                  source_list={resData.source_list}
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
                          url={`${Url}/datatable/lead_call_status.php`}
                          setResData={setResData}
                          column={column}
                          sort="0"
                          refresh={refresh}
                          search={searchBy}
                          param={param}
                          searchWord={searchKeyword}
                          csv="datatable/lead_call_status_export.php"
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

export default LeadCallStatus;
