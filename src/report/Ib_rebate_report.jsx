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

function Ib_rebate_report() {
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
      label: "sales person name",
      value: false,
      name: "sales_person_name",
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
      name: "ib type",
      selector: (row) => {
        return <span title={row.ib_type}>{row.ib_type}</span>;
      },
      reorder: true,
      grow: 0.7,
      // wrap: true,
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
      name: "phone",
      selector: (row) => {
        return <span title={row.phone}>{row.phone}</span>;
      },
      reorder: true,
      grow: 0.4,
      // wrap: true,
    },
    {
      name: "user country",
      selector: (row) => {
        return <span title={row.user_country}>{row.user_country}</span>;
      },
      reorder: true,
      grow: 0.4,
      // wrap: true,
    },
    {
      name: "sales person name",
      selector: (row) => {
        return (
          <span title={row.sales_person_name}>{row.sales_person_name}</span>
        );
      },
      reorder: true,
      grow: 0.4,
      // wrap: true,
    },
    {
      name: "sub ib total",
      selector: (row) => {
        return <span title={row.sub_ib_total}>{row.sub_ib_total}</span>;
      },
      reorder: true,
      grow: 0.4,
      // wrap: true,
    },

    {
      name: "total client",
      selector: (row) => {
        return <span title={row.total_client}>{row.total_client}</span>;
      },
      reorder: true,
      grow: 0.4,
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
      name: "deposit",
      selector: (row) => {
        return <span title={row.deposit}>{row.deposit}</span>;
      },
      reorder: true,
      grow: 0.7,
      // wrap: true,
    },

    {
      name: "withdraw",
      selector: (row) => {
        return <span title={row.withdraw}>{row.withdraw}</span>;
      },
      reorder: true,
      grow: 0.4,
      // wrap: true,
    },
    {
      name: "rebate generated",
      selector: (row) => {
        return <span title={row.rebate_generated}>{row.rebate_generated}</span>;
      },
      reorder: true,
      grow: 0.4,
      // wrap: true,
    },
    {
      name: "rebate withdraw",
      selector: (row) => {
        return <span title={row.rebate_withdraw}>{row.rebate_withdraw}</span>;
      },
      reorder: true,
      grow: 0.4,
      // wrap: true,
    },
    {
      name: "available rebate",
      selector: (row) => {
        return <span title={row.available_rebate}>{row.available_rebate}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.4,
      // wrap: true,
    },

    {
      name: "personal deposit",
      selector: (row) => {
        return <span title={row.personal_deposit}>{row.personal_deposit}</span>;
      },
      reorder: true,
      grow: 0.7,
      // wrap: true,
    },

    {
      name: "personal withdraw",
      selector: (row) => {
        return (
          <span title={row.personal_withdraw}>{row.personal_withdraw}</span>
        );
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
                <p className="main-heading">IB Rebate Report</p>
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
                          url={`${Url}/datatable/ib_rebate_report.php`}
                          column={columns}
                          sort="2"
                          refresh={refresh}
                          search={searchBy}
                          param={param}
                          searchWord={searchKeyword}
                          csv="datatable/ib_rebate_report_export.php"
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
}

export default Ib_rebate_report;
