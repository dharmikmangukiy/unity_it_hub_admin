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

function Mt5_wise_ib_master_ib_list() {
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
    {
      label: "ib email",
      value: false,
      name: "ib_email",
    },
    {
      label: "ib name",
      value: false,
      name: "ib_name",
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
      name: "master ib email",
      selector: (row) => {
        return <span title={row.master_ib_email}>{row.master_ib_email}</span>;
      },
      reorder: true,
      grow: 0.7,
      // wrap: true,
    },
    {
      name: "master ib name",
      selector: (row) => {
        return <span title={row.master_ib_name}>{row.master_ib_name}</span>;
      },
      reorder: true,
      grow: 0.7,
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
                <p className="main-heading">MT5 Wise IB & Master IB</p>
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
                          url={`${Url}/datatable/mt5_wise_ib_master_ib_list.php`}
                          column={columns}
                          sort="2"
                          refresh={refresh}
                          search={searchBy}
                          param={param}
                          searchWord={searchKeyword}
                          csv="datatable/mt5_wise_ib_master_ib_list_export.php"
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

export default Mt5_wise_ib_master_ib_list;
