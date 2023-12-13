import "./withdraw_history.css";
import React, { useState } from "react";
import { FormControl, Grid, MenuItem, Select } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import { Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import { ColorButton } from "../common/CustomElement";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CommonFilter from "../common/CommonFilter";
import CommonTable from "../common/CommonTable";
import { Url } from "../global";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NewDate from "../common/NewDate";

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  "label + &": {
    marginTop: theme.spacing(0),
  },
  "& .MuiInputBase-input": {
    borderRadius: 9,
    position: "relative",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #ced4da",
    fontSize: 16,
    padding: "8px 26px 8px 10px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:focus": {
      borderRadius: 9,
      borderColor: "#80bdff",
    },
  },
}));

const WithdrawHistory = () => {
  const [param, setParam] = useState({
    start_date: "",
    end_date: "",
  });
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [checkStatus, setcheckStatus] = useState("");
  const [resData, setResData] = useState({});
  const [searchBy, setSearchBy] = useState([
    {
      label: "NAME",
      value: false,
      name: "name",
    },
    {
      label: "ACCOUNT NO",
      value: false,
      name: "account_no",
    },
    {
      label: "PAYMENT METHOD",
      value: false,
      name: "payment_method",
    },
    {
      label: "AMOUNT",
      value: false,
      name: "amount",
    },
    {
      label: "REMARKS",
      value: false,
      name: "remarks",
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
          <span title={row.date}>
            {" "}
            <NewDate newDate={row.date} />
          </span>
        );
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.4,
    },
    {
      name: "NAME",
      selector: (row) => {
        return <span title={row.name}>{row.name}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.6,
    },
    {
      name: "ACCOUNT NO",
      selector: (row) => {
        return <span title={row.mt5_id}>{row.mt5_id}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.5,
    },
    {
      name: "PAYMENT METHOD",
      selector: (row) => {
        return <span title={row.method}>{row.method}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.5,
    },
    {
      name: "AMOUNT",
      selector: (row) => {
        return <span title={row.amount}>{row.amount}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.5,
    },
    {
      name: "REMARKS",
      selector: (row) => {
        return <span title={row.remarks}>{row.remarks}</span>;
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 1,
    },
    {
      name: "STATUS",
      selector: (row) => {
        return (
          <span
            className={
              row.status == "1"
                ? "status-text-approved"
                : row.status == "2"
                ? "status-text-rejected"
                : "status-text-pending"
            }
            title={
              row.status == "1"
                ? "Approved"
                : row.status == "2"
                ? "Rejected"
                : "Pending"
            }
          >
            {row.status == "1"
              ? "Approved"
              : row.status == "2"
              ? "Rejected"
              : "Pending"}
          </span>
        );
      },
      sortable: true,
      reorder: true,
      // wrap: true,
      grow: 0.5,
    },
    {
      name: "Telegram Verified",
      selector: (row) => {
        return (
          <span
            className={
              row.telegram_verified == "1"
                ? "status-text-approved"
                : row.telegram_verified == "0"
                ? "status-text-pending"
                : ""
            }
            title={
              row.telegram_verified == "1"
                ? "Yes"
                : row.telegram_verified == "0"
                ? "NO"
                : ""
            }
          >
            {row.telegram_verified == "1"
              ? "Yes"
              : row.telegram_verified == "0"
              ? "No"
              : ""}
          </span>
        );
      },
      sortable: true,
      reorder: true,
      grow: 0.3,
      wrap: true,
    },
    {
      name: "approve ip",
      selector: (row) => {
        return (
          <span title={row.approve_ip_address}>{row.approve_ip_address}</span>
        );
      },
      reorder: true,
      // wrap: true,
      grow: 0.3,
    },
    {
      name: "manager name",
      selector: (row) => {
        return <span title={row.manager_name}>{row.manager_name}</span>;
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
                <p className="main-heading">Withdraw History</p>
                <CommonFilter
                  search={searchBy}
                  setParam={setParam}
                  searchWord={setSearchKeyword}
                  setcheckStatus={setcheckStatus}
                  sales_manager_list={resData.sales_manager_list}
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
                          url={`${Url}/datatable/withdraw_list.php`}
                          column={columns}
                          sort="1"
                          refresh={refresh}
                          search={searchBy}
                          param={param}
                          searchWord={searchKeyword}
                          setResData={setResData}
                          checkStatus={checkStatus}
                          csv="datatable/withdraw_list_export.php"
                        />
                      </Grid>
                    </Grid>
                  </CardContent>

                  <Grid container>
                    <Grid item md={6}>
                      <div className="row1 boxSection">
                        <div className="card padding-9 animate fadeLeft boxsize">
                          <div className="row">
                            <div className="col s12 m12 text-align-center">
                              <h5 className="mb-0">
                                {resData.total_withdrawal_footer}
                              </h5>
                              <p className="no-margin">Total Withdrawal</p>
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
                              <h5 className="mb-0">{resData.total_withdraw}</h5>
                              <p className="no-margin">Withdrawal</p>
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

export default WithdrawHistory;
