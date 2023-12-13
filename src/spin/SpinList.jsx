import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import { Paper } from "@mui/material";

import CommonFilter from "../common/CommonFilter";
import CommonTable from "../common/CommonTable";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { IsApprove, Url } from "../global";
import { useNavigate } from "react-router-dom";
import "react-confirm-alert/src/react-confirm-alert.css";
import NewDate from "../common/NewDate";

const SpinList = (prop) => {
  const navigate = useNavigate();

  const [refresh, setRefresh] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [param, setParam] = useState({});
  const [checkStatus, setcheckStatus] = useState("");
  const [resData, setResData] = useState({});

  const [searchBy, setSearchBy] = useState([
    {
      label: "MT5",
      value: false,
      name: "mt5_acc_no",
    },
    {
      label: "type",
      value: false,
      name: "spin_type",
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
      name: "claim DATE",
      selector: (row) => {
        return (
          <span title={row.spin_claim_date_time}>
            <NewDate newDate={row.spin_claim_date_time} />
          </span>
        );
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.5,
    },
    {
      name: "name",
      selector: (row) => {
        return <span title={row.spin_user_name}>{row.spin_user_name}</span>;
      },
      //   sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.4,
    },

    {
      name: "MT5",
      selector: (row) => {
        return <span title={row.mt5_acc_no}>{row.mt5_acc_no}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.3,
    },
    {
      name: "type",
      selector: (row) => {
        return <span title={row.spin_type}>{row.spin_type}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.3,
    },
    {
      name: "email",
      selector: (row) => {
        return <span title={row.spin_user_email}>{row.spin_user_email}</span>;
      },
      //   sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.7,
    },
    {
      name: "from user name",
      selector: (row) => {
        return <span title={row.from_user_name}>{row.from_user_name}</span>;
      },
      //   sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.7,
    },
    {
      name: "from user email",
      selector: (row) => {
        return <span title={row.from_user_email}>{row.from_user_email}</span>;
      },
      //   sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.7,
    },
    {
      name: "claim amount",
      selector: (row) => {
        return (
          <span title={row.spin_claim_amount}>{row.spin_claim_amount}</span>
        );
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.3,
    },
    // {
    //   name: "status text",
    //   selector: (row) => {
    //     return (
    //       <span title={row.redeem_status_text}>{row.redeem_status_text}</span>
    //     );
    //   },
    //   sortable: true,
    //   reorder: true,
    //   // wrap: true,
    //   grow: 0.5,
    // },
    {
      name: "STATUS",
      selector: (row) => {
        return (
          <span
            className={
              row.redeem_status == "1"
                ? "status-text-approved"
                : row.redeem_status == "2"
                ? "status-text-rejected"
                : "status-text-pending"
            }
            title={
              row.redeem_status == "1"
                ? "Redeemed"
                : row.redeem_status == "2"
                ? "Missed"
                : "Pending"
            }
          >
            {row.redeem_status == "1"
              ? "Redeemed"
              : row.redeem_status == "2"
              ? "Missed"
              : "Pending"}
          </span>
        );
      },
      sortable: true,
      reorder: true,
      // wrap: true,
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
                <p className="main-heading">Spin Report</p>
                <CommonFilter
                  search={searchBy}
                  searchWord={setSearchKeyword}
                  setParam={setParam}
                  selectDynamic={{
                    data: { 0: "Pending", 1: "Redeemed", 2: "Missed" },
                    keyName: "redeem_status",
                    label: "Status",
                  }}
                  userlist={resData.users_list}
                  lastUpdatedBy={resData.modified_by_users}
                />
                <br />
                <Paper
                  elevation={2}
                  style={{ borderRadius: "10px" }}
                  className="pending-all-15px"
                >
                  {/* <div className='actionGroupButton'>
                                        <Button variant="contained" onClick={handleClickOpen}>Add</Button>
                                    </div>
                                    <br /> */}
                  <CardContent className="py-3">
                    <Grid container spacing={2}>
                      <Grid item sm={12} md={12} lg={12}>
                        <CommonTable
                          url={`${Url}/datatable/spin_and_win_list.php`}
                          column={columns}
                          sort="1"
                          refresh={refresh}
                          search={searchBy}
                          searchWord={searchKeyword}
                          param={param}
                          checkStatus={checkStatus}
                          setResData={setResData}
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

export default SpinList;
