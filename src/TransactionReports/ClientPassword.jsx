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

const ClientPassword = () => {
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
    // {
    //   label: "password",
    //   value: false,
    //   name: "password",
    // },
    {
      label: "phone",
      value: false,
      name: "phone",
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
      name: "password",
      selector: (row) => {
        return <span title={row.password}>{row.password}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
    },
    {
      name: "phone",
      selector: (row) => {
        return <span title={row.phone}>{row.phone}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.4,
    },
  ];

  return (
    <div>
      <div className="app-content--inner">
        <div className="app-content--inner__wrapper mh-100-vh">
          <div style={{ opacity: 1 }}>
            <Grid container>
              <Grid item md={12} lg={12} xl={12}>
                <p className="main-heading">Client Password</p>
                <CommonFilter
                  search={searchBy}
                  setParam={setParam}
                  searchWord={setSearchKeyword}
                  sales_manager_list={resData.sales_manager_list}
                  ib_users_list={resData.ib_users_list}
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
                          url={`${Url}/datatable/client_password_list.php`}
                          setResData={setResData}
                          column={column}
                          sort="0"
                          refresh={refresh}
                          search={searchBy}
                          param={param}
                          searchWord={searchKeyword}
                          csv="datatable/client_password_list_export.php"
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

export default ClientPassword;
