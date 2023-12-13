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

const FantasticFourList = (prop) => {
  const navigate = useNavigate();

  const [refresh, setRefresh] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [param, setParam] = useState({});
  const [checkStatus, setcheckStatus] = useState("");
  const [resData, setResData] = useState({});

  const [searchBy, setSearchBy] = useState([
    {
      label: "Email",
      value: false,
      name: "user_email",
    },
    {
      label: "wallet code",
      value: false,
      name: "wallet_code",
    },
    {
      label: "Name",
      value: false,
      name: "user_name",
    },
    {
      label: "Current Lot",
      value: false,
      name: "user_current_lot",
    },
    {
      label: "lot size",
      value: false,
      name: "lot_size",
    },
    {
      label: "tour name",
      value: false,
      name: "tour_name",
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
      name: "DATE",
      selector: (row) => {
        return (
          <span title={row.added_datetime}>
            <NewDate newDate={row.added_datetime} />
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
        return <span title={row.user_name}>{row.user_name}</span>;
      },
      //   sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.4,
    },

    {
      name: "email",
      selector: (row) => {
        return <span title={row.user_email}>{row.user_email}</span>;
      },
      //   sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.7,
    },
    {
      name: "current lot",
      selector: (row) => {
        return <span title={row.user_current_lot}>{row.user_current_lot}</span>;
      },
      //   sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.3,
    },

    {
      name: "lot size",
      selector: (row) => {
        return <span title={row.lot_size}>{row.lot_size}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.3,
    },
    {
      name: "tour name",
      selector: (row) => {
        return <span title={row.tour_name}>{row.tour_name}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.3,
    },
    {
      name: "time duration",
      selector: (row) => {
        return <span title={row.time_duration}>{row.time_duration}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.3,
    },
    {
      name: "announce date",
      selector: (row) => {
        return (
          <>
            {row.winner_announce_datetime == "" ? (
              ""
            ) : (
              <span title={row.winner_announce_datetime}>
                <NewDate newDate={row.winner_announce_datetime} />
              </span>
            )}
          </>
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
      name: "winner",
      selector: (row) => {
        return (
          <span
            className={
              row.is_winner == "1"
                ? "status-text-approved"
                : row.is_winner == "2"
                ? "status-text-rejected"
                : "status-text-pending"
            }
            title={row.is_winner == "1" ? "winner" : ""}
          >
            {row.is_winner == "1" ? "winner" : ""}
          </span>
        );
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.2,
    },
    {
      name: "winner announce",
      selector: (row) => {
        return (
          <span title={row.is_winner_announce == "1" ? "Yes" : "No"}>
            {row.is_winner_announce == "1" ? "Yes" : "No"}
          </span>
        );
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.2,
    },
  ];

  return (
    <div>
      <div className="app-content--inner">
        <div className="app-content--inner__wrapper mh-100-vh">
          <div style={{ opacity: 1 }}>
            <Grid container>
              <Grid item md={12} lg={12} xl={12}>
                <p className="main-heading">Fantastic Four Report</p>
                <CommonFilter
                  search={searchBy}
                  searchWord={setSearchKeyword}
                  setParam={setParam}
                  FantasticFour="true"
                  userlist={resData.users_list}
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
                          url={`${Url}/datatable/fantastic_four_offer_list.php`}
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

export default FantasticFourList;
