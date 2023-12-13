import React, { useState } from "react";
import { FormControl, Grid, MenuItem, Select } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import { Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import { ColorButton } from "../common/CustomElement";
import { Button } from "@mui/material";
import CommonTable from "../common/CommonTable";
import { useNavigate } from "react-router-dom";
import CustomImageModal from "../common/CustomImageModal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Url } from "../global";
import CommonFilter from "../common/CommonFilter";

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

const RoleManagement = () => {
  const [param, setParam] = useState({
    start_date: "",
    end_date: "",
  });
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [checkStatus, setcheckStatus] = useState("");
  const [searchBy, setSearchBy] = useState([
    {
      label: "REFERENCE NO",
      value: false,
      name: "reference_no",
    },
    {
      label: "NAME",
      value: false,
      name: "name",
    },
    {
      label: "WALLET CODE",
      value: false,
      name: "wallet_code",
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
      label: "REMARK",
      value: false,
      name: "deposit_remarks",
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
      wrap: true,
      grow: 0.1,
    },
    {
      name: "REFERENCE NO.",
      selector: (row) => {
        return <span title={row.refrence_no}>{row.refrence_no}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.7,
      wrap: true,
    },
    {
      name: "DATE",
      selector: (row) => {
        return <span title={row.date}>{row.date}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 1,
      wrap: true,
    },
    {
      name: "NAME",
      selector: (row) => {
        return <span title={row.name}>{row.name}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 1,
      wrap: true,
    },
    {
      name: "WALLET CODE",
      selector: (row) => {
        return <span title={row.wallet_code}>{row.wallet_code}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.5,
      wrap: true,
    },
    {
      name: "PAYMENT METHOD",
      selector: (row) => {
        return <span title={row.method}>{row.method}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.5,
      wrap: true,
    },
    {
      name: "AMOUNT",
      selector: (row) => {
        return <span title={row.amount}>{row.amount}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 0.5,
      wrap: true,
    },
    {
      name: "REMARK",
      selector: (row) => {
        return <span title={row.deposit_remarks}>{row.deposit_remarks}</span>;
      },
      sortable: true,
      reorder: true,
      grow: 1,
      wrap: true,
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
      grow: 0.5,
      wrap: true,
    },
  ];

  return (
    <div>
      <div className="app-content--inner">
        <div className="app-content--inner__wrapper mh-100-vh">
          <div style={{ opacity: 1 }}>
            <Grid container>
              <Grid item md={12} lg={12} xl={12}>
                <p className="main-heading">Role Management</p>
                <CommonFilter
                  search={searchBy}
                  setParam={setParam}
                  searchWord={setSearchKeyword}
                  setcheckStatus={setcheckStatus}
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
                          url={`${Url}/datatable/role_list.php`}
                          column={columns}
                          sort="2"
                          refresh={refresh}
                          search={searchBy}
                          param={param}
                          searchWord={searchKeyword}
                          checkStatus={checkStatus}
                          csv="datatable/deposit_list_export.php"
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

export default RoleManagement;
