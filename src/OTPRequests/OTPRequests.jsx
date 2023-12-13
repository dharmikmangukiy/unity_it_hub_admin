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

const OTPRequests = () => {
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
      name: "user_name",
    },
    {
      label: "Email",
      value: false,
      name: "user_email",
    },
    {
      label: "phone",
      value: false,
      name: "user_phone",
    },
    {
      label: "country",
      value: false,
      name: "user_country",
    },
    // {
    //   label: "expire",
    //   value: false,
    //   name: "expire",
    // },
  ]);

  const column = [
    {
      name: "SR.NO",
      minWidth: "72px",

      selector: (row) => {
        return <span>{row.sr_no}</span>;
      },
      // wrap: true,
      reorder: true,
      grow: 0.1,
    },
    {
      name: "Name",
      selector: (row) => {
        return <span title={row.user_name}>{row.user_name}</span>;
      },
      sortable: true,
      // wrap: true,
      reorder: true,
      grow: 0.4,
    },

    {
      name: "email",
      selector: (row) => {
        return <span title={row.user_email}>{row.user_email}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "phone",
      selector: (row) => {
        return <span title={row.user_phone}>{row.user_phone}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },

    {
      name: "country",
      selector: (row) => {
        return <span title={row.user_country}>{row.user_country}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "otp",
      selector: (row) => {
        return <span title={row.otp}>{row.otp}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "password",
      selector: (row) => {
        return <span title={row.password}>{row.password}</span>;
      },
      reorder: true,
      grow: 0.3,
    },
    {
      name: "expire",
      selector: (row) => {
        return <span title={row.expire}>{row.expire}</span>;
      },
      reorder: true,
      grow: 0.3,
    },
    {
      name: "register",
      selector: (row) => {
        return (
          <span
            className={`status-${
              row.is_register == "Yes" ? "active" : "in-active"
            }`}
          >
            {row.is_register}
          </span>
        );
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
                <p className="main-heading">OTP Requests</p>
                <CommonFilter
                  date="yes"
                  search={searchBy}
                  setParam={setParam}
                  selectDynamic1={{
                    data: {
                      0: "Expired",
                      1: "Not Expired",
                    },
                    keyName: "expire",
                    label: "Expire",
                  }}
                  selectDynamic={{
                    data: {
                      0: "All",
                      1: "register user",
                      2: "Not Register User",
                    },
                    keyName: "user_register",
                    label: "Register",
                  }}
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
                          url={`${Url}/datatable/get_otp_requests_register.php`}
                          column={column}
                          sort="1"
                          refresh={refresh}
                          search={searchBy}
                          param={param}
                          setResData={setResData}
                          searchWord={searchKeyword}
                          //   csv="datatable/mt5_bonus_list_export.php"
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

export default OTPRequests;
